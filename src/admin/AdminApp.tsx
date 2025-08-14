// src/admin/AdminApp.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./AdminLayout"; // optional shell, or use AdminDashboard directly
import AdminDashboard from "./pages/AdminOverview";
import Departments from "./pages/Departments";
import Staff from "./pages/Staff";
import QuickReplies from "./pages/QuickReplies";
import QrLinks from "./pages/QrLinks";
import Settings from "./pages/Settings";
import Hotels from "./pages/hotels";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,     
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "departments", element: <Departments /> },
      { path: "staff", element: <Staff /> },
      { path: "quick-replies", element: <QuickReplies /> },
      { path: "qr-links", element: <QrLinks /> },
      { path: "settings", element: <Settings /> },
      { path: "hotels", element: <Hotels /> },
    ],
  },
]);

export default function AdminApp() {
  return <RouterProvider router={router} />;
}
