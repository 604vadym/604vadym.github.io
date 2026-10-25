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
      setError("Task description can't be empty");
      return;
    }

    onAddTodo(inputValue);
    setInputValue("");
    setError("");
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={inputValue}
        placeholder="What should be done?"
        onChange={handleChangeInput}
      />
      <button type="submit" className="btn btn-default">
        Add
      </button>
      {
        <p className="error-message">
          {error || "\u00A0"}{" "}
          {error && (
            <button className="btn" onClick={() => setError("")}>
              ✕
            </button>
          )}
        </p>
      }
    </form>
  );
}

export default TodoForm;
