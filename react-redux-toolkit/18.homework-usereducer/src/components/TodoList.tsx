import React, { useReducer, useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
}

type TodoAction =
  | { type: "ADD_TODO"; payload: { text: string } }
  | { type: "TOGGLE_TODO"; payload: { id: number } }
  | { type: "DELETE_TODO"; payload: { id: number } };

const initialState: TodosState = {
  todos: [
    { id: 1, text: "Learn useReducer", completed: true },
    { id: 2, text: "Implement reducer", completed: false },
  ],
};

function todoReducer(state: TodosState, action: TodoAction): TodosState {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload.text,
            completed: false,
          },
        ],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    default:
      return state;
  }
}

function TodoList() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    dispatch({ type: "ADD_TODO", payload: { text: inputText } });
    setInputText("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Add todo</button>
      </form>
      <ul>
        {state.todos.map((todo) => (
          <li key={todo.id}>
            <label>
              {todo.text}{" "}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  dispatch({ type: "TOGGLE_TODO", payload: { id: todo.id } })
                }
              />
            </label>

            <button
              type="button"
              onClick={() =>
                dispatch({ type: "DELETE_TODO", payload: { id: todo.id } })
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default TodoList;
