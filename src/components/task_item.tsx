import { useState } from "react";
import { Task } from "../services/api";

function TaskItem(task: Task) {
  const [priority, setPriority] = useState("Без приоритета");
  const priorities = ["Без приоритета", "Низкий", "Средний", "Высокий"];

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriority(event.target.value);
  };

  return (
    <li
      className={`task-list_item ${task.completed ? "_completed" : ""}`}
      key={task.id}
    >
      <select
        className={`status_${+priorities.indexOf(
          priority
        )}`}
        value={priority}
        onChange={handlePriorityChange}
      >
        {priorities.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <h4>{task.title}</h4>
      <p
        className={`task-list_item-status ${
          task.completed ? "_completed" : ""
        }`}
      >
        {task.completed ? "Выполнено" : "Не выполнено"}
      </p>
    </li>
  );
}

export default TaskItem;
