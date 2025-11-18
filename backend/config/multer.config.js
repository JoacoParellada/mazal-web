import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpeta de uploads si no existe
const uploadsDir = path.join(__dirname, "../uploads/propiedades");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar storage de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no válido. Solo se permiten: JPG, PNG, GIF, WEBP"
      ),
      false
    );
  }
};

// Configurar multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
  },
  fileFilter: fileFilter,
});

// Función para eliminar archivo del sistema
export const deleteFile = (filename) => {
  try {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    return false;
  }
};

// Función para eliminar múltiples archivos
export const deleteMultipleFiles = (filenames) => {
  const results = filenames.map((filename) => deleteFile(filename));
  return results;
};

export default upload;
