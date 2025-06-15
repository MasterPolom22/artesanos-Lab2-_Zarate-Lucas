const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');

// Middleware
const { protegerRuta } = imagenController;

// Ver imágenes propias
router.get('/mis-imagenes', protegerRuta, imagenController.verMisImagenes);

// Ver imágenes compartidas por amigos
router.get('/compartidas', protegerRuta, imagenController.verCompartidas);

// Ver detalle de una imagen compartida
router.get('/compartida/:id', protegerRuta, imagenController.verImagenCompartida);


// Comentar imagen compartida
router.post('/compartida/:id/comentar', protegerRuta, imagenController.comentarImagen);

// Eliminar imagen individual
router.post('/eliminar/:id', protegerRuta, imagenController.eliminarImagen);


router.get('/mis-publicaciones', protegerRuta, imagenController.verMisPublicaciones);
router.get('/publicacion/:id', protegerRuta, imagenController.verPublicacionIndividual);
router.post('/publicacion/:id/comentar', protegerRuta, imagenController.comentarImagen);

router.get('/editar/:id', protegerRuta, imagenController.mostrarFormularioEditar);
router.post('/editar/:id', protegerRuta, imagenController.editarImagen);


module.exports = router;
