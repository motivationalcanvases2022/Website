import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import BookingPage from "./BookingPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/dashboard/login" element={<LoginPage />} />
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