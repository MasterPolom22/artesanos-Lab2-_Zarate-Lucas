const db = require('../config/db');

// Agregar un nuevo comentario
exports.agregar = async ({ id_imagen, id_usuario, texto }) => {
  return db.promise().query(
    'INSERT INTO comentario (id_imagen, id_usuario, texto, fecha) VALUES (?, ?, ?, NOW())',
    [id_imagen, id_usuario, texto]
  );
};

// Obtener todos los comentarios de una imagen
exports.obtenerPorImagen = async (id_imagen) => {
  const [rows] = await db.promise().query(
    `SELECT c.*, u.nombre, u.apellido
     FROM comentario c
     JOIN usuario u ON c.id_usuario = u.id_usuario
     WHERE c.id_imagen = ?
     ORDER BY c.fecha DESC`,
    [id_imagen]
  );
  return rows;
};
