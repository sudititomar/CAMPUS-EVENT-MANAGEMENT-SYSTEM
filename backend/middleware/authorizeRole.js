// middleware/authorizeRole.js

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by your existing JWT auth middleware
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    next();
  };
};

module.exports = authorizeRole;