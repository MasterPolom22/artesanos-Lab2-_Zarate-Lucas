const db = require('../config/db');

// Crear un nuevo álbum
exports.crear = async ({ id_usuario, titulo, tipo = 'normal' }) => {
  const [result] = await db.promise().query(
    'INSERT INTO album (id_usuario, titulo, tipo) VALUES (?, ?, ?)',
    [id_usuario, titulo, tipo]
  );
  return result.insertId;
};

// Obtener todos los álbumes de un usuario
exports.obtenerPorUsuario = async (idUsuario) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM album WHERE id_usuario = ?',
    [idUsuario]
  );
  return rows;
};

// Obtener un álbum por ID y usuario (para ver, editar o validar)
exports.obtenerPorId = async (id_album, id_usuario) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM album WHERE id_album = ? AND id_usuario = ?',
    [id_album, id_usuario]
  );
  return rows[0];
};

// Editar un álbum
exports.editar = async ({ id_album, id_usuario, titulo }) => {
  await db.promise().query(
    'UPDATE album SET titulo = ? WHERE id_album = ? AND id_usuario = ?',
    [titulo, id_album, id_usuario]
  );
};

// Eliminar un álbum y sus imágenes asociadas
exports.eliminarConImagenes = async (id_album, id_usuario) => {
  await db.promise().query(
    'DELETE FROM imagen WHERE id_album = ?',
    [id_album]
  );

  const [result] = await db.promise().query(
    'DELETE FROM album WHERE id_album = ? AND id_usuario = ?',
    [id_album, id_usuario]
  );

  return result.affectedRows > 0;
};
