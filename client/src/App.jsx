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
import ManageReports from "./pages/operator/ManageReports";
import ManageUserReports from "./pages/admin/ManageUserReports";
import ManageSchedules from "./pages/operator/ManageSchedules";
import ManageUsers from "./pages/admin/ManageUsers";
import ReportUser from "./pages/operator/ReportUser";
import ManageAnnouncements from "./pages/operator/ManageAnnouncements";
import UserRoute from "./components/UserRoute";

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
          path="/admin/user-reports"
          element={
            <AdminRoute>
              <ManageUserReports />
            </AdminRoute>
          }
        />

        <Route
          path="/operator/announcements"
          element={
            <OperatorRoute>
              <ManageAnnouncements />
            </OperatorRoute>
          }
        />
        
        <Route
          path="/admin/user-reports"
          element={
            <AdminRoute>
              <ManageUserReports />
            </AdminRoute>
          }
        />
        <Route
          path="/operator/report-user"
          element={
            <OperatorRoute>
              <ReportUser />
            </OperatorRoute>
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
            <UserRoute>
              <Report />
            </UserRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <UserRoute>
              <MyReports />
            </UserRoute>
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