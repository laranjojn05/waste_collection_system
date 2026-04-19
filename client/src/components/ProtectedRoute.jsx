import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  if (
    userInfo.status === "suspended" ||
    userInfo.status === "banned"
  ) {
    localStorage.removeItem("userInfo");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;