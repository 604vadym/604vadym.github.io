import React, { useRef } from "react";

function UncontrolledForm() {
  const msgRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!msgRef.current?.value) return;
    alert("Your message: " + msgRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Message <input ref={msgRef} type="text" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;
