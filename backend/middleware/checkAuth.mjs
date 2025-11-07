import jwt from "jsonwebtoken";

export const checkAuth = (role) => async (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Access Denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If role is specified, enforce it
    if (role && decoded.role !== role) {
      return res.status(403).json({ message: "Access Denied" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

