document.addEventListener('DOMContentLoaded', async () => {
    const nombreElem = document.getElementById('farmacia-nombre');
    const direccionElem = document.getElementById('farmacia-direccion');
    const mapsElem = document.getElementById('farmacia-maps');
    const imagenElem = document.getElementById('farmacia-imagen');
    const telefonoElem = document.getElementById('farmacia-telefono'); // Nuevo elemento

    try {
        const response = await fetch('https://farmacia-turnos.vercel.app/api/farmacia/turno');
        const data = await response.json();

        if (response.ok) {
            // Asignar datos al DOM
            nombreElem.textContent = `${data.turno}`;
            direccionElem.textContent = `Dirección: ${data.ubicacion}`;
            mapsElem.href = data.google_maps_url;

            // Mostrar el botón de Google Maps si hay una URL válida
            if (data.google_maps_url) {
                mapsElem.style.display = 'block'; // Asegúrate de que sea visible
            } else {
                mapsElem.style.display = 'none'; // Ocultar si no hay enlace
            }

            // Mostrar el enlace de teléfono si está disponible
            if (data.telefono) {
                telefonoElem.href = `tel:${data.telefono}`;
                telefonoElem.textContent = `Teléfono: ${data.telefono}`;
                telefonoElem.style.display = 'block'; // Asegúrate de que sea visible
            } else {
                telefonoElem.style.display = 'none'; // Ocultar si no hay teléfono
            }

            // Verificar si imagen_url está presente
            if (data.imagen_url) {
                imagenElem.src = data.imagen_url;
                imagenElem.alt = `Imagen de ${data.turno}`;
                imagenElem.style.display = 'block';
            } else {
                imagenElem.style.display = 'none'; // Ocultar la imagen si no hay URL
            }
        } else {
            throw new Error(data.message || 'Error desconocido al cargar los datos');
        }
    } catch (error) {
        console.error(error);

        // Mostrar error en el DOM
        nombreElem.textContent = 'Error al cargar datos';
        direccionElem.textContent = error.message;

        // Ocultar elementos en caso de error
        mapsElem.style.display = 'none';
        telefonoElem.style.display = 'none';
        if (imagenElem) imagenElem.style.display = 'none';
    }
});
