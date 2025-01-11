const getFarmaciaTurno = async (req, res) => {
  try {
      const { getEvents } = require('../utils/googleCalendar'); // Verifica que esto apunte correctamente a googleCalendar.js
      const events = await getEvents();

      if (events.length === 0) {
          return res.status(404).json({ message: 'No se encontró farmacia de turno en el calendario' });
      }

      const farmaciaTurno = events[0].summary; // Nombre de la farmacia del calendario
      const [result] = await pool.query('SELECT * FROM farmacias WHERE nombre = ?', [farmaciaTurno]);

      if (result.length > 0) {
          const farmacia = result[0];
          res.json({
              turno: farmacia.nombre,
              ubicacion: farmacia.direccion,
              imagen_url: farmacia.imagen_url,
              google_maps_url: farmacia.google_maps_url
          });
      } else {
          res.status(404).json({ message: `No se encontraron detalles adicionales para la farmacia ${farmaciaTurno}`, turno: farmaciaTurno });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener farmacia de turno', error: error.message });
  }
};

