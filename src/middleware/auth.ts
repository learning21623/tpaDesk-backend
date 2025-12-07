// src/middleware/AuthMiddleware.ts
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request & { user?: any }, res: Response, next: NextFunction): any {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ message: "No Authorization header" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Missing token" });
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token", error });
    }
  }
}
