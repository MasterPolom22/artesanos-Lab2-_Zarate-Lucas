// controllers/albumController.js
const albumModel = require('../models/albumModel');
const imagenModel = require('../models/imagenModel');


// Middleware para proteger rutas
function protegerRuta(req, res, next) {
  if (!req.session.usuario) {
    req.flash('error_msg', 'Debés iniciar sesión');
    return res.redirect('/auth/login');
  }
  next();
}

module.exports = {
  protegerRuta,

  // GET /album/subir
  mostrarFormularioSubida: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    try {
      const albums = await albumModel.obtenerPorUsuario(usuarioId);
      res.render('album/subir', { title: 'Subir imagen', albums });
    } catch (err) {
      console.error('Error al cargar álbumes:', err);
      req.flash('error_msg', 'No se pudieron cargar los álbumes');
      res.redirect('/album/subir');
    }
  },

  subirImagen: async (req, res) => {
  const { id_album, titulo, descripcion } = req.body;
  const url = req.file ? `/uploads/${req.file.filename}` : null;
  const compartida = req.body.compartida === '1';
  const id_usuario = req.session.usuario.id; // 👈 esta es la clave

  if (!url) {
    req.flash('error_msg', 'Debés subir una imagen');
    return res.redirect('/album/subir');
  }

  try {
    await imagenModel.subir({ id_album, url, titulo, descripcion, compartida, id_usuario });
    req.flash('success_msg', 'Imagen subida con éxito');
    res.redirect('/album/mis-imagenes');
  } catch (err) {
    console.error('Error al subir imagen:', err);
    req.flash('error_msg', 'No se pudo subir la imagen');
    res.redirect('/album/subir');
  }
},


  // GET /album/mis-imagenes
  verMisImagenes: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    try {
      const imagenes = await imagenModel.obtenerPorUsuario(usuarioId);
      res.render('album/mis-imagenes', { title: 'Mis Imágenes', imagenes });
    } catch (err) {
      console.error('Error al obtener imágenes:', err);
      req.flash('error_msg', 'Error al obtener tus imágenes');
      res.redirect('/perfil');
    }
  },

  // GET /album/mis-albumes
  verMisAlbumes: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    try {
      const albums = await albumModel.obtenerPorUsuario(usuarioId);
      const imagenes = await imagenModel.obtenerPorUsuario(usuarioId);

      const albumesConImagenes = albums.map(album => {
        album.imagenes = imagenes.filter(img => img.id_album === album.id_album);
        return album;
      });

      res.render('album/mis-albumes', {
        title: 'Mis Álbumes',
        albumes: albumesConImagenes
      });
    } catch (err) {
      console.error('Error al mostrar álbumes:', err);
      req.flash('error_msg', 'No se pudieron cargar los álbumes');
      res.redirect('/');
    }
  },

  // GET /album/crear
  mostrarFormularioCrear: (req, res) => {
    res.render('album/crear', { title: 'Crear Álbum' });
  },

  // POST /album/crear
  crearAlbum: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    const { titulo } = req.body;

    try {
      await albumModel.crear({ id_usuario: usuarioId, titulo });
      req.flash('success_msg', 'Álbum creado con éxito');
      res.redirect('/album/mis-albumes');
    } catch (err) {
      console.error('Error al crear álbum:', err);
      req.flash('error_msg', 'No se pudo crear el álbum');
      res.redirect('/album/crear');
    }
  },

  // GET /album/editar/:id
  mostrarFormularioEditar: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    const { id } = req.params;

    try {
      const album = await albumModel.obtenerPorId(id, usuarioId);
      if (!album) {
        req.flash('error_msg', 'Álbum no encontrado');
        return res.redirect('/album/mis-albumes');
      }

      res.render('album/editar', { title: 'Editar Álbum', album });
    } catch (err) {
      console.error('Error al cargar edición:', err);
      req.flash('error_msg', 'No se pudo cargar el álbum');
      res.redirect('/album/mis-albumes');
    }
  },

  // POST /album/editar/:id
  editarAlbum: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    const { id } = req.params;
    const { titulo } = req.body;

    try {
      await albumModel.editar({ id_album: id, id_usuario: usuarioId, titulo });
      req.flash('success_msg', 'Álbum actualizado');
      res.redirect('/album/mis-albumes');
    } catch (err) {
      console.error('Error al editar álbum:', err);
      req.flash('error_msg', 'No se pudo actualizar el álbum');
      res.redirect('/album/mis-albumes');
    }
  },

  // POST /album/eliminar/:id
  eliminarAlbum: async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const { id } = req.params;

  try {
    await albumModel.eliminarConImagenes(id, usuarioId);
    req.flash('success_msg', 'Álbum e imágenes eliminados');
    res.redirect('/album/mis-albumes');
  } catch (err) {
    console.error('Error al eliminar álbum:', err);
    req.flash('error_msg', 'No se pudo eliminar el álbum');
    res.redirect('/album/mis-albumes');
  }
},

  verAlbumPorId: async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.session.usuario.id;

  try {
    const album = await albumModel.obtenerPorId(id, usuarioId);
    if (!album) {
      req.flash('error_msg', 'Álbum no encontrado');
      return res.redirect('/album/mis-albumes');
    }

    const imagenes = await imagenModel.obtenerPorAlbum(id);

    res.render('album/album-id', {
      title: `Álbum: ${album.titulo}`,
      album,
      imagenes
    });
  } catch (err) {
    console.error('Error al cargar álbum:', err);
    req.flash('error_msg', 'Error al cargar las imágenes');
    res.redirect('/album/mis-albumes');
  }
},

eliminarImagen: async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const { id } = req.params;

  try {
    const pertenece = await imagenModel.verificarPropiedad(id, usuarioId);
    if (!pertenece) {
      req.flash('error_msg', 'No tenés permiso para eliminar esta imagen');
      return res.redirect('/album/mis-imagenes');
    }

    await imagenModel.eliminar(id);
    req.flash('success_msg', 'Imagen eliminada correctamente');
    res.redirect('/album/mis-imagenes');
  } catch (err) {
    console.error('Error al eliminar imagen:', err);
    req.flash('error_msg', 'No se pudo eliminar la imagen');
    res.redirect('/album/mis-imagenes');
  }
}




};



exports.sverCompartidas = async (req, res) => {
  const usuarioId = req.session.usuario.id;

  try {
    const imagenes = await imagenModel.obtenerCompartidas(usuarioId);
    res.render('imagen/compartidas', {
      title: 'Imágenes Compartidas',
      imagenes
    });
  } catch (err) {
    console.error('Error al cargar imágenes compartidas:', err);
    req.flash('error_msg', 'Error al cargar las imágenes');
    res.redirect('/');
  }
};
