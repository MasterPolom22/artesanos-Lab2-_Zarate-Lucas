
const db = require('../config/db');

exports.compartirImagen = (id_imagen, id_usuario_destino) => {
  return db.promise().query(
    'INSERT INTO compartir (id_imagen, id_usuario_destino) VALUES (?, ?)',
    [id_imagen, id_usuario_destino]
  );
};

exports.obtenerCompartidosConUsuario = (id_usuario) => {
  return db.promise().query(
    `SELECT * FROM compartir WHERE id_usuario_destino = ?`,
    [id_usuario]
  );
};
