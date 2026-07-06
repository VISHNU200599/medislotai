// src/router/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="spinner spinner-dark" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to the correct dashboard
    const dashMap = { PATIENT: "/patient/dashboard", DOCTOR: "/doctor/dashboard", HOSPITAL_ADMIN: "/admin/dashboard" };
    return <Navigate to={dashMap[user?.role] || "/"} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  if (isLoading) return null;
  
  if (isAuthenticated) {
    const dashMap = { PATIENT: "/patient/dashboard", DOCTOR: "/doctor/dashboard", HOSPITAL_ADMIN: "/admin/dashboard" };
    return <Navigate to={dashMap[user?.role] || "/"} replace />;
  }
  
  return children;
};
