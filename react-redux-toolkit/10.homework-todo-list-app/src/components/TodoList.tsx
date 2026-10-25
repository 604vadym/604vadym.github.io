import TodoItem from "../components/TodoItem";
import { type Todo } from "../types/interfaces";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <ul>
          {todos.map((todo) => {
            return (
              <li key={todo.id}>
                <TodoItem
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                ></TodoItem>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
