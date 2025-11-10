import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Car, Maximize } from "lucide-react";
import { Property } from "@/types/propierties.types";
import { formatPrice } from "@utils/formatters";
import styles from "./PropertyCard.module.css";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const mainImage =
    property.imagenes?.find((img) => img.esPrincipal)?.url ||
    property.imagenes?.[0]?.url ||
    "https://via.placeholder.com/400x300?text=Sin+Imagen";

  const tipoLabel = {
    casa: "Casa",
    departamento: "Departamento",
    local: "Local",
    terreno: "Terreno",
    oficina: "Oficina",
    ph: "PH",
    quinta: "Quinta",
  }[property.tipo];

  const operacionLabel = property.operacion === "venta" ? "Venta" : "Alquiler";

  return (
    <Link to={`/propiedades/${property._id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={mainImage} alt={property.titulo} className={styles.image} />
        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles[property.operacion]}`}>
            {operacionLabel}
          </span>
          {property.destacada && (
            <span className={`${styles.badge} ${styles.destacada}`}>
              Destacada
            </span>
          )}
        </div>
        <div className={styles.tipo}>{tipoLabel}</div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{property.titulo}</h3>

        <div className={styles.location}>
          <MapPin size={16} />
          <span>
            {property.direccion.barrio}, {property.direccion.ciudad}
          </span>
        </div>

        <p className={styles.description}>
          {property.descripcion.substring(0, 100)}...
        </p>

        <div className={styles.features}>
          {property.dormitorios !== undefined && (
            <div className={styles.feature}>
              <BedDouble size={18} />
              <span>{property.dormitorios}</span>
            </div>
          )}
          {property.baños !== undefined && (
            <div className={styles.feature}>
              <Bath size={18} />
              <span>{property.baños}</span>
            </div>
          )}
          {property.cocheras !== undefined && property.cocheras > 0 && (
            <div className={styles.feature}>
              <Car size={18} />
              <span>{property.cocheras}</span>
            </div>
          )}
          {property.superficie?.total && (
            <div className={styles.feature}>
              <Maximize size={18} />
              <span>{property.superficie.total}m²</span>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            {formatPrice(property.precio, property.moneda)}
          </div>
          {property.expensas && (
            <div className={styles.expensas}>
              + ${property.expensas.toLocaleString()} expensas
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
