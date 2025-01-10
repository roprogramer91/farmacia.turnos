const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/upload.controller');
const router = express.Router();

// Configuración de multer para manejar la subida de archivos
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
