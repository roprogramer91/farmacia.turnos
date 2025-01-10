const cloudinary = require('../../config/cloudinary');
const fs = require('fs');

const uploadImage = async (req, res) => {
  try {
    // Asegúrate de que la imagen se sube correctamente desde el cliente
    const filePath = req.file.path; // Ruta del archivo subido temporalmente
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'farmacias', // Carpeta donde se guardará en Cloudinary
    });

    // Elimina el archivo temporal
    fs.unlinkSync(filePath);

    res.json({
      message: 'Imagen subida con éxito',
      url: result.secure_url, // URL pública de la imagen
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir la imagen', error: error.message });
  }
};

module.exports = { uploadImage };
