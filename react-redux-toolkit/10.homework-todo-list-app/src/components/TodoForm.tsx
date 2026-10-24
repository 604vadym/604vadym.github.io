import React, { useState } from "react";

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

function TodoForm({ onAddTodo }: TodoFormProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue === "") {
      setError("Enter task in input to add it to list");
      return;
    }
    onAddTodo(inputValue);
    setInputValue("");
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  if (error !== "") {
    alert(error);
    setError("");
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        placeholder="What should be done?"
        className="todo-input"
        onChange={handleChangeInput}
      />
      <button type="submit" className="add-button">
        Add
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default TodoForm;
