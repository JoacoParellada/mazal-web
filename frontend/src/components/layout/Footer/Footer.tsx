import { Building2, Mail, Phone, MapPin } from "lucide-react";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <div className={styles.logo}>
              <Building2 size={32} />
              <span>Inmobiliaria</span>
            </div>
            <p className={styles.description}>
              Tu socio de confianza en bienes raíces. Encontramos el hogar
              perfecto para ti.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Contacto</h3>
            <div className={styles.contactList}>
              <a href="tel:+542611234567" className={styles.contactItem}>
                <Phone size={18} />
                +54 261 123-4567
              </a>
              <a
                href="mailto:info@inmobiliaria.com"
                className={styles.contactItem}
              >
                <Mail size={18} />
                info@inmobiliaria.com
              </a>
              <div className={styles.contactItem}>
                <MapPin size={18} />
                Mendoza, Argentina
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Enlaces</h3>
            <div className={styles.linkList}>
              <a href="/" className={styles.link}>
                Inicio
              </a>
              <a href="/propiedades" className={styles.link}>
                Propiedades
              </a>
              <a href="/propiedades?tipo=casa" className={styles.link}>
                Casas
              </a>
              <a href="/propiedades?tipo=departamento" className={styles.link}>
                Departamentos
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            &copy; {new Date().getFullYear()} Inmobiliaria. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
