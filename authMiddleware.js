const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

const protect = (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token (uses the same secret the auth controller signs with)
      const decoded = jwt.verify(token, JWT_SECRET);

      // Save user ID + role on the request
      req.user = decoded.id;
      req.userRole = decoded.role || "candidate";

      next();
    } catch (error) {
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

// Restricts a route to a specific role (e.g. requireRole("hr")).
// Use after `protect` so req.userRole is already set.
const requireRole = (role) => (req, res, next) => {
  if (req.userRole !== role) {
    return res.status(403).json({
      message: `Not authorized. This action requires an ${role.toUpperCase()} account.`,
    });
  }
  next();
};

module.exports = { protect, requireRole };
