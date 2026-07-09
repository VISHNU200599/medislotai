// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";
import { ProtectedRoute, PublicRoute } from "./router/ProtectedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HospitalsPage from "./pages/HospitalsPage";
import HospitalProfilePage from "./pages/HospitalProfilePage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import NotFound from "./pages/NotFound";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientProfile from "./pages/patient/PatientProfile";
import AmbulancePage from "./pages/patient/AmbulancePage";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminAmbulance from "./pages/admin/AdminAmbulance";

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: "Inter, sans-serif", fontSize: "0.875rem", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" },
          success: { iconTheme: { primary: "#10B981", secondary: "white" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "white" } },
        }}
      />
      <Routes>
        {/* ── Public ─────────────────────────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/hospitals/:slug" element={<HospitalProfilePage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />

        {/* ── Auth ────────────────────────────────────────────────────── */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* ── Patient ─────────────────────────────────────────────────── */}
        <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientAppointments /></ProtectedRoute>} />
        <Route path="/patient/book/:doctorId" element={<ProtectedRoute allowedRoles={["PATIENT"]}><BookAppointment /></ProtectedRoute>} />
        <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientProfile /></ProtectedRoute>} />
        <Route path="/patient/ambulance" element={<ProtectedRoute allowedRoles={["PATIENT"]}><AmbulancePage /></ProtectedRoute>} />

        {/* ── Doctor ──────────────────────────────────────────────────── */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorAppointments /></ProtectedRoute>} />
        <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorSchedule /></ProtectedRoute>} />

        {/* ── Hospital Admin ───────────────────────────────────────────── */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["HOSPITAL_ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={["HOSPITAL_ADMIN"]}><AdminDoctors /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={["HOSPITAL_ADMIN"]}><AdminDepartments /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={["HOSPITAL_ADMIN"]}><AdminAppointments /></ProtectedRoute>} />
        <Route path="/admin/ambulance" element={<ProtectedRoute allowedRoles={["HOSPITAL_ADMIN"]}><AdminAmbulance /></ProtectedRoute>} />

        {/* ── 404 ─────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
