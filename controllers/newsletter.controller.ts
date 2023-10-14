import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Email } from "../models/Email";

export default {
    /**
     * Endpoint register an email to the newsletter
     *
     * @param req Request
     * @param res Response
     * @return Response
     */
    subscribe: async (req: Request, res: Response) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const isEmailValid = regex.test(req.body.email);

        // Check if the email is valid
        if (!req.body.email || !isEmailValid) {
            return res.status(422).json({
                message: "Invalid email",
            });
        }

        const repository = AppDataSource.getRepository(Email);

        try {
            const findEmail = await repository.findOneBy({
                email: req.body.email,
            });

            // Check if the email is already subscribed
            if (findEmail) {
                return res.json({
                    message: "You are successfully subscribed",
                });
            }

            // Subscribe
            const email = new Email();
            email.email = req.body.email;
            await repository.save(email);

            return res.json({
                message: "You are successfully subscribed",
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
};
