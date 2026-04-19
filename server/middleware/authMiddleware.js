import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.status === "suspended") {
        return res
          .status(403)
          .json({ message: "Your account is suspended. Please contact admin." });
      }

      if (user.status === "banned") {
        return res
          .status(403)
          .json({ message: "Your account is banned. Please contact admin." });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;