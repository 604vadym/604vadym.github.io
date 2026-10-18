import React from "react";

interface StatelessComponentProps {
  text: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}

function StatelessComponent({ text, handleClick }: StatelessComponentProps) {
  return <button onClick={handleClick}>{text}</button>;
}

export default StatelessComponent;
