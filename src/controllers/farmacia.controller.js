const pool = require('../../config/database');

const getFarmaciaTurno = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT nombre, direccion, imagen_url FROM farmacias WHERE turno = 1'); // O ajusta el filtro
        if (result.length > 0) {
            const farmacia = result[0];
            res.json({
                turno: farmacia.nombre,
                ubicacion: farmacia.direccion,
                imagen_url: farmacia.imagen_url,
                google_maps_url: `https://www.google.com/maps?q=${encodeURIComponent(farmacia.direccion)}`
            });
        } else {
            res.status(404).json({ message: 'No se encontró farmacia de turno' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener farmacia de turno', error: error.message });
    }
};

module.exports = { getFarmaciaTurno };
