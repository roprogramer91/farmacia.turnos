document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://farmacia-turnos.vercel.app/api/farmacia/turno');
        const data = await response.json();

        if (response.ok) {
            document.getElementById('farmacia-nombre').innerText = `Nombre: ${data.turno}`;
            document.getElementById('farmacia-direccion').innerText = `Dirección: ${data.ubicacion}`;

            const mapsLink = document.getElementById('farmacia-maps');
            mapsLink.href = data.google_maps_url;
            mapsLink.style.display = 'inline-block'; // Muestra el botón si hay un enlace

            const imgElement = document.getElementById('farmacia-imagen');
            if (data.imagen_url) {
                imgElement.src = data.imagen_url;
                imgElement.style.display = 'block'; // Muestra la imagen si existe
            }
        } else {
            document.getElementById('farmacia-nombre').innerText = 'Error al cargar datos';
            document.getElementById('farmacia-direccion').innerText = data.message || 'No se pudo obtener la información.';
        }
    } catch (error) {
        document.getElementById('farmacia-nombre').innerText = 'Error al cargar datos';
        document.getElementById('farmacia-direccion').innerText = error.message;
    }
});
