// server.js
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const dotenv = require('dotenv');
const app = express();

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
require('./config/db');

// Configuración del motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public folder
app.use(express.static(path.join(__dirname, 'public')));

// method-override para permitir PUT y DELETE en formularios
app.use(methodOverride('_method'));

// Configuración de sesiones
app.use(session({
  secret: 'secretoartesanos', // podés poner esto en .env también
  resave: false,
  saveUninitialized: false
}));

// Flash para mensajes temporales
app.use(flash());


// Variables globales disponibles en las vistas
app.use((req, res, next) => {
  res.locals.session = req.session; // 👈 NECESARIO para acceder a session.usuario en layout
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.get('/dashboard', (req, res) => {
  if (!req.session.usuario) {
    req.flash('error_msg', 'Debés iniciar sesión');
    return res.redirect('/auth/login');
  }

  res.render('dashboard', { title: 'Dashboard', usuario: req.session.usuario });
});


// Rutas base
const authRoutes = require('./routes/auth'); // crea el archivo luego
app.use('/auth', authRoutes);

const albumRoutes = require('./routes/album');
app.use('/album', albumRoutes);

const imagenRoutes = require('./routes/imagen');
app.use('/imagen', imagenRoutes);

// Página de inicio (temporal)
app.get('/', (req, res) => {
  res.render('index', { title: 'Inicio' });
});

const perfilRoutes = require('./routes/perfil');
app.use('/perfil', perfilRoutes);

const amistadRoutes = require('./routes/amistad');
app.use('/amistad', amistadRoutes);



app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  // ✅ Agregá esta línea
  res.locals.notificaciones = req.session.notificaciones || [];

  // ✅ Y asegurate de limpiar después de mostrar
  req.session.notificaciones = [];

  next();
});

// Página 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});




// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
