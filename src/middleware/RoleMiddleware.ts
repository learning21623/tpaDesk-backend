import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";

export const RoleMiddleware = (allowedRoles: string[]) => {
  @Service()
  class _RoleMiddleware implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next: NextFunction) {
      const user = (req as any).user;
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    }
  }

  // Return the class instance (routing-controllers expects a class)
  return _RoleMiddleware;
};
