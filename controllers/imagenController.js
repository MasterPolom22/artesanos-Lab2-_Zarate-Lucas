// controllers/imagenController.js
const imagenModel = require('../models/imagenModel');
const comentarioModel = require('../models/comentarioModel');

function protegerRuta(req, res, next) {
  if (!req.session.usuario) {
    req.flash('error_msg', 'Debés iniciar sesión');
    return res.redirect('/auth/login');
  }
  next();
}

const verMisImagenes = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  try {
    const imagenes = await imagenModel.obtenerPorUsuario(usuarioId);
    res.render('album/mis-imagenes', { title: 'Mis Imágenes', imagenes });
  } catch (err) {
    console.error('Error al obtener imágenes:', err);
    req.flash('error_msg', 'Error al cargar las imágenes');
    res.redirect('/perfil');
  }
};

const verCompartidas = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  try {
    const imagenes = await imagenModel.obtenerCompartidas(usuarioId);
    res.render('album/imagenes-compartidas', { title: 'Imágenes Compartidas', imagenes });
  } catch (err) {
    console.error('Error al obtener compartidas:', err);
    req.flash('error_msg', 'Error al cargar imágenes compartidas');
    res.redirect('/perfil');
  }
};

const eliminarImagen = async (req, res) => {
  const imagenId = req.params.id;
  const usuarioId = req.session.usuario.id;

  try {
    const permiso = await imagenModel.verificarPropiedad(imagenId, usuarioId);
    if (!permiso) {
      req.flash('error_msg', 'No tenés permiso para eliminar esta imagen');
      return res.redirect('/album/mis-imagenes');
    }

    await imagenModel.eliminar(imagenId);
    req.flash('success_msg', 'Imagen eliminada correctamente');
    res.redirect('/album/mis-imagenes');
  } catch (err) {
    console.error('Error al eliminar imagen:', err);
    req.flash('error_msg', 'Error al eliminar la imagen');
    res.redirect('/album/mis-imagenes');
  }
};

const verImagenCompartida = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const { id } = req.params;

  try {
    const imagenes = await imagenModel.obtenerCompartidasDeAmigos(usuarioId);
    const imagen = imagenes.find(img => img.id_imagen == id);

    if (!imagen) {
      req.flash('error_msg', 'Imagen no disponible');
      return res.redirect('/album/compartidas');
    }

    const comentarios = await comentarioModel.obtenerPorImagen(id);

    res.render('album/ver-compartida', {
      title: imagen.titulo,
      imagen,
      comentarios
    });
  } catch (err) {
    console.error('Error al cargar imagen compartida:', err);
    req.flash('error_msg', 'Error al cargar la imagen');
    res.redirect('/album/compartidas');
  }
};

const comentarImagen = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const { id } = req.params;
  const { texto } = req.body;

  try {
    await comentarioModel.agregar({ id_imagen: id, id_usuario: usuarioId, texto });
    res.redirect(`/album/compartida/${id}`);
  } catch (err) {
    console.error('Error al comentar:', err);
    req.flash('error_msg', 'No se pudo agregar el comentario');
    res.redirect(`/album/compartida/${id}`);
  }
};

const verMisPublicaciones = async (req, res) => {
  const usuarioId = req.session.usuario.id;

  try {
    const imagenes = await imagenModel.obtenerPorUsuario(usuarioId);
    res.render('album/mis-publicaciones', {
      title: 'Mis Publicaciones',
      imagenes
    });
  } catch (err) {
    console.error('Error al cargar mis publicaciones:', err);
    req.flash('error_msg', 'No se pudieron cargar tus imágenes');
    res.redirect('/perfil');
  }
};

const verPublicacionIndividual = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const { id } = req.params;

  try {
    const imagenes = await imagenModel.obtenerPorUsuario(usuarioId);
    const imagen = imagenes.find(img => img.id_imagen == id);

    if (!imagen) {
      req.flash('error_msg', 'Imagen no encontrada o no te pertenece');
      return res.redirect('/imagen/mis-publicaciones');
    }

    const comentarios = await comentarioModel.obtenerPorImagen(id);

    res.render('album/ver-publicacion', {
      title: imagen.titulo,
      imagen,
      comentarios
    });

  } catch (err) {
    console.error('Error al cargar la publicación:', err);
    req.flash('error_msg', 'No se pudo cargar la imagen');
    res.redirect('/imagen/mis-publicaciones');
  }
};

const editarImagen = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  const compartida = req.body.compartida === '1';

  try {
    const imagen = await imagenModel.obtenerPorId(id);

    if (!imagen || imagen.id_usuario !== usuarioId) {
      req.flash('error_msg', 'No tenés permiso para editar esta imagen');
      return res.redirect('/imagen/mis-publicaciones');
    }

    await imagenModel.actualizar({ id, titulo, descripcion, compartida });

    req.flash('success_msg', 'Imagen actualizada correctamente');
    res.redirect('/imagen/mis-publicaciones');
  } catch (err) {
    console.error('Error al editar la imagen:', err);
    req.flash('error_msg', 'No se pudo editar la imagen');
    res.redirect('/imagen/mis-publicaciones');
  }
};

const mostrarFormularioEditar = async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const { id } = req.params;

  try {
    const imagen = await imagenModel.obtenerPorId(id);

    if (!imagen || imagen.id_usuario !== usuarioId) {
      req.flash('error_msg', 'No tenés permiso para editar esta imagen');
      return res.redirect('/imagen/mis-publicaciones');
    }

    res.render('imagen/editar', {
      title: 'Editar Imagen',
      imagen
    });
  } catch (err) {
    console.error('Error al cargar la imagen:', err);
    req.flash('error_msg', 'No se pudo cargar la imagen');
    res.redirect('/imagen/mis-publicaciones');
  }
};





module.exports = {
  protegerRuta,
  editarImagen,
  mostrarFormularioEditar,
  verPublicacionIndividual,
  verMisPublicaciones,
  verMisImagenes,
  verCompartidas,
  eliminarImagen,
  verImagenCompartida,
  comentarImagen,
};
