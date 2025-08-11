import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StaffLogin from "./routes/StaffLogin";
import StaffDashboard from "./routes/StaffDashboard";
import GuestQR from "./routes/GuestQR";
import ProtectedRoute from "./components/ProtectedRoute";
import HotelPicker from "./routes/HotelPicker";

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
        <Route
          path="/hotels/:hotelId/conversations/:convId"
          element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>}
        />
        <Route path="/guest/:slug" element={<GuestQR />} />
        <Route path="*" element={<Navigate to="/hotels/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
