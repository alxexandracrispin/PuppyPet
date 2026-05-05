const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuarioController");

router.get("/", UsuarioController.obtenerUsuarios);
router.post("/registro", UsuarioController.registrarUsuario);

module.exports = router;