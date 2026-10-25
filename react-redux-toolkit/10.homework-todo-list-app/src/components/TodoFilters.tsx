import { type Filter } from "../types/types";

interface TodoFiltersProps {
  activeFilter: Filter;
  onSelect: (filter: Filter) => void;
}

function TodoFilters({ activeFilter, onSelect }: TodoFiltersProps) {
  return (
    <div className="filter-container">
      <div className="filter-buttons ">
        <button
          type="button"
          className={`btn filter-btn ${activeFilter === "all" ? "active" : ""}`}
          disabled={activeFilter === "all"}
          onClick={() => onSelect("all")}
        >
          All
        </button>
        <button
          type="button"
          className={`btn filter-btn ${activeFilter === "active" ? "active" : ""}`}
          disabled={activeFilter === "active"}
          onClick={() => onSelect("active")}
        >
          Active
        </button>
        <button
          type="button"
          className={`btn filter-btn ${activeFilter === "completed" ? "active" : ""}`}
          disabled={activeFilter === "completed"}
          onClick={() => onSelect("completed")}
        >
          Completed
        </button>
      </div>
    </div>
  );
}

export default TodoFilters;
