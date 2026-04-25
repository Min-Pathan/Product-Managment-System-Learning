import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ msg: "No token provided" });
    }

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admin only" });
  }

  next();
};

export { authMiddleware, adminMiddleware };