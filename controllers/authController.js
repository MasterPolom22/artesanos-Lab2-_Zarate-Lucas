const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');

module.exports = {
  mostrarFormularioRegistro: (req, res) => {
    res.render('auth/register', { title: 'Registro' });
  },

  registrarUsuario: async (req, res) => {
    const { nombre, apellido, email, password, intereses, antecedentes } = req.body;
    const imagen_perfil = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const existe = await usuarioModel.buscarPorEmail(email);
      if (existe) {
        req.flash('error_msg', 'El email ya está registrado');
        return res.redirect('/auth/register');
      }

      const hashed = await bcrypt.hash(password, 10);
      await usuarioModel.crear({
        nombre,
        apellido,
        email,
        password: hashed,
        intereses,
        antecedentes,
        imagen_perfil
      });

      req.flash('success_msg', 'Registro exitoso. Ahora podés iniciar sesión');
      res.redirect('/auth/login');
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      req.flash('error_msg', 'Ocurrió un error al registrarse');
      res.redirect('/auth/register');
    }
  },

  mostrarFormularioLogin: (req, res) => {
    res.render('auth/login', { title: 'Login' });
  },

  loginUsuario: async (req, res) => {
    const { email, password } = req.body;

    try {
      const usuario = await usuarioModel.buscarPorEmail(email);
      if (!usuario) {
        req.flash('error_msg', 'Usuario no encontrado');
        return res.redirect('/auth/login');
      }

      const hashedPassword = usuario.contraseña || usuario.password;
      if (!hashedPassword) {
        req.flash('error_msg', 'No se encontró la contraseña del usuario');
        return res.redirect('/auth/login');
      }

      const esValida = await bcrypt.compare(password, hashedPassword);
      if (!esValida) {
        req.flash('error_msg', 'Contraseña incorrecta');
        return res.redirect('/auth/login');
      }

      req.session.usuario = {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        imagen: usuario.imagen_perfil
      };

      req.flash('success_msg', `¡Bienvenido, ${usuario.nombre}!`);
      res.redirect('/perfil');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      req.flash('error_msg', 'Error inesperado al iniciar sesión');
      res.redirect('/auth/login');
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
};