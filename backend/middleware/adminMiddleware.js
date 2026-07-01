// Runs after `protect`, so req.user is already set.
// Only allows the request through if the authenticated user has role "admin".
function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

module.exports = { adminOnly };
