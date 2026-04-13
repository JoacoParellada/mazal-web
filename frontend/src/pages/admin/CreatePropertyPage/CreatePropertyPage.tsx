import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { AdminLayout } from "@components/layout/AdminLayout/AdminLayout";
import { Button } from "@components/common/Button/Button";
import { Input } from "@components/common/Input/Input";
import { Card, CardBody, CardHeader } from "@components/common/Card/Card";
import { Loader } from "@components/common/Loader/Loader";
import { usePropertiesStore } from "@store/propertiesStore";
import {
  PROPERTY_TYPES,
  OPERATION_TYPES,
  CURRENCIES,
  PROVINCES,
  getLocalidades,
} from "@utils/constants";
import { toast } from "react-toastify";
import styles from "./CreatePropertyPage.module.css";
import { getFieldsConfig } from "@utils/propertyFieldsConfig";

const propertySchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  descripcion: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres"),
  tipo: z.string().min(1, "Selecciona un tipo"),
  operacion: z.string().min(1, "Selecciona una operación"),
  precio: z.number().min(1, "El precio debe ser mayor a 0"),
  moneda: z.string(),
  direccion: z.object({
    calle: z.string().optional(),
    numero: z.string().optional(),
    piso: z.string().optional(),
    departamento: z.string().optional(),
    barrio: z.string().optional(),
    ciudad: z.string().min(1, "La ciudad es obligatoria"),
    provincia: z.string().min(1, "La provincia es obligatoria"),
    codigoPostal: z.string().optional(),
  }),
  superficie: z
    .object({
      total: z.number().optional(),
      cubierta: z.number().optional(),
    })
    .optional(),
  ambientes: z.number().optional(),
  dormitorios: z.number().optional(),
  banos: z.number().optional(),
  cocheras: z.number().optional(),
  expensas: z.number().optional(),
  destacada: z.boolean().optional(),
  visible: z.boolean().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface ImagePreview {
  file?: File;
  url: string;
  filename?: string;
  esPrincipal: boolean;
  orden: number;
  _id?: string; // Para imágenes existentes
}

const CreatePropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentProperty,
    isLoading,
    fetchPropertyById,
    createProperty,
    updateProperty,
  } = usePropertiesStore();

  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      moneda: "ARS",
      destacada: false,
      visible: true,
    },
  });

  const provinciaSeleccionada = watch("direccion.provincia");

  const localidades = getLocalidades(provinciaSeleccionada || "");

  const tipoSeleccionado = watch("tipo") || "";
  const fieldsConfig = getFieldsConfig(tipoSeleccionado);

  useEffect(() => {
    if (isEditMode && id) {
      fetchPropertyById(id);
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentProperty) {
      // Llenar el formulario con los datos existentes
      setValue("titulo", currentProperty.titulo);
      setValue("descripcion", currentProperty.descripcion);
      setValue("tipo", currentProperty.tipo);
      setValue("operacion", currentProperty.operacion);
      setValue("precio", currentProperty.precio);
      setValue("moneda", currentProperty.moneda);
      setValue("direccion.calle", currentProperty.direccion.calle);
      setValue("direccion.numero", currentProperty.direccion.numero);
      setValue("direccion.piso", currentProperty.direccion.piso);
      setValue(
        "direccion.departamento",
        currentProperty.direccion.departamento,
      );
      setValue("direccion.barrio", currentProperty.direccion.barrio);
      setValue("direccion.ciudad", currentProperty.direccion.ciudad);
      setValue("direccion.provincia", currentProperty.direccion.provincia);
      setValue(
        "direccion.codigoPostal",
        currentProperty.direccion.codigoPostal,
      );
      setValue("superficie.total", currentProperty.superficie?.total);
      setValue("superficie.cubierta", currentProperty.superficie?.cubierta);
      setValue("ambientes", currentProperty.ambientes);
      setValue("dormitorios", currentProperty.dormitorios);
      setValue("banos", currentProperty.banos);
      setValue("cocheras", currentProperty.cocheras);
      setValue("expensas", currentProperty.expensas);
      setValue("destacada", currentProperty.destacada);
      setValue("visible", currentProperty.visible);

      if (currentProperty.amenities) {
        setAmenities(currentProperty.amenities);
      }
      if (currentProperty.imagenes) {
        setImages(
          currentProperty.imagenes.map((img) => ({
            url: img.url,
            filename: img.filename,
            esPrincipal: img.esPrincipal,
            orden: img.orden,
            _id: img._id,
          })),
        );
      }
    }
  }, [currentProperty, isEditMode]);

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (images.length === 0) {
        toast.error("Debes agregar al menos una imagen");
        return;
      }

      const formattedData = {
        ...data,
        amenities,
        // ✅ Imágenes existentes (las que ya estaban guardadas)
        imagenesExistentes: images
          .filter((img) => !img.file)
          .map((img, index) => ({
            _id: img._id,
            url: img.url,
            filename: img.filename, // necesitás agregar filename al tipo ImagePreview
            esPrincipal: img.esPrincipal,
            orden: index + 1,
          })),
        // Solo archivos nuevos
        imagenes: images
          .filter((img) => img.file)
          .map((img) => img.file as File),
      };

      console.log(
        "formattedData:",
        JSON.stringify({
          ...formattedData,
          imagenes: formattedData.imagenes?.length + " archivos",
          imagenesExistentes: formattedData.imagenesExistentes,
        }),
      );

      if (isEditMode && id) {
        await updateProperty(id, formattedData);
        toast.success("Propiedad actualizada exitosamente");
      } else {
        await createProperty(formattedData);
        toast.success("Propiedad creada exitosamente");
      }
      navigate("/admin/propiedades");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al guardar la propiedad",
      );
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validar que no excedan 10 imágenes en total
    if (images.length + files.length > 35) {
      toast.error("Máximo 35 imágenes permitidas");
      return;
    }

    const newImages: ImagePreview[] = [];

    Array.from(files).forEach((file, index) => {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} no es una imagen válida`);
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} excede el tamaño máximo de 5MB`);
        return;
      }

      // Crear URL temporal para preview
      const url = URL.createObjectURL(file);

      newImages.push({
        file,
        url,
        esPrincipal: images.length === 0 && index === 0,
        orden: images.length + index + 1,
      });
    });

    setImages([...images, ...newImages]);

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];

    // Liberar memoria de URLs temporales
    if (imageToRemove.file) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    const newImages = images.filter((_, i) => i !== index);

    // Reordenar
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      orden: i + 1,
      esPrincipal: i === 0 ? true : img.esPrincipal,
    }));

    setImages(reorderedImages);
  };

  const setPrincipalImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      esPrincipal: i === index,
    }));

    const principal = newImages[index];
    const resto = newImages.filter((_, i) => i !== index);
    const reordenadas = [principal, ...resto].map((img, i) => ({
      ...img,
      orden: i + 1,
    }));

    setImages(reordenadas);
  };

  // Limpiar URLs temporales al desmontar
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  if (isLoading && isEditMode) {
    return (
      <AdminLayout>
        <Loader fullScreen />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <Button
          variant="ghost"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate("/admin/propiedades")}
          className={styles.backButton}
        >
          Volver a propiedades
        </Button>

        <h1 className={styles.title}>
          {isEditMode ? "Editar Propiedad" : "Nueva Propiedad"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Información básica */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>Información Básica</h2>
            </CardHeader>
            <CardBody>
              <div className={styles.formGrid}>
                <div className={styles.fullWidth}>
                  <Input
                    label="Título"
                    {...register("titulo")}
                    error={errors.titulo?.message}
                    required
                  />
                </div>

                <div className={styles.fullWidth}>
                  <label className={styles.label}>
                    Descripción <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={styles.textarea}
                    rows={5}
                    {...register("descripcion")}
                  />
                  {errors.descripcion && (
                    <span className={styles.error}>
                      {errors.descripcion.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className={styles.label}>
                    Tipo <span className={styles.required}>*</span>
                  </label>
                  <select className={styles.select} {...register("tipo")}>
                    <option value="">Seleccionar</option>
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.tipo && (
                    <span className={styles.error}>{errors.tipo.message}</span>
                  )}
                </div>

                <div>
                  <label className={styles.label}>
                    Operación <span className={styles.required}>*</span>
                  </label>
                  <select className={styles.select} {...register("operacion")}>
                    <option value="">Seleccionar</option>
                    {OPERATION_TYPES.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  {errors.operacion && (
                    <span className={styles.error}>
                      {errors.operacion.message}
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    label="Precio"
                    {...register("precio", { valueAsNumber: true })}
                    error={errors.precio?.message}
                    required
                  />
                </div>

                <div>
                  <label className={styles.label}>Moneda</label>
                  <select className={styles.select} {...register("moneda")}>
                    {CURRENCIES.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Input
                    type="number"
                    label="Expensas"
                    {...register("expensas", { valueAsNumber: true })}
                    error={errors.expensas?.message}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Ubicación */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>Ubicación</h2>
            </CardHeader>
            <CardBody>
              <div className={styles.formGrid}>
                <div>
                  <Input label="Calle" {...register("direccion.calle")} />
                </div>
                <div>
                  <Input label="Número" {...register("direccion.numero")} />
                </div>
                <div>
                  <Input label="Piso" {...register("direccion.piso")} />
                </div>
                <div>
                  <Input
                    label="Departamento"
                    {...register("direccion.departamento")}
                  />
                </div>
                <div>
                  <Input label="Barrio" {...register("direccion.barrio")} />
                </div>
                <div>
                  <div>
                    <label className={styles.label}>
                      Localidad / Departamento{" "}
                      <span className={styles.required}>*</span>
                    </label>
                    {localidades.length > 0 ? (
                      <select
                        className={styles.select}
                        {...register("direccion.ciudad")}
                      >
                        <option value="">Seleccionar localidad</option>
                        {localidades.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        label=""
                        placeholder={
                          provinciaSeleccionada
                            ? "Ingresá la localidad"
                            : "Primero seleccioná una provincia"
                        }
                        {...register("direccion.ciudad")}
                        error={errors.direccion?.ciudad?.message}
                        disabled={!provinciaSeleccionada}
                      />
                    )}
                    {errors.direccion?.ciudad && (
                      <span className={styles.error}>
                        {errors.direccion.ciudad.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className={styles.label}>
                    Provincia <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={styles.select}
                    {...register("direccion.provincia")}
                  >
                    <option value="">Seleccionar</option>
                    {PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {errors.direccion?.provincia && (
                    <span className={styles.error}>
                      {errors.direccion.provincia.message}
                    </span>
                  )}
                </div>
                <div>
                  <Input
                    label="Código Postal"
                    {...register("direccion.codigoPostal")}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Características — se muestran según el tipo */}
          {tipoSeleccionado && (
            <Card>
              <CardHeader>
                <h2 className={styles.cardTitle}>Características</h2>
                <p className={styles.cardSubtitle}>
                  Campos disponibles para{" "}
                  <strong>
                    {
                      PROPERTY_TYPES.find((t) => t.value === tipoSeleccionado)
                        ?.label
                    }
                  </strong>
                </p>
              </CardHeader>
              <CardBody>
                <div className={styles.formGrid}>
                  {fieldsConfig.superficieTotal.show && (
                    <div>
                      <Input
                        type="number"
                        label={fieldsConfig.superficieTotal.label}
                        {...register("superficie.total", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  )}
                  {fieldsConfig.superficieCubierta.show && (
                    <div>
                      <Input
                        type="number"
                        label={fieldsConfig.superficieCubierta.label}
                        {...register("superficie.cubierta", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  )}
                  {fieldsConfig.ambientes.show && (
                    <div>
                      <Input
                        type="number"
                        label={fieldsConfig.ambientes.label}
                        {...register("ambientes", { valueAsNumber: true })}
                      />
                    </div>
                  )}
                  {fieldsConfig.dormitorios.show && (
                    <div>
                      <Input
                        type="number"
                        label={fieldsConfig.dormitorios.label}
                        {...register("dormitorios", { valueAsNumber: true })}
                      />
                    </div>
                  )}
                  {fieldsConfig.banos.show && (
                    <div>
                      <Input
                        type="number"
                        label={fieldsConfig.banos.label}
                        {...register("banos", { valueAsNumber: true })}
                      />
                    </div>
                  )}
                  {fieldsConfig.cocheras.show && (
                    <div>
                      <Input
                        type="number"
                        label={fieldsConfig.cocheras.label}
                        {...register("cocheras", { valueAsNumber: true })}
                      />
                    </div>
                  )}
                </div>

                {/* Mensaje cuando no hay tipo seleccionado */}
                {!tipoSeleccionado && (
                  <p className={styles.hint}>
                    Seleccioná un tipo de propiedad para ver los campos
                    disponibles.
                  </p>
                )}
              </CardBody>
            </Card>
          )}

          {/* Amenities — solo si el tipo lo permite */}
          {tipoSeleccionado && fieldsConfig.amenities.show && (
            <Card>
              <CardHeader>
                <h2 className={styles.cardTitle}>
                  {fieldsConfig.amenities.label}
                </h2>
              </CardHeader>
              <CardBody>
                <div className={styles.amenitiesSection}>
                  <div className={styles.amenityInput}>
                    <Input
                      type="text"
                      placeholder="Ej: Piscina, Gimnasio, Parrilla..."
                      value={amenityInput}
                      onChange={(e) => setAmenityInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAmenity();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      icon={<Plus size={20} />}
                      onClick={addAmenity}
                    >
                      Agregar
                    </Button>
                  </div>
                  {amenities.length > 0 && (
                    <div className={styles.amenitiesList}>
                      {amenities.map((amenity, index) => (
                        <div key={index} className={styles.amenityTag}>
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className={styles.removeButton}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Mensaje cuando no hay tipo seleccionado */}
          {!tipoSeleccionado && (
            <Card>
              <CardBody>
                <div className={styles.emptyImages} style={{ padding: "2rem" }}>
                  <p
                    style={{ margin: 0, color: "var(--color-text-secondary)" }}
                  >
                    👆 Seleccioná primero el <strong>tipo de propiedad</strong>{" "}
                    para ver las características disponibles.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Imágenes */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>
                Imágenes <span className={styles.required}>*</span>
              </h2>
              <p className={styles.cardSubtitle}>
                Máximo 35 imágenes. Tamaño máximo: 5MB por imagen. Formatos:
                JPG, PNG, GIF, WEBP
              </p>
            </CardHeader>
            <CardBody>
              <div className={styles.imagesSection}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />

                <Button
                  type="button"
                  variant="outline"
                  icon={<Upload size={20} />}
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.uploadButton}
                  disabled={images.length >= 35}
                >
                  {images.length === 0
                    ? "Seleccionar imágenes"
                    : `Agregar más imágenes (${images.length}/35)`}
                </Button>

                {images.length === 0 && (
                  <div className={styles.emptyImages}>
                    <ImageIcon size={48} />
                    <p>No hay imágenes seleccionadas</p>
                    <p className={styles.hint}>
                      Haz clic en "Seleccionar imágenes" para agregar fotos
                      desde tu computadora
                    </p>
                  </div>
                )}

                {images.length > 0 && (
                  <div className={styles.imagesList}>
                    {images.map((image, index) => (
                      <div key={index} className={styles.imageItem}>
                        <img
                          src={image.url}
                          alt={`Imagen ${index + 1}`}
                          className={styles.imagePreview}
                        />
                        {image.esPrincipal && (
                          <span className={styles.principalBadge}>
                            Principal
                          </span>
                        )}
                        {image.file && (
                          <span className={styles.newBadge}>Nueva</span>
                        )}
                        <div className={styles.imageActions}>
                          {!image.esPrincipal && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPrincipalImage(index)}
                            >
                              Marcar como principal
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            icon={<X size={16} />}
                            onClick={() => removeImage(index)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>Configuración</h2>
            </CardHeader>
            <CardBody>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input type="checkbox" {...register("destacada")} />
                  <span>Marcar como destacada</span>
                </label>
                <label className={styles.checkbox}>
                  <input type="checkbox" {...register("visible")} />
                  <span>Visible en el sitio público</span>
                </label>
              </div>
            </CardBody>
          </Card>

          {/* Botones de acción */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/propiedades")}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isEditMode ? "Actualizar Propiedad" : "Crear Propiedad"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreatePropertyPage;
