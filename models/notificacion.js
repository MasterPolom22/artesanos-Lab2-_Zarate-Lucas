const db = require('../config/db');

exports.crear = (id_usuario, tipo, mensaje) => {
  return db.promise().query(
    'INSERT INTO notificacion (id_usuario, tipo, mensaje) VALUES (?, ?, ?)',
    [id_usuario, tipo, mensaje]
  );
};

exports.obtenerNoLeidas = (id_usuario) => {
  return db.promise().query(
    'SELECT * FROM notificacion WHERE id_usuario = ? AND leido = 0',
    [id_usuario]
  );
};
