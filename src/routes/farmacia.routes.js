const { Router } = require('express');
const { getFarmaciaTurno } = require('../controllers/farmacia.controller');

const router = Router();

router.get('/turno', getFarmaciaTurno);

router.get('/test', (req, res) => {
    res.json({ message: 'Ruta de prueba funcionando correctamente' });
  });
  

module.exports = router;
