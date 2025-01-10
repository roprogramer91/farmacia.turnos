const { getEvents } = require('../utils/googleCalendar');

const getFarmaciaTurno = async (req, res) => {
  try {
    console.log("Iniciando la obtención de eventos...");
    const events = await getEvents();

    console.log("Eventos obtenidos:", events);

    // Filtrar el evento del día actual
    const today = new Date().toISOString().split('T')[0];
    console.log("Fecha de hoy:", today);

    const eventoHoy = events.find(
      (event) =>
        event.start.date === today ||
        (event.start.dateTime && event.start.dateTime.startsWith(today))
    );

    if (eventoHoy) {
      console.log("Evento encontrado:", eventoHoy);
      res.json({
        turno: eventoHoy.summary,
        ubicacion: eventoHoy.location || 'Ubicación no disponible',
      });
    } else {
      console.log("No se encontró evento para hoy.");
      res.status(404).json({ message: 'No hay farmacia de turno para hoy' });
    }
  } catch (error) {
    console.error('Error al obtener farmacia de turno:', error.message);
    res.status(500).json({ message: 'Error al obtener farmacia de turno' });
  }
};

module.exports = { getFarmaciaTurno };
