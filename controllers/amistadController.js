const amistadModel = require('../models/amistadModel');
const usuarioModel = require('../models/usuarioModel');

function protegerRuta(req, res, next) {
  if (!req.session.usuario) {
    req.flash('error_msg', 'Debés iniciar sesión');
    return res.redirect('/auth/login');
  }
  next();
}

module.exports = {
  protegerRuta,

  verSolicitudes: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    try {
      const solicitudes = await amistadModel.obtenerSolicitudesPendientes(usuarioId);
      res.render('friendship/solicitudes', { title: 'Solicitudes de Amistad', solicitudes });
    } catch (err) {
      console.error('Error al obtener solicitudes:', err);
      req.flash('error_msg', 'Error al cargar las solicitudes');
      res.redirect('/');
    }
  },

  aceptarSolicitud: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    const idAmistad = req.params.id;
    try {
      await amistadModel.actualizarEstado(idAmistad, usuarioId, 'aceptada');
      req.flash('success_msg', 'Solicitud aceptada');
      res.redirect('/amistad/solicitudes');
    } catch (err) {
      console.error('Error al aceptar solicitud:', err);
      req.flash('error_msg', 'Error al aceptar la solicitud');
      res.redirect('/amistad/solicitudes');
    }
  },

  rechazarSolicitud: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    const idAmistad = req.params.id;
    try {
      await amistadModel.actualizarEstado(idAmistad, usuarioId, 'rechazada');
      req.flash('success_msg', 'Solicitud rechazada');
      res.redirect('/amistad/solicitudes');
    } catch (err) {
      console.error('Error al rechazar solicitud:', err);
      req.flash('error_msg', 'Error al rechazar la solicitud');
      res.redirect('/amistad/solicitudes');
    }
  },

  verUsuarios: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    try {
      const usuarios = await amistadModel.listarUsuariosDisponibles(usuarioId);
      res.render('friendship/listar-usuarios', { title: 'Buscar amigos', usuarios });
    } catch (err) {
      console.error('Error al listar usuarios:', err);
      req.flash('error_msg', 'No se pudieron cargar los usuarios');
      res.redirect('/');
    }
  },

  enviarSolicitud: async (req, res) => {
    const solicitante = req.session.usuario.id;
    const destinatario = req.params.id;
    try {
      await amistadModel.enviarSolicitud(solicitante, destinatario);
      req.flash('success_msg', 'Solicitud enviada');
      res.redirect('/amistad/usuarios');
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      req.flash('error_msg', 'No se pudo enviar la solicitud');
      res.redirect('/amistad/usuarios');
    }
  },

  verAmigos: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    try {
      const amigos = await amistadModel.obtenerAmigosConfirmados(usuarioId);
      res.render('friendship/amigos', { title: 'Mis Amigos', amigos });
    } catch (err) {
      console.error('Error al obtener amigos:', err);
      req.flash('error_msg', 'No se pudo cargar la lista de amigos');
      res.redirect('/');
    }
  },
  eliminarAmigo: async (req, res) => {
  const usuarioId = req.session.usuario.id;
  const amigoId = req.params.id;

  try {
    await amistadModel.eliminarAmistad(usuarioId, amigoId);
    req.flash('success_msg', 'Amigo eliminado');
    res.redirect('/amistad/amigos');
  } catch (err) {
    console.error('Error al eliminar amigo:', err);
    req.flash('error_msg', 'No se pudo eliminar el amigo');
    res.redirect('/amistad/amigos');
  }
}

};
