import TodoItem from "../components/TodoItem";
import { type Todo } from "../types/interfaces";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <div className="form-grid ">
      <div className="form-group">
        {todos.map((todo) => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            ></TodoItem>
          );
        })}
      </div>
    </div>
  );
}

export default TodoList;
