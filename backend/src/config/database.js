// sqlite3 es el módulo que permite conectarse y operar con la base de datos SQLite
const sqlite3 = require("sqlite3").verbose();

// path permite construir rutas de archivos de forma compatible
// con cualquier sistema operativo (Windows, Mac, Linux)
const path = require("path");

// Se construye la ruta absoluta al archivo de base de datos.
// __dirname representa la carpeta donde se encuentra este archivo (config/)
const dbPath = path.join(__dirname, "../database/puppypet.db");

// Se abre la conexión con la base de datos SQLite.
// Si el archivo puppypet.db no existe, SQLite lo crea automáticamente.
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Error al conectar con SQLite:", error.message);
  } else {
    console.log("Conectado a SQLite correctamente");
  }
});

// Se exporta la conexión para que pueda ser utilizada
// por los modelos y controladores del proyecto
module.exports = db;
