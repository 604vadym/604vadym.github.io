import React from "react";

interface InputProps extends React.ComponentProps<"input"> {
  placeholder: string;
}

function Input({ placeholder, type }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={(e) => {
        console.clear();
        console.log(`You entered into input: ${e.target.value}`);
      }}
    ></input>
  );
}

export default Input;
