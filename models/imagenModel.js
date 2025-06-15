// models/imagenModel.js
const db = require('../config/db');

// Subir una nueva imagen
exports.subir = async ({ id_album, url, titulo, descripcion, compartida = false }) => {
  const [result] = await db.promise().query(
    `INSERT INTO imagen (id_album, url, titulo, descripcion, compartida)
     VALUES (?, ?, ?, ?, ?)`,
    [id_album, url, titulo, descripcion, compartida ? 1 : 0]
  );
  return result.insertId;
};

// Obtener imágenes por usuario (todas las imágenes de sus álbumes)
exports.obtenerPorUsuario = async (idUsuario) => {
  const [rows] = await db.promise().query(
    `SELECT i.*, a.titulo AS album_titulo
     FROM imagen i
     JOIN album a ON i.id_album = a.id_album
     WHERE a.id_usuario = ?`,
    [idUsuario]
  );
  return rows;
};

// Obtener imágenes por álbum
exports.obtenerPorAlbum = async (id_album) => {
  const [rows] = await db.promise().query(
    `SELECT * FROM imagen WHERE id_album = ?`,
    [id_album]
  );
  return rows;
};

// Eliminar una imagen (verificando propiedad)
exports.eliminar = async (id_imagen) => {
  await db.promise().query('DELETE FROM comentario WHERE id_imagen = ?', [id_imagen]); // Si tenés comentarios
  return db.promise().query('DELETE FROM imagen WHERE id_imagen = ?', [id_imagen]);
};

exports.verificarPropiedad = async (id_imagen, usuarioId) => {
  const [rows] = await db.promise().query(`
    SELECT i.id_imagen FROM imagen i
    JOIN album a ON i.id_album = a.id_album
    WHERE i.id_imagen = ? AND a.id_usuario = ?`,
    [id_imagen, usuarioId]
  );
  return rows.length > 0;
};

// Obtener imágenes compartidas por amigos
exports.obtenerCompartidas = async (idUsuario) => {
  const [rows] = await db.promise().query(
    `SELECT i.*, u.nombre, u.apellido
     FROM imagen i
     JOIN album a ON i.id_album = a.id_album
     JOIN usuario u ON a.id_usuario = u.id_usuario
     WHERE i.compartida = 1 AND a.id_usuario IN (
       SELECT CASE
         WHEN id_solicitante = ? THEN id_destinatario
         WHEN id_destinatario = ? THEN id_solicitante
         ELSE NULL
       END
       FROM amistad
       WHERE estado = 'aceptada'
     )`,
    [idUsuario, idUsuario]
  );
  return rows;
};

exports.subir = async ({ id_album, url, titulo, descripcion, compartida = false, id_usuario }) => {
  const [result] = await db.promise().query(
    `INSERT INTO imagen (id_album, url, titulo, descripcion, compartida, id_usuario)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_album, url, titulo, descripcion, compartida ? 1 : 0, id_usuario]
  );
  return result.insertId;
};
exports.obtenerCompartidasDeAmigos = async (usuarioId) => {
  const [rows] = await db.promise().query(
    `SELECT i.*, u.nombre, u.apellido
     FROM imagen i
     JOIN album a ON i.id_album = a.id_album
     JOIN usuario u ON a.id_usuario = u.id_usuario
     WHERE i.compartida = 1
       AND a.id_usuario IN (
         SELECT CASE 
           WHEN id_solicitante = ? THEN id_destinatario
           WHEN id_destinatario = ? THEN id_solicitante
         END
         FROM amistad
         WHERE estado = 'aceptada'
       )`,
    [usuarioId, usuarioId]
  );
  return rows;
};
exports.obtenerPorId = async (id_imagen) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM imagen WHERE id_imagen = ?',
    [id_imagen]
  );
  return rows[0]; // Devuelve una sola imagen o undefined
};

exports.actualizar = async ({ id, titulo, descripcion, compartida }) => {
  await db.promise().query(
    'UPDATE imagen SET titulo = ?, descripcion = ?, compartida = ? WHERE id_imagen = ?',
    [titulo, descripcion, compartida ? 1 : 0, id]
  );
};