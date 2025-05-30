const { Router } = require('express');
const { getFarmaciaTurno, getFarmacias, getFarmaciasAyerHoyManiana } = require('../controllers/farmacia.controller');
const pool = require('../../config/database');

const router = Router();

router.get('/turno', getFarmaciaTurno);


//Debbug DEV
router.get('/test', (req, res) => {
    res.json({ message: 'Ruta de prueba funcionando correctamente' });
  });
  
  router.get('/getFarmacias', getFarmacias);

  router.get('/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        res.json({ message: 'Conexión exitosa', tables: rows });
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        res.status(500).json({ message: 'Error al conectar con la base de datos', error: error.message });
    }

});

router.get('/ayerhoymaniana', getFarmaciasAyerHoyManiana);

module.exports = router;
