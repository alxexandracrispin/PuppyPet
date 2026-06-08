// Lee los archivos SQL desde disco para crear la estructura y datos iniciales de la base de datos.
// Se usa path.join para construir rutas compatibles con cualquier sistema operativo
const fs   = require("fs");
const path = require("path");
const db   = require("../config/database");

const schemaPath = path.join(__dirname, "schema.sql");
const seedPath   = path.join(__dirname, "seed.sql");

// Se leen los archivos como texto plano para luego ejecutarlos como sentencias SQL
const schema = fs.readFileSync(schemaPath, "utf8");
const seed   = fs.readFileSync(seedPath, "utf8");

// db.serialize garantiza que schema.sql se ejecute antes que seed.sql.
// Primero se crean las tablas, luego se insertan los datos de prueba
db.serialize(() => {
  db.exec(schema, (error) => {
    if (error) {
      console.error("Error al crear estructura:", error.message);
      return;
    }

    console.log("Estructura de base de datos creada correctamente");

    db.exec(seed, (errorSeed) => {
      if (errorSeed) {
        console.error("Error al cargar datos iniciales:", errorSeed.message);
        return;
      }

      console.log("Datos iniciales cargados correctamente");
      db.close();
    });
  });
});
