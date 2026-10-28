import { createContext } from "react";
import { type theme } from "../types/types";

export const ThemeContext = createContext<theme>("light");
