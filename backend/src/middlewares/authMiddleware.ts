import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: JwtPayload & { id: string; isAdmin?: boolean };
}

const isAuthenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authorization token must be provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Logging decoded token for debugging
    console.log("Decoded JWT:", decoded);

    req.user = decoded as JwtPayload & { id: string; isAdmin?: boolean };

    // Check if the user ID is present
    if (!req.user.id) {
      return res
        .status(403)
        .json({ message: "Token does not contain user ID" });
    }

    next();
  });
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
