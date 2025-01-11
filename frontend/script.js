document.addEventListener('DOMContentLoaded', async () => {
    const nombreElem = document.getElementById('farmacia-nombre');
    const direccionElem = document.getElementById('farmacia-direccion');
    const mapsElem = document.getElementById('farmacia-maps');
    const imagenElem = document.getElementById('farmacia-imagen');

    try {
        const response = await fetch('https://farmacia-turnos.vercel.app/api/farmacia/turno');
        const data = await response.json();

        if (response.ok) {
            // Asignar datos al DOM
            nombreElem.textContent = `${data.turno}`;
            direccionElem.textContent = `Dirección: ${data.ubicacion}`;
            mapsElem.href = data.google_maps_url;

            // Mostrar el botón si hay una URL válida
            if (data.google_maps_url) {
                mapsElem.style.display = 'block'; // Asegurarte de que sea visible
            } else {
                mapsElem.style.display = 'none'; // Ocultar si no hay enlace
            }

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

        // Mostrar error en el DOM
        nombreElem.textContent = 'Error al cargar datos';
        direccionElem.textContent = error.message;

        // Ocultar elementos en caso de error
        mapsElem.style.display = 'none';
        if (imagenElem) imagenElem.style.display = 'none';
    }
});
