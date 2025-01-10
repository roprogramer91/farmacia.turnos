const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Inicializar app de Express
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/farmacia', require('./routes/farmacia.routes'));

// Inicializar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
