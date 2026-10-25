import { type Todo } from "../types/interfaces";

interface TodoItemtProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemtProps) {
  return (
    <div
      className={`todo-item ${todo.completed ? "todo-item--completed" : ""}`}
    >
      {todo.completed ? (
        <span>✅</span>
      ) : (
        <input type="checkbox" onChange={() => onToggle(todo.id)} />
      )}

      <span
        className={`todo-text ${todo.completed ? "todo-text--completed" : ""}`}
      >
        {todo.text}
      </span>

      <button className="btn btn-destructive" onClick={() => onDelete(todo.id)}>
        ✕
      </button>
    </div>
  );
}

export default TodoItem;
