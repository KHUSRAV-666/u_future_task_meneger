import React, { useEffect, useState } from "react";
import { FiltersProps } from "../pages/task_list";

interface TaskFiltersProps {
  sortOptions: string[];
  statusOptions: string[];
  priorityOptions: string[];
  setFilters: (value: FiltersProps) => void;
}

const TaskListFilters: React.FC<TaskFiltersProps> = ({
  sortOptions,
  statusOptions,
  priorityOptions,
  setFilters,
}) => {
  const [sortOrder, setSortOrder] = useState<string>("По названию");
  const [filterStatus, setFilterStatus] = useState<string>("Все");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    "Все",
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
      const { sortOrder, filterStatus, selectedPriorities } =
        JSON.parse(savedFilters);
      setSortOrder(sortOrder || "По названию");
      setFilterStatus(filterStatus || "Все");
      setSelectedPriorities(selectedPriorities || ["Все"]);
    }
  }, []);

  useEffect(() => {
    const filters = {
      sortOrder,
      filterStatus,
      selectedPriorities,
    };
    setFilters({
      sort: sortOrder,
      status: filterStatus,
      priority: selectedPriorities,
    });
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [sortOrder, filterStatus, selectedPriorities]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePriorityFilter = (priority: string) => {
    if (priority === "Все") {
      setSelectedPriorities(
        selectedPriorities.includes("Все")
          ? []
          : priorityOptions.filter((p) => p !== "Все")
      );
    } else {
      setSelectedPriorities((prev) => {
        const updated = prev.includes(priority)
          ? prev.filter((p) => p !== priority)
          : [...prev, priority];

        if (updated.length === priorityOptions.length - 1) {
          return [...updated, "Все"];
        }

        return updated.filter((p) => p !== "Все");
      });
    }
  };

  return (
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
          <span onClick={toggleDropdown}>Фильтрация по приоритету</span>
          <div className={`priority-filters_popup ${isDropdownOpen && "show"}`}>
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
  );
};

export default TaskListFilters;
