import Property from "../models/Property.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Obtener todas las propiedades (públicas)
// @route   GET /api/propiedades
// @access  Public
export const obtenerPropiedades = asyncHandler(async (req, res) => {
  // Filtros
  let query = { visible: true };

  // Filtrar por tipo
  if (req.query.tipo) {
    query.tipo = req.query.tipo;
  }

  // Filtrar por operación
  if (req.query.operacion) {
    query.operacion = req.query.operacion;
  }

  // Filtrar por estado
  if (req.query.estado) {
    query.estado = req.query.estado;
  } else {
    query.estado = "disponible"; // Por defecto solo disponibles
  }

  // Filtrar por ciudad
  if (req.query.ciudad) {
    query["direccion.ciudad"] = new RegExp(req.query.ciudad, "i");
  }

  // Filtrar por provincia
  if (req.query.provincia) {
    query["direccion.provincia"] = new RegExp(req.query.provincia, "i");
  }

  // Filtrar por rango de precio
  if (req.query.precioMin || req.query.precioMax) {
    query.precio = {};
    if (req.query.precioMin) query.precio.$gte = Number(req.query.precioMin);
    if (req.query.precioMax) query.precio.$lte = Number(req.query.precioMax);
  }

  // Filtrar por dormitorios
  if (req.query.dormitorios) {
    query.dormitorios = { $gte: Number(req.query.dormitorios) };
  }

  // Paginación
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Property.countDocuments(query);

  // Ordenamiento
  let sort = {};
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    sort = sortBy;
  } else {
    sort = "-createdAt"; // Por defecto más recientes primero
  }

  const propiedades = await Property.find(query)
    .sort(sort)
    .limit(limit)
    .skip(startIndex);

  // Paginación info
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

  // Si no es visible y no es un usuario autenticado, no mostrarla
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
  // Agregar usuario al body
  req.body.creadoPor = req.user.id;

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

  // Verificar que el usuario sea el creador o admin
  if (req.user.rol !== "admin" && req.user.rol !== "supervisor") {
    return res.status(403).json({
      success: false,
      message: "No autorizado para actualizar propiedades",
    });
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
