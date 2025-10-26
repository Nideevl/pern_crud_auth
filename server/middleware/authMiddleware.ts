import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if(!token) return res.status(401).json({ message: "Access denied: No token"});

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        (req as any).user = payload;
        next();
    } catch(err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};
