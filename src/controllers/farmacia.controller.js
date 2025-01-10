const pool = require('../../config/database');

const getFarmaciaTurno = async (req, res) => {
    try {
        // Obtener la farmacia de turno desde la base de datos
        const [rows] = await pool.query(
            'SELECT nombre, direccion, google_maps_url FROM farmacias WHERE id = 1' // ID de la farmacia de turno
        );

        if (rows.length > 0) {
            const farmacia = rows[0];
            res.json({
                turno: farmacia.nombre,
                ubicacion: farmacia.direccion,
                google_maps_url: farmacia.google_maps_url,
            });
        } else {
            res.status(404).json({ message: 'No hay farmacia de turno configurada' });
        }
    } catch (error) {
        console.error('Error al obtener farmacia de turno:', error.message);
        res.status(500).json({ message: 'Error al obtener farmacia de turno' });
    }
};

module.exports = { getFarmaciaTurno };
