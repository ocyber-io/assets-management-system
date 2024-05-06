import jwt from "jsonwebtoken";

// Middleware to verify if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer TOKEN_VALUE
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user; // Append user data to request object
      next();
    });
  } else {
    res.status(401).json({ message: "Authorization token must be provided" });
  }
};

// Middleware to verify if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admin only area" });
  }
};

export { isAuthenticated, isAdmin };
