import React, { useState } from "react";

function ControlledForm() {
  const [inputValue, setInputValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!inputValue) return;
    alert("You entered next numbers: " + inputValue);
    alert("Checkbox: " + (checkboxValue ? "checked" : "not checked"));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { type, value, checked } = e.target;

    if (type === "text") {
      if (!Number.isFinite(Number(value))) return;
      setInputValue(value);
    } else if (type === "checkbox") {
      setCheckboxValue(checked);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message">
        Numbers{" "}
        <input
          type="text"
          placeholder="Only numbers allowed"
          id="message"
          value={inputValue}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Submit</button>

      <label htmlFor="checkbox">
        <input
          type="checkbox"
          id="checkbox"
          checked={checkboxValue}
          onChange={handleChange}
        />
      </label>
    </form>
  );
}

export default ControlledForm;
