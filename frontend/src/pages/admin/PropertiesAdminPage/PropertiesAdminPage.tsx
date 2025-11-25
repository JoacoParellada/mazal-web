import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
} from "lucide-react";
import { AdminLayout } from "@components/layout/AdminLayout/AdminLayout";
import { Button } from "@components/common/Button/Button";
import { Input } from "@components/common/Input/Input";
import { Card, CardBody } from "@components/common/Card/Card";
import { Modal } from "@components/common/Modal/Modal";
import { Loader } from "@components/common/Loader/Loader";
import { usePropertiesStore } from "@store/propertiesStore";
import { useDebounce } from "@hooks/useDebounce";
import { formatPrice, formatDate } from "@utils/formatters";
import { propertiesAPI } from "@api/properties.api";
import { toast } from "react-toastify";
import styles from "./PropertiesAdminPage.module.css";

const PropertiesAdminPage = () => {
  const { properties, isLoading, total, fetchProperties, filters } =
    usePropertiesStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterOperacion, setFilterOperacion] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    propertyId: string | null;
  }>({
    isOpen: false,
    propertyId: null,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchProperties({
      ...filters,
      tipo: filterTipo || undefined,
      operacion: filterOperacion || undefined,
      limit: 20,
    });
  }, [filterTipo, filterOperacion, debouncedSearch]);

  const handleToggleVisibility = async (id: string) => {
    try {
      await propertiesAPI.toggleVisibility(id);
      toast.success("Visibilidad actualizada");
      fetchProperties(filters);
    } catch (error) {
      toast.error("Error al actualizar visibilidad");
    }
  };

  const handleToggleDestacada = async (id: string) => {
    try {
      await propertiesAPI.toggleDestacada(id);
      toast.success("Propiedad actualizada");
      fetchProperties(filters);
    } catch (error) {
      toast.error("Error al actualizar propiedad");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.propertyId) return;

    try {
      await propertiesAPI.delete(deleteModal.propertyId);
      toast.success("Propiedad eliminada exitosamente");
      setDeleteModal({ isOpen: false, propertyId: null });
      fetchProperties(filters);
    } catch (error) {
      toast.error("Error al eliminar propiedad");
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestión de Propiedades</h1>
            <p className={styles.subtitle}>Total: {total} propiedades</p>
          </div>
          <Link to="/admin/propiedades/nueva">
            <Button variant="primary" icon={<Plus size={20} />}>
              Nueva Propiedad
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <Card>
          <CardBody>
            <div className={styles.filters}>
              <select
                className={styles.select}
                value={filterOperacion}
                onChange={(e) => setFilterOperacion(e.target.value)}
              >
                <option value="">Todas las operaciones</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
              <select
                className={styles.select}
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="local">Local</option>
                <option value="terreno">Terreno</option>
                <option value="oficina">Oficina</option>
                <option value="ph">PH</option>
                <option value="quinta">Quinta</option>
              </select>
            </div>
          </CardBody>
        </Card>

        {/* Lista de propiedades */}
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader size="lg" />
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardBody>
              <div className={styles.emptyState}>
                <Plus size={64} />
                <h3>No hay propiedades</h3>
                <p>Comienza agregando tu primera propiedad</p>
                <Link to="/admin/propiedades/nueva">
                  <Button variant="primary">Nueva Propiedad</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className={styles.propertyList}>
            {properties.map((property) => (
              <Card key={property._id} hoverable>
                <CardBody>
                  <div className={styles.propertyItem}>
                    <div className={styles.propertyImage}>
                      <img
                        src={
                          property.imagenes?.find((img) => img.esPrincipal)
                            ?.url ||
                          property.imagenes?.[0]?.url ||
                          "https://via.placeholder.com/200x150?text=Sin+Imagen"
                        }
                        alt={property.titulo}
                      />
                      <div className={styles.propertyBadges}>
                        {!property.visible && (
                          <span className={styles.badge}>Oculta</span>
                        )}
                        {property.destacada && (
                          <span
                            className={`${styles.badge} ${styles.destacada}`}
                          >
                            Destacada
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.propertyInfo}>
                      <div className={styles.propertyHeader}>
                        <h3 className={styles.propertyTitle}>
                          {property.titulo}
                        </h3>
                        <div className={styles.propertyMeta}>
                          <span className={styles.tipo}>{property.tipo}</span>
                          <span className={styles.operacion}>
                            {property.operacion}
                          </span>
                          <span
                            className={`${styles.estado} ${
                              styles[property.estado]
                            }`}
                          >
                            {property.estado}
                          </span>
                        </div>
                      </div>

                      <p className={styles.propertyLocation}>
                        {property.direccion.ciudad},{" "}
                        {property.direccion.provincia}
                      </p>

                      <div className={styles.propertyDetails}>
                        <span>{property.ambientes} amb</span>
                        <span>•</span>
                        <span>{property.dormitorios} dorm</span>
                        <span>•</span>
                        <span>{property.banos} baños</span>
                        {property.superficie?.total && (
                          <>
                            <span>•</span>
                            <span>{property.superficie.total}m²</span>
                          </>
                        )}
                      </div>

                      <div className={styles.propertyFooter}>
                        <div className={styles.propertyPrice}>
                          {formatPrice(property.precio, property.moneda)}
                        </div>
                        <div className={styles.propertyDate}>
                          {formatDate(property.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className={styles.propertyActions}>
                      <Link to={`/propiedades/${property._id}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Eye size={18} />}
                        >
                          Ver
                        </Button>
                      </Link>
                      <Link to={`/admin/propiedades/editar/${property._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit size={18} />}
                        >
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={
                          property.visible ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )
                        }
                        onClick={() => handleToggleVisibility(property._id)}
                      >
                        {property.visible ? "Ocultar" : "Mostrar"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={
                          property.destacada ? (
                            <StarOff size={18} />
                          ) : (
                            <Star size={18} />
                          )
                        }
                        onClick={() => handleToggleDestacada(property._id)}
                      >
                        {property.destacada ? "Quitar" : "Destacar"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 size={18} />}
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            propertyId: property._id,
                          })
                        }
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, propertyId: null })}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className={styles.deleteModal}>
          <p>¿Estás seguro de que deseas eliminar esta propiedad?</p>
          <p className={styles.warning}>Esta acción no se puede deshacer.</p>
          <div className={styles.modalActions}>
            <Button
              variant="outline"
              fullWidth
              onClick={() =>
                setDeleteModal({ isOpen: false, propertyId: null })
              }
            >
              Cancelar
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default PropertiesAdminPage;
