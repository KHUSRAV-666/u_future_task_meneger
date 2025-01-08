import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export interface TaskFormInputs {
  id?: number;
  title: string;
  description?: string;
  completed: string | boolean;
  priority: string;
}

interface TaskEditModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: TaskFormInputs) => void; 
  initialData?: TaskFormInputs; 
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    defaultValues: initialData || {
      title: "",
      description: "",
      completed: "",
      priority: "",
    },
  });

  useEffect(() => {
    reset(
      initialData || {
        title: "",
        description: "",
        completed: "",
        priority: "",
      }
    );
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<TaskFormInputs> = (data) => {
    onSubmit({ ...data, completed: data.completed === "true" });
    onClose(); 
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h2>{initialData ? "Редактировать задачу" : "Добавить задачу"}</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Название */}
          <div className="form-group">
            <label htmlFor="title">Название</label>
            <input
              id="title"
              {...register("title", {
                required: "Название обязательно",
                minLength: { value: 4, message: "Минимальная длина 4 символа" },
                maxLength: {
                  value: 200,
                  message: "Максимальная длина 200 символов",
                },
              })}
            />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              {...register("description", {
                required: "Описание обязательно",
                maxLength: { value: 500, message: "Максимум 500 символов" },
              })}
            ></textarea>
            {errors.description && (
              <p className="error">{errors.description.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Статус</label>
            <select
              id="status"
              {...register("completed", { required: "Выберите статус" })}
            >
              <option value="">Выберите</option>
              <option value={"false"}>Не выполнено</option>
              <option value={"true"}>Выполнено</option>
            </select>
            {errors.completed && (
              <p className="error">{errors.completed.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Приоритет</label>
            <select
              id="priority"
              {...register("priority", { required: "Выберите приоритет" })}
            >
              <option value="">Выберите</option>
              <option value="Высокий">Высокий</option>
              <option value="Средний">Средний</option>
              <option value="Низкий">Низкий</option>
            </select>
            {errors.priority && (
              <p className="error">{errors.priority.message}</p>
            )}
          </div>

          <button type="submit">
            {initialData ? "Сохранить изменения" : "Добавить"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
