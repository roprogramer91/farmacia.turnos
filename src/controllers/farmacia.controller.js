const { getEvents } = require('../utils/googleCalendar'); // Importa correctamente el util
const pool = require('../../config/database'); // Asegúrate de que esta ruta sea correcta.

const getFarmaciaTurno = async (req, res) => {
  try {
    const events = await getEvents();
    if (events.length === 0) {
      return res.status(404).json({ message: 'No se encontró farmacia de turno en el calendario' });
    }

    const farmaciaTurno = events[0].summary;
    console.log (farmaciaTurno);
    const [result] = await pool.query('SELECT * FROM farmacias WHERE nombre = ?', [farmaciaTurno]);

    if (result.length > 0) {
      const farmacia = result[0];
      res.json({
        turno: farmacia.nombre,
        ubicacion: farmacia.direccion,
        imagen_url: farmacia.imagen_url,
        google_maps_url: farmacia.google_maps_url,
      });
    } else {
      res.status(404).json({
        message: `No se encontraron detalles adicionales para la farmacia ${farmaciaTurno}`,
        turno: farmaciaTurno,
      });
    }
  } catch (error) {
    console.error('Error en /turno:', error.message);
    res.status(500).json({ message: 'Error al obtener farmacia de turno', error: error.message });
  }
};

module.exports = { getFarmaciaTurno }; // Asegúrate de exportarlo correctamente.
