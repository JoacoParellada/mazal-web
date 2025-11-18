import Property from "../models/Property.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFile, deleteMultipleFiles } from "../config/multer.config.js";

// @desc    Obtener todas las propiedades (públicas)
// @route   GET /api/propiedades
// @access  Public
export const obtenerPropiedades = asyncHandler(async (req, res) => {
  let query = { visible: true };

  if (req.query.tipo) {
    query.tipo = req.query.tipo;
  }

  if (req.query.operacion) {
    query.operacion = req.query.operacion;
  }

  if (req.query.estado) {
    query.estado = req.query.estado;
  } else {
    query.estado = "disponible";
  }

  if (req.query.ciudad) {
    query["direccion.ciudad"] = new RegExp(req.query.ciudad, "i");
  }

  if (req.query.provincia) {
    query["direccion.provincia"] = new RegExp(req.query.provincia, "i");
  }

  if (req.query.precioMin || req.query.precioMax) {
    query.precio = {};
    if (req.query.precioMin) query.precio.$gte = Number(req.query.precioMin);
    if (req.query.precioMax) query.precio.$lte = Number(req.query.precioMax);
  }

  if (req.query.dormitorios) {
    query.dormitorios = { $gte: Number(req.query.dormitorios) };
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Property.countDocuments(query);

  let sort = {};
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    sort = sortBy;
  } else {
    sort = "-createdAt";
  }

  const propiedades = await Property.find(query)
    .sort(sort)
    .limit(limit)
    .skip(startIndex);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.json({
    success: true,
    count: propiedades.length,
    total,
    pagination,
    data: propiedades,
  });
});

// @desc    Obtener propiedad por ID
// @route   GET /api/propiedades/:id
// @access  Public
export const obtenerPropiedad = asyncHandler(async (req, res) => {
  const propiedad = await Property.findById(req.params.id);

  if (!propiedad) {
    return res.status(404).json({
      success: false,
      message: "Propiedad no encontrada",
    });
  }

  if (!propiedad.visible && !req.user) {
    return res.status(404).json({
      success: false,
      message: "Propiedad no encontrada",
    });
  }

  res.status(200).json({
    success: true,
    data: propiedad,
  });
});

// @desc    Crear nueva propiedad
// @route   POST /api/propiedades
// @access  Private (agente, supervisor, admin)
export const crearPropiedad = asyncHandler(async (req, res) => {
  req.body.creadoPor = req.user.id;

  // Procesar las imágenes subidas
  if (req.files && req.files.length > 0) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imagenes = req.files.map((file, index) => ({
      url: `${baseUrl}/uploads/propiedades/${file.filename}`,
      filename: file.filename, // Guardar nombre del archivo para eliminarlo después
      esPrincipal: index === 0, // La primera es principal
      orden: index + 1,
    }));
    req.body.imagenes = imagenes;
  }

  const propiedad = await Property.create(req.body);

  res.status(201).json({
    success: true,
    message: "Propiedad creada exitosamente",
    data: propiedad,
  });
});

// @desc    Actualizar propiedad
// @route   PUT /api/propiedades/:id
// @access  Private
export const actualizarPropiedad = asyncHandler(async (req, res) => {
  let propiedad = await Property.findById(req.params.id);

  if (!propiedad) {
    return res.status(404).json({
      success: false,
      message: "Propiedad no encontrada",
    });
  }

  if (req.user.rol !== "admin" && req.user.rol !== "supervisor") {
    return res.status(403).json({
      success: false,
      message: "No autorizado para actualizar propiedades",
    });
  }

  // Si se suben nuevas imágenes
  if (req.files && req.files.length > 0) {
    // Eliminar imágenes antiguas del sistema de archivos
    if (propiedad.imagenes && propiedad.imagenes.length > 0) {
      const oldFilenames = propiedad.imagenes
        .map((img) => img.filename)
        .filter(Boolean);
      deleteMultipleFiles(oldFilenames);
    }

    // Agregar nuevas imágenes
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imagenes = req.files.map((file, index) => ({
      url: `${baseUrl}/uploads/propiedades/${file.filename}`,
      filename: file.filename,
      esPrincipal: index === 0,
      orden: index + 1,
    }));
    req.body.imagenes = imagenes;
  }

  propiedad = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Propiedad actualizada exitosamente",
    data: propiedad,
  });
});

// @desc    Eliminar propiedad
// @route   DELETE /api/propiedades/:id
// @access  Private (admin, supervisor)
export const eliminarPropiedad = asyncHandler(async (req, res) => {
  const propiedad = await Property.findById(req.params.id);

  if (!propiedad) {
    return res.status(404).json({
      success: false,
      message: "Propiedad no encontrada",
    });
  }

  // Eliminar imágenes del sistema de archivos
  if (propiedad.imagenes && propiedad.imagenes.length > 0) {
    const filenames = propiedad.imagenes
      .map((img) => img.filename)
      .filter(Boolean);
    deleteMultipleFiles(filenames);
  }

  await propiedad.deleteOne();

  res.json({
    success: true,
    message: "Propiedad eliminada exitosamente",
    data: {},
  });
});

// @desc    Cambiar visibilidad de propiedad
// @route   PUT /api/propiedades/:id/visibilidad
// @access  Private
export const cambiarVisibilidad = asyncHandler(async (req, res) => {
  const propiedad = await Property.findById(req.params.id);

  if (!propiedad) {
    return res.status(404).json({
      success: false,
      message: "Propiedad no encontrada",
    });
  }

  propiedad.visible = !propiedad.visible;
  await propiedad.save();

  res.json({
    success: true,
    message: `Propiedad ${
      propiedad.visible ? "visible" : "oculta"
    } exitosamente`,
    data: propiedad,
  });
});

// @desc    Marcar/desmarcar como destacada
// @route   PUT /api/propiedades/:id/destacar
// @access  Private (admin, supervisor)
export const destacarPropiedad = asyncHandler(async (req, res) => {
  const propiedad = await Property.findById(req.params.id);

  if (!propiedad) {
    return res.status(404).json({
      success: false,
      message: "Propiedad no encontrada",
    });
  }

  propiedad.destacada = !propiedad.destacada;
  await propiedad.save();

  res.json({
    success: true,
    message: `Propiedad ${
      propiedad.destacada ? "destacada" : "no destacada"
    } exitosamente`,
    data: propiedad,
  });
});

// @desc    Obtener propiedades destacadas
// @route   GET /api/propiedades/destacadas
// @access  Public
export const obtenerDestacadas = asyncHandler(async (req, res) => {
  const propiedades = await Property.find({
    visible: true,
    destacada: true,
    estado: "disponible",
  }).sort("-createdAt");

  res.json({
    success: true,
    count: propiedades.length,
    data: propiedades,
  });
});

// @desc    Obtener estadísticas de propiedades
// @route   GET /api/propiedades/stats/resumen
// @access  Private
export const obtenerEstadisticas = asyncHandler(async (req, res) => {
  const stats = await Property.aggregate([
    {
      $group: {
        _id: null,
        totalPropiedades: { $sum: 1 },
        disponibles: {
          $sum: { $cond: [{ $eq: ["$estado", "disponible"] }, 1, 0] },
        },
        vendidas: {
          $sum: { $cond: [{ $eq: ["$estado", "vendida"] }, 1, 0] },
        },
        alquiladas: {
          $sum: { $cond: [{ $eq: ["$estado", "alquilada"] }, 1, 0] },
        },
        precioPromedio: { $avg: "$precio" },
      },
    },
  ]);

  const porTipo = await Property.aggregate([
    {
      $group: {
        _id: "$tipo",
        cantidad: { $sum: 1 },
      },
    },
  ]);

  const porOperacion = await Property.aggregate([
    {
      $group: {
        _id: "$operacion",
        cantidad: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      resumen: stats[0] || {},
      porTipo,
      porOperacion,
    },
  });
});

// @desc    Eliminar una imagen específica
// @route   DELETE /api/propiedades/:id/imagenes/:imageId
// @access  Private
export const eliminarImagen = asyncHandler(async (req, res) => {
  const propiedad = await Property.findById(req.params.id);

  if (!propiedad) {
    return res.status(404).json({
      success: false,
      message: "Propiedad no encontrada",
    });
  }

  const imagen = propiedad.imagenes.id(req.params.imageId);

  if (!imagen) {
    return res.status(404).json({
      success: false,
      message: "Imagen no encontrada",
    });
  }

  // Eliminar del sistema de archivos
  if (imagen.filename) {
    deleteFile(imagen.filename);
  }

  // Eliminar del array
  propiedad.imagenes.pull(req.params.imageId);
  await propiedad.save();

  res.json({
    success: true,
    message: "Imagen eliminada exitosamente",
    data: propiedad,
  });
});
