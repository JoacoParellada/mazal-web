import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";
import { AdminLayout } from "@components/layout/AdminLayout/AdminLayout";
import { Button } from "@components/common/Button/Button";
import { Card, CardBody } from "@components/common/Card/Card";
import { Modal } from "@components/common/Modal/Modal";
import { Input } from "@components/common/Input/Input";
import { Loader } from "@components/common/Loader/Loader";
import { usersAPI } from "@api/users.api";
import { authAPI } from "@api/auth.api";
import { User } from "@/types/auth.types";
import { USER_ROLES } from "@utils/constants";
import { formatDate } from "@utils/formatters";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import styles from "./UsersPage.module.css";

interface UserFormData {
  nombre: string;
  email: string;
  password?: string;
  rol: string;
  telefono?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "delete" | null;
    user: User | null;
  }>({
    isOpen: false,
    mode: null,
    user: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (
    mode: "create" | "edit" | "delete",
    user: User | null = null
  ) => {
    setModalState({ isOpen: true, mode, user });
    if (mode === "edit" && user) {
      setValue("nombre", user.nombre);
      setValue("email", user.email);
      setValue("rol", user.rol);
      setValue("telefono", user.telefono || "");
    } else {
      reset();
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: null, user: null });
    reset();
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      if (modalState.mode === "create") {
        await authAPI.register({
          ...data,
          password: data.password || "defaultPassword123",
        } as any);
        toast.success("Usuario creado exitosamente");
      } else if (modalState.mode === "edit" && modalState.user) {
        await usersAPI.update(modalState.user._id, data);
        toast.success("Usuario actualizado exitosamente");
      }
      closeModal();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al guardar usuario");
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      if (user.activo) {
        await usersAPI.deactivate(user._id);
        toast.success("Usuario desactivado");
      } else {
        await usersAPI.activate(user._id);
        toast.success("Usuario activado");
      }
      fetchUsers();
    } catch (error) {
      toast.error("Error al cambiar estado del usuario");
    }
  };

  const handleDelete = async () => {
    if (!modalState.user) return;

    try {
      await usersAPI.delete(modalState.user._id);
      toast.success("Usuario eliminado exitosamente");
      closeModal();
      fetchUsers();
    } catch (error) {
      toast.error("Error al eliminar usuario");
    }
  };

  const getRoleBadge = (rol: string) => {
    const colors: { [key: string]: string } = {
      admin: "#ef4444",
      supervisor: "#f59e0b",
      agente: "#3b82f6",
    };
    return colors[rol] || "#6b7280";
  };
  if (isLoading) {
    return (
      <AdminLayout>
        <Loader fullScreen />
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestión de Usuarios</h1>
            <p className={styles.subtitle}>Total: {users.length} usuarios</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => openModal("create")}
          >
            Nuevo Usuario
          </Button>
        </div>
        <div className={styles.usersList}>
          {users.map((user) => (
            <Card key={user._id} hoverable>
              <CardBody>
                <div className={styles.userItem}>
                  <div className={styles.userInfo}>
                    <div className={styles.userHeader}>
                      <div className={styles.userName}>
                        <h3>{user.nombre}</h3>
                        {!user.activo && (
                          <span className={styles.inactiveBadge}>Inactivo</span>
                        )}
                      </div>
                      <span
                        className={styles.roleBadge}
                        style={{ backgroundColor: getRoleBadge(user.rol) }}
                      >
                        {user.rol}
                      </span>
                    </div>

                    <div className={styles.userDetails}>
                      <div className={styles.detail}>
                        <Mail size={16} />
                        <span>{user.email}</span>
                      </div>
                      {user.telefono && (
                        <div className={styles.detail}>
                          <Phone size={16} />
                          <span>{user.telefono}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.userMeta}>
                      <span>Creado: {formatDate(user.createdAt)}</span>
                      {user.ultimoAcceso && (
                        <span>
                          Último acceso: {formatDate(user.ultimoAcceso)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.userActions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit size={18} />}
                      onClick={() => openModal("edit", user)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={
                        user.activo ? (
                          <UserX size={18} />
                        ) : (
                          <UserCheck size={18} />
                        )
                      }
                      onClick={() => handleToggleActive(user)}
                    >
                      {user.activo ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={18} />}
                      onClick={() => openModal("delete", user)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal para crear/editar usuario */}
      <Modal
        isOpen={
          modalState.isOpen &&
          (modalState.mode === "create" || modalState.mode === "edit")
        }
        onClose={closeModal}
        title={
          modalState.mode === "create" ? "Nuevo Usuario" : "Editar Usuario"
        }
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="Nombre completo"
            {...register("nombre", { required: "El nombre es obligatorio" })}
            error={errors.nombre?.message}
            required
          />

          <Input
            type="email"
            label="Correo electrónico"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Email inválido",
              },
            })}
            error={errors.email?.message}
            required
          />

          {modalState.mode === "create" && (
            <Input
              type="password"
              label="Contraseña"
              {...register("password", {
                required:
                  modalState.mode === "create"
                    ? "La contraseña es obligatoria"
                    : false,
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              error={errors.password?.message}
              helperText="Mínimo 6 caracteres"
              required={modalState.mode === "create"}
            />
          )}

          <div>
            <label className={styles.label}>
              Rol <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              {...register("rol", { required: "El rol es obligatorio" })}
            >
              <option value="">Seleccionar</option>
              {USER_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.rol && (
              <span className={styles.error}>{errors.rol.message}</span>
            )}
          </div>

          <Input
            type="tel"
            label="Teléfono"
            {...register("telefono")}
            error={errors.telefono?.message}
            placeholder="+54 261 123-4567"
          />

          <div className={styles.modalActions}>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {modalState.mode === "create"
                ? "Crear Usuario"
                : "Actualizar Usuario"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={modalState.isOpen && modalState.mode === "delete"}
        onClose={closeModal}
        title="Confirmar eliminación"
        size="sm"
      >
        <div className={styles.deleteModal}>
          <p>
            ¿Estás seguro de que deseas eliminar a {modalState.user?.nombre}?
          </p>
          <p className={styles.warning}>Esta acción no se puede deshacer.</p>
          <div className={styles.modalActions}>
            <Button variant="outline" fullWidth onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="danger" fullWidth onClick={handleDelete}>
              Eliminar Usuario
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
export default UsersPage;
