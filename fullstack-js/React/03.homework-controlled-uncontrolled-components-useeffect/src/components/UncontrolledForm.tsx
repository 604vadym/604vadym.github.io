import React, { useRef } from "react";

function UncontrolledForm() {
  const msgRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmedValue = msgRef.current?.value.trim() || "";
    if (!trimmedValue) return;
    alert("Your message: " + trimmedValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Message <input ref={msgRef} type="text" name="message" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;
