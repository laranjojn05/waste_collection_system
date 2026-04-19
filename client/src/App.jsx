import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Report from "./pages/Report";
import MyReports from "./pages/MyReports";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import OperatorRoute from "./components/OperatorRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageReports from "./pages/ManageReports";
import ManageSchedules from "./pages/ManageSchedules";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/announcements"
          element={
            <AdminRoute>
              <ManageAnnouncements />
            </AdminRoute>
          }
        />

        <Route
          path="/operator/schedules"
          element={
            <OperatorRoute>
              <ManageSchedules />
            </OperatorRoute>
          }
        />

        <Route
          path="/operator/reports"
          element={
            <OperatorRoute>
              <ManageReports />
            </OperatorRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;