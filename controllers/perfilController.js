const usuarioModel = require('../models/usuarioModel');

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

  verMiPerfil: async (req, res) => {
    const usuarioId = req.session.usuario.id;

    try {
      const usuario = await usuarioModel.obtenerPorId(usuarioId);

      if (!usuario) {
        req.flash('error_msg', 'Usuario no encontrado');
        return res.redirect('/');
      }

      res.render('perfil/ver', {
        title: 'Mi Perfil',
        usuario
      });
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      req.flash('error_msg', 'Error interno');
      res.redirect('/');
    }
  },

  mostrarFormularioEdicion: async (req, res) => {
    const usuarioId = req.session.usuario.id;

    try {
      const usuario = await usuarioModel.obtenerPorId(usuarioId);

      if (!usuario) {
        req.flash('error_msg', 'Usuario no encontrado');
        return res.redirect('/perfil');
      }

      res.render('perfil/editar', {
        title: 'Editar Perfil',
        usuario
      });
    } catch (err) {
      console.error('Error al cargar edición de perfil:', err);
      req.flash('error_msg', 'Error interno');
      res.redirect('/perfil');
    }
  },

  actualizarPerfil: async (req, res) => {
    const usuarioId = req.session.usuario.id;
    const { nombre, apellido, email, intereses, antecedentes } = req.body;
    const nuevaImagen = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      await usuarioModel.actualizar({
        id: usuarioId,
        nombre,
        apellido,
        email,
        intereses,
        antecedentes,
        imagen_perfil: nuevaImagen
      });

      req.flash('success_msg', 'Perfil actualizado con éxito');
      res.redirect('/perfil');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      req.flash('error_msg', 'Error al actualizar el perfil');
      res.redirect('/perfil/editar');
    }
  }
};