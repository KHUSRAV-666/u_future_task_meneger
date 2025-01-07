import React, { useState, useEffect, useCallback } from "react";
import { useGetTasksQuery } from "../services/api";
import { Task } from "../services/api";
import TaskItem from "../components/task_item";

const TaskList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching } = useGetTasksQuery(page);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (data) {
      setTasks((prevTasks) => [...prevTasks, ...data]);
    }
  }, [data]);

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

  if (isLoading && page === 1) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tasks</div>;
  }

  return (
    <div
      className="task-list_wrapper"
      style={{ height: "50vh", overflowY: "auto" }}
      onScroll={handleScroll}
    >
      <ul>
        {tasks.map((task) => {
          return <TaskItem key={task.id} {...task} />;
        })}
      </ul>

      {isFetching && <div>Loading more tasks...</div>}
    </div>
  );
};

export default TaskList;
