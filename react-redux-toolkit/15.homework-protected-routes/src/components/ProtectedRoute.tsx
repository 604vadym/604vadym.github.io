import { Navigate } from "react-router";

interface ProtectedRouteProps {
  isAuth: boolean;
  children: React.ReactNode;
}

function ProtectedRoute({ isAuth, children }: ProtectedRouteProps) {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
