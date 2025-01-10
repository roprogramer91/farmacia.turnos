const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS), // Leer credenciales de la variable de entorno
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'], // Solo lectura
});

const calendar = google.calendar({ version: 'v3', auth });

const getEvents = async () => {
  try {
    console.log("Solicitando eventos al calendario...");
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID, // ID del calendario
      timeMin: new Date().toISOString(), // Desde ahora
      maxResults: 10, // Máximo de eventos
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log("Respuesta de la API:", response.data.items);
    return response.data.items || [];
  } catch (error) {
    console.error('Error al solicitar eventos:', error.message);
    throw error;
  }
};

module.exports = { getEvents };


module.exports = { getEvents };
