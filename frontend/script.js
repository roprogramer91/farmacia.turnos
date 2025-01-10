document.addEventListener("DOMContentLoaded", async () => {
    const nombreFarmacia = document.getElementById("nombre-farmacia");
    const direccionFarmacia = document.getElementById("direccion-farmacia");

    try {
        const response = await fetch("https://farmacia-turnos.vercel.app/api/farmacia/turno");
        if (!response.ok) throw new Error("Error al obtener la farmacia de turno");

        const data = await response.json();
        nombreFarmacia.textContent = `Nombre: ${data.turno}`;
        direccionFarmacia.textContent = `Dirección: ${data.ubicacion}`;
    } catch (error) {
        nombreFarmacia.textContent = "Error al cargar los datos";
        direccionFarmacia.textContent = "";
        console.error(error);
    }
});
