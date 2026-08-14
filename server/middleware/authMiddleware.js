const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

const protect = (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      // Store authenticated user's ID
      req.user = decoded.id;

      // Store authenticated user's role
      req.userRole = decoded.role || "candidate";

      // Optional: keep complete decoded token
      req.auth = decoded;

      next();
    } catch (error) {
      console.error("JWT Error:", error.message);

      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};


// ==========================================
// ROLE PROTECTION
// ==========================================

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `Not authorized. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};


module.exports = {
  protect,
  requireRole,
};