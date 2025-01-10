const { getEvents } = require('../utils/googleCalendar');

const getFarmaciaTurno = async (req, res) => {
  try {
    const events = await getEvents();

    // Filtrar el evento del día actual
    const today = new Date().toISOString().split('T')[0];
    const eventoHoy = events.find(event => event.start.date === today || event.start.dateTime?.startsWith(today));

    if (eventoHoy) {
      res.json({
        turno: eventoHoy.summary,
        ubicacion: eventoHoy.location || 'Ubicación no disponible',
      });
    } else {
      res.status(404).json({ message: 'No hay farmacia de turno para hoy' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener farmacia de turno' });
  }
};

module.exports = { getFarmaciaTurno };
