import { useState, useRef } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoFilters from "./components/TodoFilters";
import TodoStats from "./components/TodoStats";
import EmptyState from "./components/EmptyState";
import { type Todo } from "./types/interfaces";
import { type Filter } from "./types/types";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const counterRef = useRef<number>(0);

  const addTodo = (text: string): void => {
    counterRef.current += 1;
    setTodos([
      ...todos,
      {
        id: counterRef.current,
        text,
        completed: false,
      },
    ]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const getFilteredTodos = (): Todo[] => {
    if (filter === "all") return todos;

    return filter === "completed"
      ? todos.filter((todos) => todos.completed)
      : todos.filter((todos) => !todos.completed);
  };

  const filteredTodos = getFilteredTodos();

  const selectFilter = (selectedFilter: Filter) => {
    setFilter(selectedFilter);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">📝 My Todo List</h1>
        </div>
      </div>

      <TodoForm onAddTodo={addTodo} />

      {todos.length > 0 ? (
        <>
          <TodoFilters activeFilter={filter} onSelect={selectFilter} />
          <TodoStats todos={todos} />
          <TodoList
            todos={filter === "all" ? todos : filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </>
      ) : (
        <EmptyState />
      )}

      {todos.some((todo) => todo.completed) && filter !== "active" && (
        <button
          type="button"
          className={`btn btn-destructive`}
          onClick={clearCompleted}
        >
          Remove all completed tasks
        </button>
      )}
    </div>
  );
}

export default App;
