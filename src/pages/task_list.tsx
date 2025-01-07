import React, { useState, useEffect, useCallback } from "react";
import { useGetTasksQuery } from "../services/api";
import { Task } from "../services/api";
import TaskListItem from "../components/task_list_item";
import CustomSpinner from "../Spiner/custom_spinner";

const TaskList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching } = useGetTasksQuery(page);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("По названию");
  const [filterStatus, setFilterStatus] = useState<string>("Все");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    "Все",
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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

  // Восстанавливаем сортировку из localStorage при первой загрузке
  useEffect(() => {
    const savedSortOrder = localStorage.getItem("sortOrder");
    if (savedSortOrder) {
      setSortOrder(savedSortOrder);
    }
  }, []);

  // Сохраняем сортировку в localStorage при её изменении
  useEffect(() => {
    localStorage.setItem("sortOrder", sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    if (data) {
      const tasksWithPriority = data.map((task) => ({
        ...task,
        priority: "Без приоритета",
      }));

      setTasks((prevTasks) => [...prevTasks, ...tasksWithPriority]);
    }
  }, [data]);

  const sortTasks = useCallback((tasks: Task[], criterion: string): Task[] => {
    switch (criterion) {
      case "По названию":
        return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
      case "По статусу выполнения":
        return [...tasks].sort(
          (a, b) => Number(a.completed) - Number(b.completed)
        );
      // case "По приоритету":
      //   // Для сортировки по приоритету потребуется поле `priority`
      //   return [...tasks].sort((a, b) => (a.priority || 0) - (b.priority || 0));
      case "По дате":
        return [...tasks].sort(
          (a, b) => new Date(a.id).getTime() - new Date(b.id).getTime()
        );
      default:
        return tasks;
    }
  }, []);

  const filterTasks = useCallback((tasks: Task[], filter: string): Task[] => {
    switch (filter) {
      case "Выполненные":
        return tasks.filter((task) => task.completed);
      case "Невыполненные":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks; // all
    }
  }, []);

  const handlePriorityFilter = (priority: string) => {
    if (priority === "Все") {
      // Если выбран "Все", включаем все приоритеты
      setSelectedPriorities(
        selectedPriorities.includes("Все")
          ? []
          : priorityOptions.filter((p) => p !== "Все")
      );
    } else {
      setSelectedPriorities((prev) => {
        const updated = prev.includes(priority)
          ? prev.filter((p) => p !== priority) // Убираем приоритет
          : [...prev, priority]; // Добавляем приоритет

        // Если все приоритеты выбраны, добавляем "Все"
        if (updated.length === priorityOptions.length - 1) {
          return [...updated, "Все"];
        }

        // Убираем "Все", если что-то изменилось
        return updated.filter((p) => p !== "Все");
      });
    }
  };

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

  const processedTasks = useCallback(() => {
    const sorted = sortTasks(tasks, sortOrder); // Сортировка
    const filteredByStatus = filterTasks(sorted, filterStatus); // Фильтрация по статусу
    return filterByPriority(filteredByStatus, selectedPriorities); // Фильтрация по приоритету
  }, [tasks, sortOrder, filterStatus, selectedPriorities]);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (isLoading && page === 1) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks</div>;
  }

  return (
    <>
      <div className="filters_wrapper">
        <h3>Фильтры</h3>
        <div className="filters-block">
          <select
            className="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="priority-filters">
            <span onClick={() => toggleDropdown()}>
              Фильтрация по приоритету
            </span>
            <div
              className={`priority-filters_popup ${isDropdownOpen && "show"}`}
            >
              {priorityOptions.map((priority) => (
                <label key={priority}>
                  <input
                    type="checkbox"
                    value={priority}
                    checked={selectedPriorities.includes(priority)}
                    onChange={() => handlePriorityFilter(priority)}
                  />
                  {priority}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
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
