import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_change_me");
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      email: user.email,
      fullName: user.name,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin || user.role === "admin",
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res
      .status(403)
      .json({ message: "Not authorized to access this route" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const isAdmin = req.user.isAdmin === true;
    
    if (!roles.includes(userRole) && !(roles.includes("admin") && isAdmin)) {
      return res.status(403).json({
        message: `User role ${userRole} is not authorized to access this route`,
      });
    }
    next();
  };
};

export const isAdmin = (req, res, next) => {
  const isAdminUser = req.user?.isAdmin === true || req.user?.role === "admin";
  if (!isAdminUser) {
    return res.status(403).json({ message: "User is not authorized as admin" });
  }
  next();
};
