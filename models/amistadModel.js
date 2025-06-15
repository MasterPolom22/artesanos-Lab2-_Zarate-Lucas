const db = require('../config/db');

exports.obtenerSolicitudesPendientes = async (usuarioId) => {
  const [rows] = await db.promise().query(
    `SELECT a.id_amistad, u.nombre, u.apellido, u.email
     FROM amistad a
     JOIN usuario u ON a.id_solicitante = u.id_usuario
     WHERE a.id_destinatario = ? AND a.estado = 'pendiente'`,
    [usuarioId]
  );
  return rows;
};

exports.actualizarEstado = async (idAmistad, usuarioId, estado) => {
  return db.promise().query(
    'UPDATE amistad SET estado = ? WHERE id_amistad = ? AND id_destinatario = ?',
    [estado, idAmistad, usuarioId]
  );
};

exports.enviarSolicitud = async (solicitante, destinatario) => {
  return db.promise().query(
    'INSERT INTO amistad (id_solicitante, id_destinatario, estado) VALUES (?, ?, "pendiente")',
    [solicitante, destinatario]
  );
};

exports.obtenerAmigosConfirmados = async (usuarioId) => {
  const [rows] = await db.promise().query(
    `SELECT u.id_usuario, u.nombre, u.apellido, u.email
     FROM amistad a
     JOIN usuario u ON 
       (u.id_usuario = a.id_solicitante AND a.id_destinatario = ?) OR
       (u.id_usuario = a.id_destinatario AND a.id_solicitante = ?)
     WHERE a.estado = 'aceptada' AND u.id_usuario != ?`,
    [usuarioId, usuarioId, usuarioId]
  );
  return rows;
};

exports.listarUsuariosDisponibles = async (usuarioId) => {
  const [rows] = await db.promise().query(
    `SELECT id_usuario, nombre, apellido, email
     FROM usuario
     WHERE id_usuario != ?
     AND id_usuario NOT IN (
       SELECT id_destinatario FROM amistad WHERE id_solicitante = ?
       UNION
       SELECT id_solicitante FROM amistad WHERE id_destinatario = ?
     )`,
    [usuarioId, usuarioId, usuarioId]
  );
  return rows;
};

exports.verificarAmistad = async (idUsuario1, idUsuario2) => {
  const [rows] = await db.promise().query(
    `SELECT * FROM amistad 
     WHERE estado = 'aceptada' AND 
     ((id_solicitante = ? AND id_destinatario = ?) OR 
      (id_solicitante = ? AND id_destinatario = ?))`,
    [idUsuario1, idUsuario2, idUsuario2, idUsuario1]
  );
  return rows.length > 0;
};
exports.eliminarAmistad = async (usuarioId, amigoId) => {
  return db.promise().query(
    `DELETE FROM amistad 
     WHERE (id_solicitante = ? AND id_destinatario = ?)
        OR (id_solicitante = ? AND id_destinatario = ?)`,
    [usuarioId, amigoId, amigoId, usuarioId]
  );
};