import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Maximize,
  ArrowLeft,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Home,
  DollarSign,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar/NavBar";
import { Footer } from "@components/layout/Footer/Footer";
import { Button } from "@components/common/Button/Button";
import { Loader } from "@components/common/Loader/Loader";
import { Card, CardBody, CardHeader } from "@components/common/Card/Card";
import { usePropertiesStore } from "@store/propertiesStore";
import { formatPrice, formatDate } from "@utils/formatters";
import { toast } from "react-toastify";
import styles from "./PropertyDetailPage.module.css";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProperty, isLoading, fetchPropertyById } =
    usePropertiesStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyById(id);
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Loader fullScreen />
      </>
    );
  }

  if (!currentProperty) {
    return (
      <>
        <Navbar />
        <div className={styles.notFound}>
          <Home size={64} />
          <h2>Propiedad no encontrada</h2>
          <p>La propiedad que buscas no existe o fue eliminada</p>
          <Button onClick={() => navigate("/propiedades")}>
            Ver todas las propiedades
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const images = [...(currentProperty.imagenes || [])].sort((a, b) => {
    if (a.esPrincipal) return -1;
    if (b.esPrincipal) return 1;
    return a.orden - b.orden;
  });
  const hasImages = images.length > 0;

  const tipoLabel = {
    casa: "Casa",
    departamento: "Departamento",
    local: "Local Comercial",
    terreno: "Terreno",
    oficina: "Oficina",
    ph: "PH",
    quinta: "Quinta",
  }[currentProperty.tipo];

  const operacionLabel =
    currentProperty.operacion === "venta" ? "En Venta" : "En Alquiler";
  const estadoLabel = {
    disponible: "Disponible",
    reservada: "Reservada",
    vendida: "Vendida",
    alquilada: "Alquilada",
  }[currentProperty.estado];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentProperty.titulo,
          text: currentProperty.descripcion,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error al compartir:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/propiedades">Propiedades</Link>
          <span>/</span>
          <span>{currentProperty.titulo}</span>
        </div>

        <Button
          variant="ghost"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          Volver
        </Button>

        <div className={styles.content}>
          {/* Columna izquierda: Galería */}
          <div className={styles.leftColumn}>
            <div className={styles.gallery}>
              {hasImages ? (
                <>
                  <div className={styles.mainImage}>
                    <img
                      src={images[currentImageIndex]?.url}
                      alt={`${currentProperty.titulo} - Imagen ${
                        currentImageIndex + 1
                      }`}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          className={styles.prevButton}
                          onClick={prevImage}
                        >
                          <ChevronLeft size={32} />
                        </button>
                        <button
                          className={styles.nextButton}
                          onClick={nextImage}
                        >
                          <ChevronRight size={32} />
                        </button>
                        <div className={styles.imageCounter}>
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className={styles.thumbnails}>
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className={`${styles.thumbnail} ${
                            index === currentImageIndex ? styles.active : ""
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img src={image.url} alt={`Miniatura ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noImage}>
                  <img
                    src="https://via.placeholder.com/800x600?text=Sin+Imagen"
                    alt="Sin imagen disponible"
                  />
                </div>
              )}
            </div>

            {/* Descripción */}
            <Card>
              <CardHeader>
                <h2 className={styles.sectionTitle}>Descripción</h2>
              </CardHeader>
              <CardBody>
                <p className={styles.description}>
                  {currentProperty.descripcion}
                </p>
              </CardBody>
            </Card>

            {/* Amenities */}
            {currentProperty.amenities &&
              currentProperty.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <h2 className={styles.sectionTitle}>Amenities</h2>
                  </CardHeader>
                  <CardBody>
                    <div className={styles.amenities}>
                      {currentProperty.amenities.map((amenity, index) => (
                        <div key={index} className={styles.amenity}>
                          <span className={styles.checkmark}>✓</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

            {/* Ubicación */}
            <Card>
              <CardHeader>
                <h2 className={styles.sectionTitle}>Ubicación</h2>
              </CardHeader>
              <CardBody>
                <div className={styles.locationInfo}>
                  <MapPin size={20} className={styles.locationIcon} />
                  <div>
                    <p className={styles.locationText}>
                      {currentProperty.direccion.calle &&
                        `${currentProperty.direccion.calle} `}
                      {currentProperty.direccion.numero &&
                        `${currentProperty.direccion.numero}, `}
                      {currentProperty.direccion.piso &&
                        `Piso ${currentProperty.direccion.piso} `}
                      {currentProperty.direccion.departamento &&
                        `${currentProperty.direccion.departamento}, `}
                    </p>
                    <p className={styles.locationText}>
                      {currentProperty.direccion.barrio &&
                        `${currentProperty.direccion.barrio}, `}
                      {currentProperty.direccion.ciudad},{" "}
                      {currentProperty.direccion.provincia}
                    </p>
                    {currentProperty.direccion.codigoPostal && (
                      <p className={styles.locationText}>
                        CP: {currentProperty.direccion.codigoPostal}
                      </p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Columna derecha: Información y contacto */}
          <div className={styles.rightColumn}>
            {/* Header con badges */}
            <div className={styles.propertyHeader}>
              <div className={styles.badges}>
                <span
                  className={`${styles.badge} ${
                    styles[currentProperty.operacion]
                  }`}
                >
                  {operacionLabel}
                </span>
                <span className={`${styles.badge} ${styles.tipo}`}>
                  {tipoLabel}
                </span>
                {currentProperty.estado !== "disponible" && (
                  <span
                    className={`${styles.badge} ${
                      styles[currentProperty.estado]
                    }`}
                  >
                    {estadoLabel}
                  </span>
                )}
              </div>
              <div className={styles.headerActions}>
                <button
                  className={styles.iconButton}
                  onClick={handleShare}
                  title="Compartir"
                >
                  <Share2 size={20} />
                </button>
                <button
                  className={styles.iconButton}
                  title="Guardar en favoritos"
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>

            <h1 className={styles.title}>{currentProperty.titulo}</h1>

            {/* Precio */}
            <Card className={styles.priceCard}>
              <CardBody>
                <div className={styles.priceSection}>
                  <div className={styles.priceLabel}>
                    <span className={styles.currencyBadge}>
                      {currentProperty.moneda || "ARS"}
                    </span>
                    Precio
                  </div>
                  <div className={styles.priceValue}>
                    {formatPrice(
                      currentProperty.precio,
                      currentProperty.moneda,
                    )}
                  </div>
                  {currentProperty.expensas && (
                    <div className={styles.expensas}>
                      + ${currentProperty.expensas.toLocaleString()} expensas
                      mensuales
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Características principales */}
            <Card>
              <CardHeader>
                <h3 className={styles.cardTitle}>Características</h3>
              </CardHeader>
              <CardBody>
                <div className={styles.features}>
                  {currentProperty.ambientes !== undefined && (
                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <Home size={24} />
                      </div>
                      <div className={styles.featureInfo}>
                        <span className={styles.featureValue}>
                          {currentProperty.ambientes}
                        </span>
                        <span className={styles.featureLabel}>Ambientes</span>
                      </div>
                    </div>
                  )}
                  {currentProperty.dormitorios !== undefined && (
                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <BedDouble size={24} />
                      </div>
                      <div className={styles.featureInfo}>
                        <span className={styles.featureValue}>
                          {currentProperty.dormitorios}
                        </span>
                        <span className={styles.featureLabel}>Dormitorios</span>
                      </div>
                    </div>
                  )}
                  {currentProperty.banos !== undefined && (
                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <Bath size={24} />
                      </div>
                      <div className={styles.featureInfo}>
                        <span className={styles.featureValue}>
                          {currentProperty.banos}
                        </span>
                        <span className={styles.featureLabel}>Baños</span>
                      </div>
                    </div>
                  )}
                  {currentProperty.cocheras !== undefined &&
                    currentProperty.cocheras > 0 && (
                      <div className={styles.feature}>
                        <div className={styles.featureIcon}>
                          <Car size={24} />
                        </div>
                        <div className={styles.featureInfo}>
                          <span className={styles.featureValue}>
                            {currentProperty.cocheras}
                          </span>
                          <span className={styles.featureLabel}>Cocheras</span>
                        </div>
                      </div>
                    )}
                  {currentProperty.superficie?.total && (
                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <Maximize size={24} />
                      </div>
                      <div className={styles.featureInfo}>
                        <span className={styles.featureValue}>
                          {currentProperty.superficie.total}m²
                        </span>
                        <span className={styles.featureLabel}>Sup. Total</span>
                      </div>
                    </div>
                  )}
                  {currentProperty.superficie?.cubierta && (
                    <div className={styles.feature}>
                      <div className={styles.featureIcon}>
                        <Maximize size={24} />
                      </div>
                      <div className={styles.featureInfo}>
                        <span className={styles.featureValue}>
                          {currentProperty.superficie.cubierta}m²
                        </span>
                        <span className={styles.featureLabel}>
                          Sup. Cubierta
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Información adicional */}
            <Card>
              <CardHeader>
                <h3 className={styles.cardTitle}>Información Adicional</h3>
              </CardHeader>
              <CardBody>
                <div className={styles.additionalInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Código:</span>
                    <span className={styles.infoValue}>
                      #{currentProperty._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Publicado:</span>
                    <span className={styles.infoValue}>
                      <Calendar size={16} />
                      {formatDate(currentProperty.createdAt)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Estado:</span>
                    <span
                      className={`${styles.infoValue} ${styles.statusBadge} ${
                        styles[currentProperty.estado]
                      }`}
                    >
                      {estadoLabel}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PropertyDetailPage;
