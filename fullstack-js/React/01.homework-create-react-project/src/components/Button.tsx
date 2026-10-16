import React from "react";

interface ButtonProps extends React.ComponentProps<"button"> {
  text: string;
}

function Button({ text, type }: ButtonProps) {
  return (
    <button type={type} onClick={() => alert("Button clicked!")}>
      {text}
    </button>
  );
}

export default Button;
