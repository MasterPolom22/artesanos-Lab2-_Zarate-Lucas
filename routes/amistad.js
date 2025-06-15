const express = require('express');
const router = express.Router();
const amistadController = require('../controllers/amistadController');
const { protegerRuta } = amistadController;

// Solicitudes de amistad
router.get('/solicitudes', protegerRuta, amistadController.verSolicitudes);
router.post('/aceptar/:id', protegerRuta, amistadController.aceptarSolicitud);
router.post('/rechazar/:id', protegerRuta, amistadController.rechazarSolicitud);

// Buscar usuarios
router.get('/usuarios', protegerRuta, amistadController.verUsuarios);
router.post('/enviar/:id', protegerRuta, amistadController.enviarSolicitud); // ✅ CORREGIDO

// Amigos confirmados
router.get('/amigos', protegerRuta, amistadController.verAmigos);

router.post('/eliminar/:id', protegerRuta, amistadController.eliminarAmigo);

module.exports = router;
