
const adminOnly = (req, res, next) => {
  try {
    
    if (req.user !== "admin" || req.userRole !== "admin") {
      console.log("Access denied.");

      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    next();

  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Admin authorization failed.",
      error: error.message,
    });
  }
};

module.exports = {
  adminOnly,
};