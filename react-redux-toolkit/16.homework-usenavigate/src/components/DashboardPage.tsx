import { useLocation } from "react-router";

function DashboardPage() {
  const location = useLocation();
  const { message, user } = location.state ?? {};

  return (
    <>
      <h1>Welcome to Dashboard!</h1>
      {user && <h2>Hello, {user}!</h2>}
      {message && <p>{message}</p>}
    </>
  );
}

export default DashboardPage;
