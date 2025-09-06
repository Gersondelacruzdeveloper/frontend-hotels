import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StaffLogin from "./routes/StaffLogin";
import StaffDashboard from "./routes/StaffDashboard";
import GuestQR from "./routes/GuestQR";
import ProtectedRoute from "./components/ProtectedRoute";
import HotelPicker from "./routes/HotelPicker";
import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/pages/AdminOverview";
import Hotels from "./admin/pages/hotels";
import Departments from "./admin/pages/Departments";
import Staff from "./admin/pages/Staff";
import QuickReplies from "./admin/pages/QuickReplies";
import QrLinks from "./admin/pages/QrLinks";
import Settings from "./admin/pages/Settings";
import AdminSignup from "./admin/pages/AdminSignup";
import SetPassword from "./routes/SetPassword";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hotels/login" element={<StaffLogin />} />
        {/* If you have a single hotel first, redirect /hotels -> /hotels/<hotelId> */}
        <Route path="/hotels" element={<ProtectedRoute><HotelPicker/></ProtectedRoute>} />
        <Route
          path="/hotels/:hotelId"
          element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>}
        />
        <Route path="/admin/dashboard" element={<AdminOverview />} />

        <Route
          path="/hotels/:hotelId/conversations/:convId"
          element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>}
        />
        <Route path="/guest/:slug" element={<GuestQR />} />
        <Route path="signup" element={<AdminSignup />} />
        <Route path="/set-password/:uid/:token" element={<SetPassword />} />
        {/* Admin (layout + children) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="departments" element={<Departments />} />
          <Route path="staff" element={<Staff />} />
          <Route path="quick-replies" element={<QuickReplies />} />
          <Route path="qr-links" element={<QrLinks />} />
          <Route path="settings" element={<Settings />} />
        </Route>

       {/* Fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
