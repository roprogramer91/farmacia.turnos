const { Router } = require('express');
const { getFarmaciaTurno } = require('../controllers/farmacia.controller');

const router = Router();

router.get('/turno', getFarmaciaTurno);

module.exports = router;
