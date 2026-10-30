import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";

function ThemeToggler() {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} style={{ position: "absolute" }}>
      Toggle theme
    </button>
  );
}

export default ThemeToggler;
