// Se importa la conexión a la base de datos SQLite configurada en database.js
const db = require("../config/database");

const UsuarioModel = {

  // Obtiene todos los usuarios registrados, excluyendo la contraseña por seguridad
  obtenerTodos: (callback) => {
    const sql = `
      SELECT id_usuario, nombre, apellido, rut, correo,
             direccion, comuna, ciudad, rol, estado
      FROM usuario
      ORDER BY id_usuario DESC
    `;
    db.all(sql, [], callback); // db.all devuelve un arreglo con todos los registros encontrados
  },

  // Obtiene un usuario por ID incluyendo su contraseña encriptada,
  // necesario para validar el cambio de contraseña desde el perfil
  obtenerPorIdConPassword: (idUsuario, callback) => {
    const sql = `
      SELECT id_usuario, nombre, apellido, rut, correo, password,
             direccion, comuna, ciudad, rol, estado
      FROM usuario WHERE id_usuario = ? LIMIT 1
    `;
    db.get(sql, [idUsuario], callback); // db.get devuelve solo el primer registro encontrado
  },

  // Inserta un nuevo usuario en la base de datos.
  // El rol y estado tienen valores por defecto si no se envían
  crearUsuario: (usuario, callback) => {
    const sql = `
      INSERT INTO usuario (
        nombre, apellido, rut, correo, password,
        direccion, comuna, ciudad, rol, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      usuario.nombre, usuario.apellido, usuario.rut, usuario.correo,
      usuario.password, usuario.direccion, usuario.comuna, usuario.ciudad,
      usuario.rol    || "CLIENTE", // Si no se especifica rol, se asigna CLIENTE por defecto
      usuario.estado || "ACTIVO"   // Si no se especifica estado, se asigna ACTIVO por defecto
    ];
    db.run(sql, params, function (error) {
      callback(error, this?.lastID); // lastID retorna el ID del usuario recién creado
    });
  },

  // Busca un usuario por correo electrónico para el proceso de login.
  // Retorna todos los campos incluyendo la contraseña encriptada para compararla con bcrypt
  buscarPorCorreo: (correo, callback) => {
    const sql = `SELECT * FROM usuario WHERE correo = ? LIMIT 1`;
    db.get(sql, [correo], callback);
  },

  // Obtiene los datos públicos de un usuario por ID, sin exponer su contraseña
  obtenerPorId: (idUsuario, callback) => {
    const sql = `
      SELECT id_usuario, nombre, apellido, rut, correo,
             direccion, comuna, ciudad, rol, estado
      FROM usuario WHERE id_usuario = ? LIMIT 1
    `;
    db.get(sql, [idUsuario], callback);
  },

  // Actualiza los datos personales de un usuario.
  // No permite modificar el RUT ni el rol por seguridad
  actualizarDatosUsuario: (idUsuario, datos, callback) => {
    const sql = `
      UPDATE usuario
      SET nombre = ?, apellido = ?, correo = ?,
          direccion = ?, comuna = ?, ciudad = ?
      WHERE id_usuario = ?
    `;
    const params = [
      datos.nombre, datos.apellido, datos.correo,
      datos.direccion, datos.comuna, datos.ciudad, idUsuario
    ];
    db.run(sql, params, function (error) {
      callback(error, this?.changes); // changes indica cuántas filas fueron modificadas
    });
  },

  // Actualiza solo la contraseña de un usuario.
  // Se recibe ya encriptada desde el controlador
  actualizarPassword: (idUsuario, passwordEncriptada, callback) => {
    const sql = `UPDATE usuario SET password = ? WHERE id_usuario = ?`;
    db.run(sql, [passwordEncriptada, idUsuario], function (error) {
      callback(error, this?.changes);
    });
  },

  // Actualiza el rol de un usuario (CLIENTE o ADMIN).
  // Solo el panel de administración puede ejecutar esta acción
  actualizarRol: (idUsuario, rol, callback) => {
    const sql = `UPDATE usuario SET rol = ? WHERE id_usuario = ?`;
    db.run(sql, [rol, idUsuario], function (error) {
      callback(error, this?.changes);
    });
  },

  // Actualiza el estado de un usuario (ACTIVO o INACTIVO).
  // Un usuario INACTIVO no puede iniciar sesión en el sistema
  actualizarEstado: (idUsuario, estado, callback) => {
    const sql = `UPDATE usuario SET estado = ? WHERE id_usuario = ?`;
    db.run(sql, [estado, idUsuario], function (error) {
      callback(error, this?.changes);
    });
  }
};

module.exports = UsuarioModel;
