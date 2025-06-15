const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const authController = require('../controllers/authController');

// Registro
router.get('/register', authController.mostrarFormularioRegistro);
router.post('/register', upload.single('imagen_perfil'), authController.registrarUsuario);

// Login
router.get('/login', authController.mostrarFormularioLogin);
router.post('/login', authController.loginUsuario);

// Logout
router.get('/logout', authController.logout);


module.exports = router;