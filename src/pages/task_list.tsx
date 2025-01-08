import React, { useState, useEffect, useCallback } from "react";
import { useGetTasksQuery } from "../services/api";
import { Task } from "../services/api";
import TaskListItem from "../components/task_list_item";
import CustomSpinner from "../Spiner/custom_spinner";
import TaskListFilters from "../components/task_list_filters";
import { TaskFormInputs } from "./task_edit_modal";
import TaskEditModal from "./task_edit_modal";

export interface FiltersProps {
  sort: string;
  status: string;
  priority: string[];
}

const sortOptions = [
  "По названию",
  "По статусу выполнения",
  "По приоритету",
  "По дате",
];
const statusOptions = ["Все", "Выполненные", "Невыполненные"];
const priorityOptions = [
  "Все",
  "Высокий",
  "Средний",
  "Низкий",
  "Без приоритета",
];

const TaskList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching } = useGetTasksQuery(page);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FiltersProps>({
    sort: "По названию",
    status: "Все",
    priority: ["Все"],
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskFormInputs | null>(null);

  const handleAddTask = (data: TaskFormInputs) => {
    const newTask: Task = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      completed: data.completed as boolean,
      priority: data.priority,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setModalOpen(false);
  };

  console.log(tasks);

  const openModalForEditing = (task: TaskFormInputs) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  useEffect(() => {
    if (data) {
      const tasksWithPriority = data.map((task) => ({
        ...task,
        priority: task.priority || "Без приоритета",
      }));

      setTasks((prevTasks) => [...prevTasks, ...tasksWithPriority]);
    }
  }, [data]);

  const sortTasks = useCallback((tasks: Task[], criterion: string): Task[] => {
    const priorityOrder: Record<string, number> = {
      Высокий: 3,
      Средний: 2,
      Низкий: 1,
      "Без приоритета": 0,
    };

    switch (criterion) {
      case "По названию":
        return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
      case "По статусу выполнения":
        return [...tasks].sort(
          (a, b) => Number(a.completed) - Number(b.completed)
        );
      case "По приоритету":
        return [...tasks].sort(
          (a, b) =>
            (priorityOrder[b.priority || "Без приоритета"] || 0) -
            (priorityOrder[a.priority || "Без приоритета"] || 0)
        );
      case "По дате":
        return [...tasks].sort(
          (a, b) => new Date(a.id).getTime() - new Date(b.id).getTime()
        );
      default:
        return tasks;
    }
  }, []);

  const filterByStatus = useCallback(
    (tasks: Task[], filter: string): Task[] => {
      switch (filter) {
        case "Выполненные":
          return tasks.filter((task) => task.completed);
        case "Невыполненные":
          return tasks.filter((task) => !task.completed);
        default:
          return tasks; // all
      }
    },
    []
  );

  const filterByPriority = useCallback(
    (tasks: Task[], selectedPriorities: string[]): Task[] => {
      if (selectedPriorities.includes("Все")) {
        return tasks; // Возвращаем все задачи
      }

      return tasks.filter((task) =>
        selectedPriorities.includes(task.priority || "Без приоритета")
      );
    },
    []
  );

  const handleEdit =
    (task: Task) => (event: React.MouseEvent<HTMLButtonElement>) => {};
  const handleDelete =
    (taskId: number) => (event: React.MouseEvent<HTMLButtonElement>) => {};

  const processedTasks = useCallback(() => {
    const sorted = sortTasks(tasks, filters.sort);
    const filteredByStatus = filterByStatus(sorted, filters.status);
    return filterByPriority(filteredByStatus, filters.priority);
  }, [tasks, filters]);

  const filteredAndSortedTasks = processedTasks();

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const bottom =
        target.scrollHeight === target.scrollTop + target.clientHeight;
      if (bottom && !isFetching) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [isFetching]
  );

  const handlePriorityChange = (taskId: number, newPriority: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );
  };

  if (isLoading && page === 1) {
    return <CustomSpinner size={80} color="green" />;
  }

  if (error) {
    return <div>Ошибка загрузки задач</div>;
  }

  return (
    <>
      <h1>Список задач</h1>
      <button onClick={() => setModalOpen(true)}>Добавить задачу</button>

      {/* Модалка */}
      <TaskEditModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTask}
        initialData={taskToEdit || undefined}
      />
      <TaskListFilters
        sortOptions={sortOptions}
        setFilters={setFilters}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
      />
      <div
        className="task-list_wrapper"
        style={{ height: "330px", overflowY: "auto" }}
        onScroll={handleScroll}
      >
        <ul>
          {filteredAndSortedTasks.map((task) => {
            return (
              <TaskListItem
                key={task.id}
                task={task}
                onPriorityChange={handlePriorityChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </ul>

        {isFetching && <CustomSpinner size={80} color="green" />}
      </div>
    </>
  );
};

export default TaskList;
