const db = require('../config/db');

exports.buscarPorEmail = async (email) => {
  const [rows] = await db.promise().query(
    'SELECT id_usuario, nombre, apellido, email, contraseña, imagen_perfil, intereses, antecedentes FROM usuario WHERE email = ?',
    [email]
  );
  return rows[0];
};

exports.crear = (usuario) => {
  const { nombre, apellido, email, password, imagen_perfil, intereses, antecedentes } = usuario;
  return db.promise().query(
    'INSERT INTO usuario (nombre, apellido, email, contraseña, imagen_perfil, intereses, antecedentes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nombre, apellido, email, password, imagen_perfil, intereses, antecedentes]
  );
};

exports.obtenerPorId = async (id) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM usuario WHERE id_usuario = ?',
    [id]
  );
  return rows[0];
};

exports.obtenerNoAmigos = async (usuarioId) => {
  const [rows] = await db.promise().query(
    `SELECT id_usuario, nombre, apellido, email
     FROM usuario
     WHERE id_usuario != ? AND id_usuario NOT IN (
       SELECT id_destinatario FROM amistad WHERE id_solicitante = ?
       UNION
       SELECT id_solicitante FROM amistad WHERE id_destinatario = ?
     )`,
    [usuarioId, usuarioId, usuarioId]
  );
  return rows;
};

exports.actualizar = (usuario) => {
  const { id, nombre, apellido, email, intereses, antecedentes, imagen_perfil } = usuario;
  const sql = imagen_perfil
    ? `UPDATE usuario SET nombre = ?, apellido = ?, email = ?, intereses = ?, antecedentes = ?, imagen_perfil = ? WHERE id_usuario = ?`
    : `UPDATE usuario SET nombre = ?, apellido = ?, email = ?, intereses = ?, antecedentes = ? WHERE id_usuario = ?`;

  const params = imagen_perfil
    ? [nombre, apellido, email, intereses, antecedentes, imagen_perfil, id]
    : [nombre, apellido, email, intereses, antecedentes, id];

  return db.promise().query(sql, params);
};