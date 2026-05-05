const UsuarioModel = require("../models/usuarioModel");

const UsuarioController = {
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

      const nuevoUsuario = {
        nombre,
        apellido,
        rut,
        correo,
        password,
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
  }
};

module.exports = UsuarioController;