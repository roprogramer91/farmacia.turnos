const { getEvents } = require('../utils/googleCalendar');
const pool = require('../../config/database');

// 🔹 Controlador para obtener la farmacia de turno de hoy
const getFarmaciaTurno = async (req, res) => {
  try {
    const hoy = new Date();
    const formatFecha = hoy.toISOString().split('T')[0];
    const farmaciaHoy = await getFarmaciaTurnoPorFecha(formatFecha);

    if (!farmaciaHoy) {
      return res.status(404).json({ message: 'No se encontró farmacia de turno para hoy' });
    }

    res.json(farmaciaHoy);
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

const getFarmaciaTurnoPorFecha = async (fecha) => {
  try {
    const events = await getEvents();
    if (events.length === 0) {
      return null;
    }

    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActual = ahora.getMinutes();

    let fechaBusqueda = new Date(`${fecha}T08:30:00`);

    // Si la hora actual es antes de las 8:30 AM, retrocedemos un día para usar el turno anterior
    if (horaActual < 8 || (horaActual === 8 && minutosActual < 30)) {
      fechaBusqueda.setDate(fechaBusqueda.getDate() - 1);
    }

    const eventoDelDia = events.find(event => {
      const startDate = new Date(`${event.start.date}T08:30:00`);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      endDate.setHours(8, 30, 0, 0);

      console.log(`➡️ Verificando turno: ${event.summary} | Inicio: ${startDate} | Fin: ${endDate}`);

      return fechaBusqueda >= startDate && fechaBusqueda < endDate;
    });

    console.log('📝 Evento encontrado:', eventoDelDia);

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


// 🔹 Controlador para devolver farmacias de ayer, hoy y mañana
const getFarmaciasAyerHoyManiana = async (req, res) => {
  try {
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    const manana = new Date(hoy);
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
