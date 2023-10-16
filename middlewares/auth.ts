import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";

// Secret key for JWT token verification. Keep this key secret.
const secretKey = process.env.SECRET_KEY as string;

// Custom middleware to require authentication for protected routes.
export default async function auth(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) {
    // Check if the user is authenticated
    const token: string | undefined = req.headers.authorization?.substring(7);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized." });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
        // Verify and decode the JWT token. If it's not valid, this will throw an exception.
        const user = await userRepository.findOneBy({ access_token: token });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        // If the token is valid, you can attach user data to the request for use in protected routes.
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized." });
    }
}
