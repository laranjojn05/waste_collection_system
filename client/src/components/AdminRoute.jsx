import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  return userInfo.role === "admin" ? children : <Navigate to="/home" />;
};

export default AdminRoute;