// src/middleware/AuthMiddleware.ts
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";

@Service() // <-- REQUIRED for typedi to register
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): any {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
      // TODO: verify JWT or session here
      console.log("AuthMiddleware token:", token);
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized", error });
    }
  }
}
