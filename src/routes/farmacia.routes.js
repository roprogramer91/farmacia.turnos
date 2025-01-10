const { Router } = require('express');
const { getFarmaciaTurno } = require('../controllers/farmacia.controller');

const router = Router();

router.get('/turno', getFarmaciaTurno);

router.get('/test', (req, res) => {
    res.json({ message: 'Ruta de prueba funcionando correctamente' });
  });
  

  router.get('/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        res.json({ message: 'Conexión exitosa', tables: rows });
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        res.status(500).json({ message: 'Error al conectar con la base de datos', error: error.message });
    }
});

module.exports = router;
