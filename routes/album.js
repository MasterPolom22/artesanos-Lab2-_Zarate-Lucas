// routes/album.js
const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
const albumController = require('../controllers/albumController');

// Middleware para proteger las rutas
const { protegerRuta } = albumController;

// Mostrar formulario para subir imagen
router.get('/subir', protegerRuta, albumController.mostrarFormularioSubida);

// Procesar subida de imagen
router.post('/subir', protegerRuta, multer.single('imagen'), albumController.subirImagen);

// Ver imágenes propias
router.get('/mis-imagenes', protegerRuta, albumController.verMisImagenes);

// Mostrar álbumes del usuario
router.get('/mis-albumes', protegerRuta, albumController.verMisAlbumes);

// Crear álbum
router.get('/crear', protegerRuta, albumController.mostrarFormularioCrear);
router.post('/crear', protegerRuta, albumController.crearAlbum);

// Editar álbum
router.get('/editar/:id', protegerRuta, albumController.mostrarFormularioEditar);
router.post('/editar/:id', protegerRuta, albumController.editarAlbum);

// Eliminar imagen individual (🔁 ANTES que /:id)
router.post('/imagen/eliminar/:id', protegerRuta, albumController.eliminarImagen);

// Eliminar álbum
router.post('/eliminar/:id', protegerRuta, albumController.eliminarAlbum);

// Mostrar imágenes de un álbum específico
router.get('/:id', protegerRuta, albumController.verAlbumPorId);


module.exports = router;