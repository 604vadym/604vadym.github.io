import { useAppDispatch } from "../redux/hooks";
import { toggleTheme } from "../redux/slices/themeSlice";

function ThemeToggler() {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      style={{ position: "absolute" }}
    >
      Toggle theme
    </button>
  );
}

export default ThemeToggler;
