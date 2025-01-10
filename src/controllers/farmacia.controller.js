const pool = require('../../config/database');
const { getEvents } = require('../utils/googleCalendar');

const getFarmaciaTurno = async (req, res) => {
    try {
        // Obtener el evento actual del calendario
        const eventos = await getEvents();
        if (eventos.length === 0) {
            return res.status(404).json({ message: 'No hay farmacias de turno disponibles' });
        }

        // Suponiendo que el primer evento es el de turno actual
        const eventoActual = eventos[0];
        const nombreFarmacia = eventoActual.summary;

        // Buscar detalles adicionales de la farmacia en la base de datos
        const [result] = await pool.query(
            'SELECT nombre, direccion, imagen_url FROM farmacias WHERE nombre = ?',
            [nombreFarmacia]
        );

        if (result.length > 0) {
            const farmacia = result[0];
            res.json({
                turno: farmacia.nombre,
                ubicacion: farmacia.direccion,
                imagen_url: farmacia.imagen_url,
                google_maps_url: `https://www.google.com/maps?q=${encodeURIComponent(farmacia.direccion)}`
            });
        } else {
            res.status(404).json({
                message: `No se encontraron detalles adicionales para la farmacia ${nombreFarmacia}`,
                turno: nombreFarmacia // Mostramos al menos el nombre del turno desde Google Calendar
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener farmacia de turno', error: error.message });
    }
};

module.exports = { getFarmaciaTurno };
