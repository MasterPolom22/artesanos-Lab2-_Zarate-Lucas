router.get('/compartidas', protegerRuta, albumController.verCompartidas);
router.get('/compartida/:id', protegerRuta, albumController.verImagenCompartida);
router.post('/compartida/:id/comentar', protegerRuta, albumController.comentar);