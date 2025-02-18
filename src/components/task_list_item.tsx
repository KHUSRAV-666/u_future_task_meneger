import { MouseEventHandler } from "react";
import { Task } from "../services/api";

interface TaskListItemProps {
  task: Task;
  onPriorityChange: (taskId: number, newPriority: string) => void; // Тип для пропса
  onEdit: (task: Task) => MouseEventHandler<HTMLButtonElement>;
  onDelete: (taskId: number) => MouseEventHandler<HTMLButtonElement>;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onPriorityChange,
  onEdit,
  onDelete,
}) => {
  const priorities = ["Без приоритета", "Низкий", "Средний", "Высокий"];

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPriority = event.target.value;
    onPriorityChange(task.id, newPriority);
  };

  return (
    <li
      className={`task-list_item ${task.completed ? "_completed" : ""}`}
      key={task.id}
    >
      <select
        className={`status_${priorities.indexOf(
          task.priority || "Без приоритета"
        )}`}
        value={task.priority}
        onChange={handlePriorityChange}
      >
        {priorities.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span>{task.id}.</span>
      <h4>{task.title}</h4>
      <button
        style={{
          width: "fitContent",
          padding: "0 5px",
          backgroundColor: "green",
        }}
        onClick={onEdit(task)}
      >
        edit
      </button>
      <button
        style={{
          width: "fitContent",
          padding: "0 5px",
          backgroundColor: "red",
        }}
        onClick={onDelete(task.id)}
      >
        x
      </button>
      <p
        className={`task-list_item-status ${task.completed ? "completed" : ""}`}
      >
        {task.completed ? "Выполнено" : "Не выполнено"}
      </p>
    </li>
  );
};

export default TaskListItem;
