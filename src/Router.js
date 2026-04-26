import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import BookingPage from "./BookingPage";
import PrivacyPage from "./components/PrivacyPage";
import CookiesPage from "./components/CookiesPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
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