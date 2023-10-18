import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";

// Custom middleware to allow access to unauthenticated users for specific routes.
export default async function guest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Check if the user is unauthenticated
    const token = req.headers.authorization;
    const userRepository = AppDataSource.getRepository(User);

    if (!token) {
        return next();
    }

    const user = await userRepository.findOneBy({
        access_token: token,
    });

    if (!user) {
        return next();
    }

    // If the user is unauthenticated, continue with the request.
    return res
        .status(403)
        .json({ message: "Access forbidden for authenticated users" });
}
