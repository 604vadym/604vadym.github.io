import { useState } from "react";
import { type Filter } from "../types/types";

interface TodoFiltersProps {
  onSelect: (filter: Filter) => void;
}

function TodoFilters({ onSelect }: TodoFiltersProps) {
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);
  const [isActiveSelected, setIsActiveSelected] = useState<boolean>(false);
  const [isCompletedSelected, setIsCompletedSelected] =
    useState<boolean>(false);

  const handleClickAll = () => {
    setIsAllSelected(true);
    setIsActiveSelected(false);
    setIsCompletedSelected(false);
    onSelect("all");
  };

  const handleClickActive = () => {
    setIsActiveSelected(true);
    setIsAllSelected(false);
    setIsCompletedSelected(false);
    onSelect("active");
  };

  const handleClickCompleted = () => {
    setIsCompletedSelected(true);
    setIsAllSelected(false);
    setIsActiveSelected(false);
    onSelect("completed");
  };

  return (
    <div className="filter-container">
      <div className="filter-buttons ">
        <button
          type="button"
          className="btn filter-btn"
          disabled={isAllSelected}
          onClick={handleClickAll}
        >
          All
        </button>
        <button
          type="button"
          className="btn filter-btn"
          disabled={isActiveSelected}
          onClick={handleClickActive}
        >
          Active
        </button>
        <button
          type="button"
          className="btn filter-btn"
          disabled={isCompletedSelected}
          onClick={handleClickCompleted}
        >
          Completed
        </button>
      </div>
    </div>
  );
}

export default TodoFilters;
