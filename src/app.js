const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/farmacia', require('./routes/farmacia.routes'));




module.exports = app; // Exportar la app para que server.js la use
