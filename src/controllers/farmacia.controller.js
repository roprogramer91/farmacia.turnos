const pool = require('../../config/database');
const { getEvents } = require('../utils/googleCalendar');

const getFarmaciaTurno = async (req, res) => {
  try {
      const eventos = await getEvents();
      if (eventos.length === 0) {
          return res.status(404).json({ message: 'No hay farmacias de turno disponibles' });
      }

      const nombreTurno = eventos[0]?.summary || 'Desconocido';
      console.log('Nombre de farmacia del turno:', nombreTurno);

      const [result] = await pool.query('SELECT * FROM farmacias WHERE nombre = ?', [nombreTurno]);
      console.log('Resultados de la base de datos:', result);

      if (result.length > 0) {
          const farmacia = result[0];
          res.json({
              turno: `Farmacia ${farmacia.nombre}`, // Agrega el prefijo aquí
              ubicacion: farmacia.direccion,
              imagen_url: farmacia.imagen_url,
              google_maps_url: `https://www.google.com/maps?q=${encodeURIComponent(farmacia.direccion)}`,
          });
      } else {
          res.status(404).json({
              message: `No se encontraron detalles adicionales para la farmacia ${nombreTurno}`,
              turno: `Farmacia ${nombreTurno}`, // Asegúrate de que el prefijo se incluya incluso sin datos adicionales
          });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener farmacia de turno', error: error.message });
  }
};

module.exports = { getFarmaciaTurno };


