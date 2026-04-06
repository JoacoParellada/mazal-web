const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log para desarrollo
  // Después (temporal para debuggear)
  console.error("ERROR:", err.name, err.message, err.stack);

  // Error de Mongoose - ID mal formateado
  if (err.name === "CastError") {
    const message = "Recurso no encontrado";
    error = { statusCode: 404, message };
  }

  // Error de Mongoose - Duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `El ${field} ya existe`;
    error = { statusCode: 400, message };
  }

  // Error de Mongoose - Validación
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { statusCode: 400, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Error del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
