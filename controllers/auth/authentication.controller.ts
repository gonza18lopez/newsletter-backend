import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { AppDataSource } from "../../data-source";
import { User } from "../../models/User";

const userRepository = AppDataSource.getRepository(User);

export const authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(422)
            .json({ message: "Email and password are required" });
    }

    // check if user exists
    const user = await userRepository.findOneBy({ email });

    if (!user) {
        return res.status(400).json({ message: "User not exists" });
    }

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    // refresh access token
    user.generateAccessToken();
    await userRepository.save(user);

    return res.json({ token: user.access_token });
};
