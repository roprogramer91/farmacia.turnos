const app = require('./app'); 
const PORT = process.env.PORT || 3000;


console.log('Iniciando servidor en producción...');


app.listen (PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});