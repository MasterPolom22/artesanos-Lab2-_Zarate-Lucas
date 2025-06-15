const db = require('../config/db');

exports.etiquetar = (id_imagen, id_tag) => {
  return db.promise().query('INSERT INTO imagen_tag (id_imagen, id_tag) VALUES (?, ?)', [id_imagen, id_tag]);
};

exports.obtenerTagsDeImagen = (id_imagen) => {
  return db.promise().query(
    `SELECT t.* FROM imagen_tag it JOIN tag t ON it.id_tag = t.id_tag WHERE it.id_imagen = ?`,
    [id_imagen]
  );
};
