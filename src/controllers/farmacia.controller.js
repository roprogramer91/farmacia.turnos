const { getEvents } = require('../utils/googleCalendar'); // Importa correctamente el util
const pool = require('../../config/database'); // Asegúrate de que esta ruta sea correcta.

// 🔹 Controlador para obtener la farmacia de turno de hoy
const getFarmaciaTurno = async (req, res) => {
  try {
    const events = await getEvents();
    if (events.length === 0) {
      return res.status(404).json({ message: 'No se encontró farmacia de turno en el calendario' });
    }

    const farmaciaTurno = events[0].summary;
    console.log('Nombre de farmacia del calendario:', farmaciaTurno);

    const [result] = await pool.query('SELECT * FROM farmacias WHERE nombre = ?', [farmaciaTurno]);
    console.log('Resultado de la consulta:', result);

    if (result.length > 0) {
      const farmacia = result[0];
      res.json({
        turno: farmacia.nombre,
        ubicacion: farmacia.direccion,
        telefono: farmacia.telefono,
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

// 🔹 Controlador para obtener todas las farmacias desde el calendario
const getFarmacias = async (req, res) => {
  try {
    const events = await getEvents();
    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No se encontraron eventos en el calendario' });
    }

    const farmacias = events.map(event => ({
      nombre: event.summary || 'Sin nombre',
      ubicacion: event.location || 'Sin ubicación',
      descripcion: event.description || 'Sin descripción',
      inicio: event.start?.date || 'Sin fecha de inicio',
      fin: event.end?.date || 'Sin fecha de fin',
    }));

    res.json(farmacias);
  } catch (error) {
    console.error('Error al obtener farmacias:', error.message);
    res.status(500).json({ message: 'Error al obtener farmacias del calendario', error: error.message });
  }
};

// 🔹 Función utilitaria: farmacia por fecha
const getFarmaciaTurnoPorFecha = async (fecha) => {
  try {
    const events = await getEvents();
    if (events.length === 0) {
      return null;
    }

    const eventoDelDia = events.find(event => {
      const eventDate = event.start?.date || event.start?.dateTime;
      if (!eventDate) return false;

      const eventDateObj = new Date(eventDate);
      const formattedEventDate = eventDateObj.toISOString().split('T')[0];

      return formattedEventDate === fecha || eventDate === fecha;
    });

    if (!eventoDelDia) {
      return null;
    }

    const farmaciaTurno = eventoDelDia.summary;
    const [result] = await pool.query('SELECT * FROM farmacias WHERE nombre = ?', [farmaciaTurno]);

    if (result.length > 0) {
      const farmacia = result[0];
      return {
        turno: farmacia.nombre,
        ubicacion: farmacia.direccion,
        telefono: farmacia.telefono,
        google_maps_url: farmacia.google_maps_url,
        imagen_url: farmacia.imagen_url
      };
    } else {
      return {
        turno: farmaciaTurno,
        ubicacion: 'No se encontraron detalles adicionales',
        telefono: '',
        google_maps_url: '',
        imagen_url: ''
      };
    }
  } catch (error) {
    console.error('Error en getFarmaciaTurnoPorFecha:', error.message);
    throw error;
  }
};


// 🔹 Controlador para devolver ayer, hoy y mañana
const getFarmaciasAyerHoyManiana = async (req, res) => {
  try {
    const hoy = new Date();
    const ayer = new Date(hoy);
    const manana = new Date(hoy);

    ayer.setDate(hoy.getDate() - 1);
    manana.setDate(hoy.getDate() + 1);

    const formatFecha = (fecha) => fecha.toISOString().split('T')[0];

    const farmaciaAyer = await getFarmaciaTurnoPorFecha(formatFecha(ayer));
    const farmaciaHoy = await getFarmaciaTurnoPorFecha(formatFecha(hoy));
    const farmaciaManiana = await getFarmaciaTurnoPorFecha(formatFecha(manana));

    res.json({
      ayer: farmaciaAyer,
      hoy: farmaciaHoy,
      manana: farmaciaManiana
    });
  } catch (error) {
    console.error('Error en getFarmaciasAyerHoyManiana:', error.message);
    res.status(500).json({ message: 'Error al obtener farmacias de turno', error: error.message });
  }
};

// 🔹 Exportar todas las funciones
module.exports = {
  getFarmaciaTurno,
  getFarmacias,
  getFarmaciaTurnoPorFecha,
  getFarmaciasAyerHoyManiana
}; 