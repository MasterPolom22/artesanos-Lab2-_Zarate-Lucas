const db = require('../config/db');

exports.crear = (nombre) => {
  return db.promise().query('INSERT INTO tag (nombre) VALUES (?)', [nombre]);
};

exports.obtenerTodos = () => {
  return db.promise().query('SELECT * FROM tag');
};
