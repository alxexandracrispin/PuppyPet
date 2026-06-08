// Express Router organiza las rutas de un módulo de forma independiente
// y las registra en app.js bajo el prefijo /api/usuarios
const express = require("express");
const router = express.Router();

// Se importa el controlador que contiene la lógica de cada endpoint de usuarios
const UsuarioController = require("../controllers/usuarioController");

// Obtiene el listado completo de usuarios registrados en el sistema
router.get("/", UsuarioController.obtenerUsuarios);

// Registra un nuevo usuario con sus datos personales y contraseña encriptada
router.post("/registro", UsuarioController.registrarUsuario);

// Valida las credenciales del usuario y devuelve sus datos si son correctas
router.post("/login", UsuarioController.loginUsuario);

// Actualiza los datos personales de un usuario específico por su ID
router.put("/:id", UsuarioController.actualizarUsuario);

// Actualiza la contraseña de un usuario específico por su ID
router.put("/:id/password", UsuarioController.actualizarPassword);

// Actualiza el rol de un usuario (CLIENTE o ADMIN) — acción exclusiva del panel admin
router.put("/:id/rol", UsuarioController.actualizarRol);

// Activa o desactiva un usuario — acción exclusiva del panel admin
router.put("/:id/estado", UsuarioController.actualizarEstado);

// Obtiene los datos públicos de un usuario específico por su ID
// Se declara al final para que no intercepte rutas con segmento fijo como /registro o /login
router.get("/:id", UsuarioController.obtenerUsuario);

// Se exporta el router para ser registrado en app.js
module.exports = router;
