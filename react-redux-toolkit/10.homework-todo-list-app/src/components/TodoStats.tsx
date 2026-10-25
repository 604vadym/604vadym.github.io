import { type Todo } from "../types/interfaces";

interface TodoStatsProps {
  todos: Todo[];
}

function TodoStats({ todos }: TodoStatsProps) {
  return (
    <div>
      {todos.filter((todo) => !todo.completed).length} active / {todos.length}{" "}
      total
    </div>
  );
}

export default TodoStats;
