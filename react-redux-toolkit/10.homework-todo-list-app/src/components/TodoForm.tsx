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
    setError("");
    onAddTodo(inputValue);
    setInputValue("");
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="input">
      <input
        type="text"
        value={inputValue}
        placeholder="What should be done?"
        onChange={handleChangeInput}
      />
      <button type="submit" className="btn btn-default btn-sm">
        Add
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default TodoForm;
