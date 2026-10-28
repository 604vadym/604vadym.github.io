import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeContext } from "./context/AppContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContext.Provider value="dark">
      <App />
    </ThemeContext.Provider>
  </StrictMode>,
);
