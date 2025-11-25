import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@components/common/Button/Button";
import { PropertyFilters as PropertyFiltersType } from "@/types/propierties.types";
import { PROPERTY_TYPES, OPERATION_TYPES, PROVINCES } from "@utils/constants";
import styles from "./PropertyFilters.module.css";

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFilterChange: (filters: PropertyFiltersType) => void;
  onClose?: () => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] =
    useState<PropertyFiltersType>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onFilterChange(localFilters);
    if (onClose) onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onFilterChange({});
    if (onClose) onClose();
  };

  return (
    <div className={styles.filters}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filtros</h3>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Tipo de Operación</label>
        <select
          className={styles.select}
          value={localFilters.operacion || ""}
          onChange={(e) => handleChange("operacion", e.target.value)}
        >
          <option value="">Todos</option>
          {OPERATION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Tipo de Propiedad</label>
        <select
          className={styles.select}
          value={localFilters.tipo || ""}
          onChange={(e) => handleChange("tipo", e.target.value)}
        >
          <option value="">Todos</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Provincia</label>
        <select
          className={styles.select}
          value={localFilters.provincia || ""}
          onChange={(e) => handleChange("provincia", e.target.value)}
        >
          <option value="">Todas</option>
          {PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      

      <div className={styles.filterGroup}>
        <label className={styles.label}>Precio Mínimo</label>
        <input
          type="number"
          className={styles.input}
          placeholder="0"
          min={0}
          value={localFilters.precioMin ?? ""}
          onChange={(e) =>
            handleChange(
              "precioMin",
              e.target.value ? Math.max(0, Number(e.target.value)) : undefined
            )
          }
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Precio Máximo</label>
        <input
          type="number"
          className={styles.input}
          placeholder="Sin límite"
          min={0}
          value={localFilters.precioMax ?? ""}
          onChange={(e) =>
            handleChange(
              "precioMax",
              e.target.value ? Math.max(0, Number(e.target.value)) : undefined
            )
          }
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Ambientes Mínimos</label>
        <select
          className={styles.select}
          value={localFilters.ambientes || ""}
          onChange={(e) =>
            handleChange(
              "ambientes",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">Cualquiera</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Dormitorios Mínimos</label>
        <select
          className={styles.select}
          value={localFilters.dormitorios || ""}
          onChange={(e) =>
            handleChange(
              "dormitorios",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">Cualquiera</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/*<div className={styles.checkboxGroup}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={localFilters.destacada || false}
            onChange={(e) =>
              handleChange("destacada", e.target.checked || undefined)
            }
          />
          <span>Solo destacadas</span>
        </label>
      </div>}*/}

      <div className={styles.actions}>
        <Button variant="primary" fullWidth onClick={handleSubmit}>
          Aplicar Filtros
        </Button>
        <Button variant="ghost" fullWidth onClick={handleReset}>
          Limpiar Filtros
        </Button>
      </div>
    </div>
  );
};
