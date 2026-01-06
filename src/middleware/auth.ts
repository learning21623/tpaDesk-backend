import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request & { user?: any }, res: Response, next: NextFunction): any {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No or invalid Authorization header" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as any;

      // ✅ IMPORTANT FIX
      req.user = decoded;

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
}
