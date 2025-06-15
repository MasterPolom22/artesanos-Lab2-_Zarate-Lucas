const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const perfilController = require('../controllers/perfilController');

// Middleware de protección
const { protegerRuta } = perfilController;

// Ver perfil propio
router.get('/', protegerRuta, perfilController.verMiPerfil);

// Editar perfil
router.get('/editar', protegerRuta, perfilController.mostrarFormularioEdicion);
router.post('/editar', protegerRuta, upload.single('imagen_perfil'), perfilController.actualizarPerfil);

module.exports = router;