import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: JwtPayload & { isAdmin?: boolean };
}

const isAuthenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = decoded as JwtPayload;
      next();
    });
  } else {
    res.status(401).json({ message: "Authorization token must be provided" });
  }
};

// Middleware to verify if the user is an admin
const isAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admin only area" });
  }
};

export { isAuthenticated, isAdmin };
