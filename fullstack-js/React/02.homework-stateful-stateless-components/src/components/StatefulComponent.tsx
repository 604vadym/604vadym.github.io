import { useState } from "react";

const Color = {
  red: "red",
  green: "green",
  blue: "blue",
} as const;

type ColorType = (typeof Color)[keyof typeof Color];

function StatefulComponent() {
  const [colorBtn, setColorBtn] = useState<ColorType>(Color.red);

  const handleClick = (): void => {
    setColorBtn((currentColor) => {
      if (currentColor === Color.red) return Color.green;
      if (currentColor === Color.green) return Color.blue;
      return Color.red;
    });
  };

  return (
    <button
      style={{ background: colorBtn, color: "white", width: "100px" }}
      onClick={handleClick}
    >
      I am {colorBtn}
    </button>
  );
}

export default StatefulComponent;
