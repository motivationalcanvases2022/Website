import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publik hemsida */}
        <Route path="/" element={<App />} />

        {/* Login */}
        <Route path="/dashboard/login" element={<LoginPage />} />

        {/* Skyddad dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}