import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, X } from "lucide-react";
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
} from "@utils/constants";
import { toast } from "react-toastify";
import styles from "./CreatePropertyPage.module.css";

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
  baños: z.number().optional(),
  cocheras: z.number().optional(),
  expensas: z.number().optional(),
  destacada: z.boolean().optional(),
  visible: z.boolean().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const CreatePropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const {
    currentProperty,
    isLoading,
    fetchPropertyById,
    createProperty,
    updateProperty,
  } = usePropertiesStore();

  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [images, setImages] = useState<
    { url: string; esPrincipal: boolean; orden: number }[]
  >([]);
  const [imageInput, setImageInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      moneda: "ARS",
      destacada: false,
      visible: true,
    },
  });

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
        currentProperty.direccion.departamento
      );
      setValue("direccion.barrio", currentProperty.direccion.barrio);
      setValue("direccion.ciudad", currentProperty.direccion.ciudad);
      setValue("direccion.provincia", currentProperty.direccion.provincia);
      setValue(
        "direccion.codigoPostal",
        currentProperty.direccion.codigoPostal
      );
      setValue("superficie.total", currentProperty.superficie?.total);
      setValue("superficie.cubierta", currentProperty.superficie?.cubierta);
      setValue("ambientes", currentProperty.ambientes);
      setValue("dormitorios", currentProperty.dormitorios);
      setValue("baños", currentProperty.baños);
      setValue("cocheras", currentProperty.cocheras);
      setValue("expensas", currentProperty.expensas);
      setValue("destacada", currentProperty.destacada);
      setValue("visible", currentProperty.visible);

      if (currentProperty.amenities) {
        setAmenities(currentProperty.amenities);
      }
      if (currentProperty.imagenes) {
        setImages(currentProperty.imagenes);
      }
    }
  }, [currentProperty, isEditMode]);

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const formattedData = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo,
        operacion: data.operacion,
        precio: data.precio,
        moneda: data.moneda,
        direccion: {
          calle: data.direccion?.calle,
          numero: data.direccion?.numero,
          piso: data.direccion?.piso,
          departamento: data.direccion?.departamento,
          barrio: data.direccion?.barrio,
          ciudad: data.direccion?.ciudad,
          provincia: data.direccion?.provincia,
          codigoPostal: data.direccion?.codigoPostal,
        },
        superficie: {
          total: data.superficie?.total,
          cubierta: data.superficie?.cubierta,
        },
        ambientes: data.ambientes,
        dormitorios: data.dormitorios,
        baños: data.baños,
        cocheras: data.cocheras,
        expensas: data.expensas,
        amenities,
        imagenes: images,
        destacada: data.destacada,
        visible: data.visible,
      };

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
        error.response?.data?.message || "Error al guardar la propiedad"
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

  const addImage = () => {
    if (imageInput.trim()) {
      const newImage = {
        url: imageInput.trim(),
        esPrincipal: images.length === 0,
        orden: images.length + 1,
      };
      setImages([...images, newImage]);
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reordenar
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      orden: i + 1,
      esPrincipal: i === 0 && newImages.length > 0 ? true : img.esPrincipal,
    }));
    setImages(reorderedImages);
  };

  const setPrincipalImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      esPrincipal: i === index,
    }));
    setImages(newImages);
  };

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
                  <Input
                    label="Ciudad"
                    {...register("direccion.ciudad")}
                    error={errors["direccion.ciudad"]?.message}
                    required
                  />
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
                  {errors["direccion.provincia"] && (
                    <span className={styles.error}>
                      {errors["direccion.provincia"].message}
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

          {/* Características */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>Características</h2>
            </CardHeader>
            <CardBody>
              <div className={styles.formGrid}>
                <div>
                  <Input
                    type="number"
                    label="Ambientes"
                    {...register("ambientes", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Dormitorios"
                    {...register("dormitorios", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Baños"
                    {...register("baños", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Cocheras"
                    {...register("cocheras", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Superficie Total (m²)"
                    {...register("superficie.total", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Superficie Cubierta (m²)"
                    {...register("superficie.cubierta", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>Amenities</h2>
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

          {/* Imágenes */}
          <Card>
            <CardHeader>
              <h2 className={styles.cardTitle}>Imágenes</h2>
            </CardHeader>
            <CardBody>
              <div className={styles.imagesSection}>
                <div className={styles.imageInput}>
                  <Input
                    type="url"
                    placeholder="URL de la imagen"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="primary"
                    icon={<Plus size={20} />}
                    onClick={addImage}
                  >
                    Agregar
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className={styles.imagesList}>
                    {images.map((image, index) => (
                      <div key={index} className={styles.imageItem}>
                        <img src={image.url} alt={`Imagen ${index + 1}`} />
                        {image.esPrincipal && (
                          <span className={styles.principalBadge}>
                            Principal
                          </span>
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
            <Button type="submit" variant="primary">
              {isEditMode ? "Actualizar Propiedad" : "Crear Propiedad"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreatePropertyPage;
