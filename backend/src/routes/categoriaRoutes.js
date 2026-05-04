const express = require("express");
const router = express.Router();

const CategoriaController = require("../controllers/categoriaController");

router.get("/", CategoriaController.obtenerCategorias);

module.exports = router;