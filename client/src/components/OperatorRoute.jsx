import { Navigate } from "react-router-dom";

const OperatorRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  return userInfo.role === "operator" ? children : <Navigate to="/home" />;
};

export default OperatorRoute;