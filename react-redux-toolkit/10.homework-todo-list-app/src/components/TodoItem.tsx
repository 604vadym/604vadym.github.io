import { type Todo } from "../types/interfaces";

interface TodoItemtProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemtProps) {
  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        className="todo-checkbox"
        onChange={() => onToggle(todo.id)}
      />
      <span className="todo-text">{todo.text}</span>
      <button className="delete-button" onClick={() => onDelete(todo.id)}>
        ✕
      </button>
    </div>
  );
}

export default TodoItem;
