import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Recipient } from "../models/Recipient";
import { Newsletter } from "../models/Newsletter";

const recipientRepository = AppDataSource.getRepository(Recipient);
const newsletterRepository = AppDataSource.getRepository(Newsletter);

/**
 * Get all newsletters from a recipient
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export const getNewsletters = async (req: Request, res: Response) => {
    try {
        const recipient = await recipientRepository.findOneOrFail({
            where: {
                token: req.params.token,
            },
            relations: {
                newsletters: true,
            },
        });

        return res.json(recipient?.newsletters);
    } catch (error) {
        return res.status(404).json({ message: "Recipient not found" });
    }
};

/**
 * Unsubscribe from specified newsletter
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export const unsubscribe = async (req: Request, res: Response) => {
    try {
        const recipient = await recipientRepository.findOneOrFail({
            where: {
                token: req.params.token,
            },
            relations: {
                newsletters: true,
            },
        });

        recipient.newsletters = recipient.newsletters.filter((newsletter) =>
            !req.body.newsletters.includes(newsletter.id)
        );
        await recipientRepository.save(recipient);

        return res.json({ message: "Newsletter unsubscribed" });
    } catch (error) {
        return res.status(404).json({ message: "Recipient not found" });
    }
};

/**
 * Delete a recipient
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export const destroy = async (req: Request, res: Response) => {
    try {
        const recipient = await recipientRepository.findOneOrFail({
            where: {
                token: req.params.token,
            },
        });

        await recipientRepository.remove(recipient);

        return res.json({ message: "Recipient deleted" });
    } catch (error) {
        return res.status(404).json({ message: "Recipient not found" });
    }
};
