document.addEventListener('DOMContentLoaded', async () => {
    const nombreElem = document.getElementById('farmacia-nombre');
    const direccionElem = document.getElementById('farmacia-direccion');
    const mapsElem = document.getElementById('farmacia-maps');
    const imagenElem = document.getElementById('farmacia-imagen');

    try {
        const response = await fetch('https://farmacia-turnos.vercel.app/api/farmacia/turno');
        const data = await response.json();

        if (response.ok) {
            nombreElem.textContent = `Nombre: ${data.turno}`;
            direccionElem.textContent = `Dirección: ${data.ubicacion}`;
            mapsElem.href = data.google_maps_url;

            // Verificar si imagen_url está presente
            if (data.imagen_url) {
                imagenElem.src = data.imagen_url;
                imagenElem.alt = `Imagen de ${data.turno}`;
            } else {
                imagenElem.style.display = 'none'; // Ocultar la imagen si no hay URL
            }
        } else {
            throw new Error(data.message || 'Error desconocido al cargar los datos');
        }
    } catch (error) {
        console.error(error);
        nombreElem.textContent = 'Error al cargar datos';
        direccionElem.textContent = error.message;
        mapsElem.style.display = 'none'; // Ocultar el enlace de Google Maps si hay un error
        if (imagenElem) imagenElem.style.display = 'none'; // Ocultar la imagen si hay un error
    }
});
