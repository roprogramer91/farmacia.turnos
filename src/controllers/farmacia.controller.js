const { getEvents } = require('../utils/googleCalendar'); // Importa correctamente el util
const pool = require('../../config/database'); // Asegúrate de que esta ruta sea correcta.

const getFarmaciaTurno = async (req, res) => {
  try {
    const events = await getEvents();
    if (events.length === 0) {
      return res.status(404).json({ message: 'No se encontró farmacia de turno en el calendario' });
    }

    const farmaciaTurno = events[0].summary;

    console.log('Nombre de farmacia del calendario:', farmaciaTurno);
    const [result] = await pool.query('SELECT * FROM farmacias WHERE nombre = ?', [`Farmacia ${farmaciaTurno}`]);
    console.log('Resultado de la consulta:', result);

    if (result.length > 0) {
      const farmacia = result[0];
      res.json({
        turno: farmacia.nombre,
        ubicacion: farmacia.direccion,
        google_maps_url: farmacia.google_maps_url,
        imagen_url: farmacia.imagen_url,
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


const getFarmacias = async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(), // Obtener eventos desde ahora
      singleEvents: true, // Solo eventos únicos
      orderBy: 'startTime', // Ordenados por fecha de inicio
    });

    const events = response.data.items;

    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No se encontraron eventos en el calendario' });
    }

    // Extraer información relevante
    const farmacias = events.map(event => ({
      nombre: event.summary || 'Sin nombre',
      ubicacion: event.location || 'Sin ubicación',
      descripcion: event.description || 'Sin descripción',
      inicio: event.start?.date || 'Sin fecha de inicio',
      fin: event.end?.date || 'Sin fecha de fin',
    }));

    res.json(farmacias); // Devolver la lista de farmacias como JSON
  } catch (error) {
    console.error('Error al obtener farmacias:', error.message);
    res.status(500).json({ message: 'Error al obtener farmacias del calendario', error: error.message });
  }
};
module.exports = { getFarmaciaTurno, getFarmacias };
