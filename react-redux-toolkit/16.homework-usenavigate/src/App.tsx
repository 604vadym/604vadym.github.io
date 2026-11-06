import { BrowserRouter, Routes, Route, Link } from "react-router";
import LoginForm from "./components/LoginForm";
import DashboardPage from "./components/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Link to="/login">Login</Link>}></Route>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
