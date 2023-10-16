import { Request, Response, NextFunction } from "express";

// Custom middleware to allow access to unauthenticated users for specific routes.
export default function guest(req: Request, res: Response, next: NextFunction) {
    // Check if the user is unauthenticated
    const token = req.headers.authorization;

    if (token) {
        return res
            .status(403)
            .json({ message: "Access forbidden for authenticated users" });
    }

    // If the user is unauthenticated, continue with the request.
    next();
}
