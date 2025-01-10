const { google } = require('googleapis');

// Configuración para Google Calendar
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Ruta al archivo JSON
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'], // Solo lectura
});

const calendar = google.calendar({ version: 'v3', auth });

const getEvents = async () => {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID, // ID del calendario
      timeMin: new Date().toISOString(), // Desde ahora
      maxResults: 10, // Máximo de eventos
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error al obtener eventos:', error.message);
    throw error;
  }
};

module.exports = { getEvents };
