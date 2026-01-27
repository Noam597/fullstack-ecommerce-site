import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContexts";
import LoadingSpinner from "../components/loading-spinner/LoadingSpinner";
export default function AdminProtectedRoutes() {
  const { user, loadingUser } = useUser();

  if(loadingUser) return <LoadingSpinner/>;


  if (!user) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") {
    return <Navigate to="/home" replace />; 
  }

  return <Outlet />;
}