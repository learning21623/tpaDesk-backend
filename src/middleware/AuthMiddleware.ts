import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): any {
    try {
      const authHeader = req.headers.authorization || req.headers["Authorization"];
      if (!authHeader) return res.status(401).json({ message: "Unauthorized: No token provided" });

      const token = (Array.isArray(authHeader) ? authHeader[0] : authHeader).replace(/^Bearer\s+/i, "");
      const payload = verifyJwt(token);
      if (!payload) return res.status(401).json({ message: "Unauthorized: Invalid token" });

      // attach user payload to request
      (req as any).user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized", error: err?.message || err });
    }
  }
}
