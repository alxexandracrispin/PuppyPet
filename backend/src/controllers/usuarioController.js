// Se importa el modelo de usuario y bcryptjs,
// librería que permite encriptar contraseñas convirtiéndolas en un hash irreversible
const UsuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");

// Elimina puntos y guiones del RUT para normalizarlo antes de validarlo
const limpiarRut = (rut) => {
  return rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
};

// Aplica el algoritmo módulo 11 para calcular el dígito verificador del RUT.
// Itera los dígitos de derecha a izquierda multiplicando por 2-7 en ciclo
const calcularDv = (rutNumerico) => {
  let suma = 0;
  let multiplicador = 2;

  for (let i = rutNumerico.length - 1; i >= 0; i--) {
    suma += parseInt(rutNumerico.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvCalculado = 11 - resto;

  if (dvCalculado === 11) return "0";
  if (dvCalculado === 10) return "K";

  return dvCalculado.toString();
};

// Valida que el RUT tenga formato correcto y que su dígito verificador sea el calculado.
// Rechaza RUTs menores a 1.000.000 para descartar valores de prueba o ficticios
const validarRut = (rut) => {
  if (!rut) return false;

  const rutLimpio = limpiarRut(rut);

  if (rutLimpio.length < 2) return false;

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);

  if (!/^\d+$/.test(cuerpo)) return false;
  if (!/^[0-9K]$/.test(dv)) return false;

  const rutNumero = parseInt(cuerpo, 10);

  if (rutNumero <= 1000000) return false;

  const dvCorrecto = calcularDv(cuerpo);

  return dv === dvCorrecto;
};

// Valida que la contraseña cumpla la política de seguridad:
// mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
const validarPasswordSegura = (password) => {
  if (!password) return false;

  const tieneMinimo8   = password.length >= 8;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneNumero    = /[0-9]/.test(password);
  const tieneSimbolo   = /[^A-Za-z0-9]/.test(password);

  return (
    tieneMinimo8 &&
    tieneMayuscula &&
    tieneMinuscula &&
    tieneNumero &&
    tieneSimbolo
  );
};

const UsuarioController = {

  // Retorna el listado de todos los usuarios registrados, sin exponer contraseñas
  obtenerUsuarios: (req, res) => {
    UsuarioModel.obtenerTodos((error, usuarios) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al obtener usuarios",
          error: error.message
        });
      }

      return res.json(usuarios);
    });
  },

  // Registra un nuevo usuario: valida campos, verifica RUT, verifica contraseña segura,
  // comprueba que el correo no esté duplicado y almacena la contraseña encriptada con bcrypt
  registrarUsuario: (req, res) => {
    const {
      nombre,
      apellido,
      rut,
      correo,
      password,
      confirmarPassword,
      direccion,
      comuna,
      ciudad
    } = req.body || {};

    if (
      !nombre ||
      !apellido ||
      !rut ||
      !correo ||
      !password ||
      !confirmarPassword ||
      !direccion ||
      !comuna ||
      !ciudad
    ) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    if (!validarRut(rut)) {
      return res.status(400).json({
        mensaje:
          "El RUT ingresado no es válido. Debe ser mayor a 1.000.000 y respetar el dígito verificador."
      });
    }

    if (!validarPasswordSegura(password)) {
      return res.status(400).json({
        mensaje:
          "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo."
      });
    }

    if (password !== confirmarPassword) {
      return res.status(400).json({
        mensaje: "Las contraseñas no coinciden"
      });
    }

    UsuarioModel.buscarPorCorreo(correo, (errorBuscar, usuarioExistente) => {
      if (errorBuscar) {
        return res.status(500).json({
          mensaje: "Error al validar usuario existente",
          error: errorBuscar.message
        });
      }

      if (usuarioExistente) {
        return res.status(400).json({
          mensaje: "Ya existe un usuario registrado con este correo"
        });
      }

      // Se encripta la contraseña con bcrypt antes de guardarla;
      // el número 10 indica cuántas veces se aplica el algoritmo (más alto = más seguro pero más lento)
      const passwordEncriptada = bcrypt.hashSync(password, 10);

      const nuevoUsuario = {
        nombre,
        apellido,
        rut,
        correo,
        password: passwordEncriptada,
        direccion,
        comuna,
        ciudad,
        rol: "CLIENTE",
        estado: "ACTIVO"
      };

      UsuarioModel.crearUsuario(nuevoUsuario, (errorCrear, idUsuario) => {
        if (errorCrear) {
          return res.status(500).json({
            mensaje: "Error al registrar usuario",
            error: errorCrear.message
          });
        }

        return res.status(201).json({
          mensaje: "Usuario registrado correctamente",
          idUsuario,
          usuario: {
            idUsuario,
            nombre,
            apellido,
            rut,
            correo,
            direccion,
            comuna,
            ciudad,
            rol: "CLIENTE",
            estado: "ACTIVO"
          }
        });
      });
    });
  },

  // Autentica a un usuario verificando el correo y comparando la contraseña
  // con el hash almacenado usando bcrypt
  loginUsuario: (req, res) => {
    const { correo, password } = req.body || {};

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    UsuarioModel.buscarPorCorreo(correo, (errorBuscar, usuario) => {
      console.log(
        "Resultado buscarPorCorreo:",
        errorBuscar,
        usuario
          ? {
            id_usuario: usuario.id_usuario,
            correo: usuario.correo,
            rol: usuario.rol,
            estado: usuario.estado
          }
          : null
      );

      if (errorBuscar) {
        return res.status(500).json({
          mensaje: "Error al validar usuario",
          error: errorBuscar.message
        });
      }

      if (!usuario) {
        return res.status(401).json({
          mensaje: "Correo o contraseña incorrectos"
        });
      }

      // Se compara la contraseña ingresada contra el hash almacenado en la base de datos.
      // bcrypt nunca desencripta: vuelve a hashear y compara el resultado
      const passwordCorrecta = bcrypt.compareSync(password, usuario.password);

      if (!passwordCorrecta) {
        return res.status(401).json({
          mensaje: "Correo o contraseña incorrectos"
        });
      }

      return res.status(200).json({
        mensaje: "Inicio de sesión correcto",
        usuario: {
          idUsuario: usuario.id_usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rut: usuario.rut,
          correo: usuario.correo,
          direccion: usuario.direccion,
          comuna: usuario.comuna,
          ciudad: usuario.ciudad,
          rol: usuario.rol,
          estado: usuario.estado
        }
      });
    });
  },

  // Actualiza los datos personales del usuario.
  // Verifica que el correo nuevo no pertenezca a otro usuario antes de guardar
  actualizarUsuario: (req, res) => {
    const { id } = req.params;

    const {
      nombre,
      apellido,
      correo,
      direccion,
      comuna,
      ciudad
    } = req.body || {};

    if (!id) {
      return res.status(400).json({
        mensaje: "Debe indicar el ID del usuario"
      });
    }

    if (
      !nombre ||
      !apellido ||
      !correo ||
      !direccion ||
      !comuna ||
      !ciudad
    ) {
      return res.status(400).json({
        mensaje: "Todos los campos editables son obligatorios"
      });
    }

    UsuarioModel.obtenerPorId(id, (errorBuscar, usuarioExistente) => {
      if (errorBuscar) {
        return res.status(500).json({
          mensaje: "Error al buscar usuario",
          error: errorBuscar.message
        });
      }

      if (!usuarioExistente) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado"
        });
      }

      UsuarioModel.buscarPorCorreo(correo, (errorCorreo, usuarioCorreo) => {
        if (errorCorreo) {
          return res.status(500).json({
            mensaje: "Error al validar correo",
            error: errorCorreo.message
          });
        }

        if (
          usuarioCorreo &&
          Number(usuarioCorreo.id_usuario) !== Number(id)
        ) {
          return res.status(400).json({
            mensaje: "El correo ingresado ya está registrado por otro usuario"
          });
        }

        const datosActualizados = {
          nombre,
          apellido,
          correo,
          direccion,
          comuna,
          ciudad
        };

        UsuarioModel.actualizarDatosUsuario(
          id,
          datosActualizados,
          (errorActualizar, cambios) => {
            if (errorActualizar) {
              return res.status(500).json({
                mensaje: "Error al actualizar usuario",
                error: errorActualizar.message
              });
            }

            if (cambios === 0) {
              return res.status(400).json({
                mensaje: "No se realizaron cambios en el usuario"
              });
            }

            return res.status(200).json({
              mensaje: "Datos del usuario actualizados correctamente",
              usuario: {
                idUsuario: Number(id),
                rut: usuarioExistente.rut,
                nombre,
                apellido,
                correo,
                direccion,
                comuna,
                ciudad,
                rol: usuarioExistente.rol,
                estado: usuarioExistente.estado
              }
            });
          }
        );
      });
    });
  },

  // Cambia la contraseña del usuario verificando primero que la actual sea correcta.
  // La nueva contraseña pasa por la misma política de seguridad que el registro
  actualizarPassword: (req, res) => {
    const { id } = req.params;

    const {
      passwordActual,
      nuevaPassword,
      confirmarNuevaPassword
    } = req.body || {};

    if (!id) {
      return res.status(400).json({
        mensaje: "Debe indicar el ID del usuario"
      });
    }

    if (!passwordActual || !nuevaPassword || !confirmarNuevaPassword) {
      return res.status(400).json({
        mensaje: "Todos los campos de contraseña son obligatorios"
      });
    }

    if (nuevaPassword !== confirmarNuevaPassword) {
      return res.status(400).json({
        mensaje: "La nueva contraseña y su confirmación no coinciden"
      });
    }

    if (!validarPasswordSegura(nuevaPassword)) {
      return res.status(400).json({
        mensaje:
          "La nueva contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo."
      });
    }

    UsuarioModel.obtenerPorIdConPassword(id, (errorBuscar, usuario) => {
      if (errorBuscar) {
        return res.status(500).json({
          mensaje: "Error al buscar usuario",
          error: errorBuscar.message
        });
      }

      if (!usuario) {
        return res.status(404).json({
          mensaje: "Usuario no encontrado"
        });
      }

      // Se compara la contraseña ingresada contra el hash almacenado en la base de datos.
      // bcrypt nunca desencripta: vuelve a hashear y compara el resultado
      const passwordActualCorrecta = bcrypt.compareSync(
        passwordActual,
        usuario.password
      );

      if (!passwordActualCorrecta) {
        return res.status(401).json({
          mensaje: "La contraseña actual no es correcta"
        });
      }

      // Se encripta la nueva contraseña con bcrypt antes de guardarla
      const nuevaPasswordEncriptada = bcrypt.hashSync(nuevaPassword, 10);

      UsuarioModel.actualizarPassword(
        id,
        nuevaPasswordEncriptada,
        (errorActualizar, cambios) => {
          if (errorActualizar) {
            return res.status(500).json({
              mensaje: "Error al actualizar contraseña",
              error: errorActualizar.message
            });
          }

          if (cambios === 0) {
            return res.status(400).json({
              mensaje: "No se realizaron cambios en la contraseña"
            });
          }

          return res.status(200).json({
            mensaje: "Contraseña actualizada correctamente"
          });
        }
      );
    });
  }
};

module.exports = UsuarioController;
