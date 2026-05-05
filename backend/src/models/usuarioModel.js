const db = require("../config/database");

const UsuarioModel = {
  obtenerTodos: (callback) => {
    const sql = `
      SELECT
        id_usuario,
        nombre,
        apellido,
        rut,
        correo,
        direccion,
        comuna,
        ciudad,
        rol,
        estado
      FROM usuario
      ORDER BY id_usuario DESC
    `;

    db.all(sql, [], callback);
  },

  crearUsuario: (usuario, callback) => {
    const sql = `
      INSERT INTO usuario (
        nombre,
        apellido,
        rut,
        correo,
        password,
        direccion,
        comuna,
        ciudad,
        rol,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      usuario.nombre,
      usuario.apellido,
      usuario.rut,
      usuario.correo,
      usuario.password,
      usuario.direccion,
      usuario.comuna,
      usuario.ciudad,
      usuario.rol || "CLIENTE",
      usuario.estado || "ACTIVO"
    ];

    db.run(sql, params, function (error) {
      callback(error, this?.lastID);
    });
  },

  buscarPorCorreo: (correo, callback) => {
    const sql = `
      SELECT *
      FROM usuario
      WHERE correo = ?
      LIMIT 1
    `;

    db.get(sql, [correo], callback);
  },

  obtenerPorId: (idUsuario, callback) => {
    const sql = `
      SELECT
        id_usuario,
        nombre,
        apellido,
        rut,
        correo,
        direccion,
        comuna,
        ciudad,
        rol,
        estado
      FROM usuario
      WHERE id_usuario = ?
      LIMIT 1
    `;

    db.get(sql, [idUsuario], callback);
  }
};

module.exports = UsuarioModel;