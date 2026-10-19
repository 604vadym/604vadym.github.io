import React from "react";
import "./Button.css";

interface ButtonProps {
  variant?: "primary" | "secondary" | "success" | "danger" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

function Button({
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  onClick,
  children,
}: ButtonProps) {
  const className = `button ${variant} ${size}${fullWidth ? " fullWidth" : ""}`;

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
