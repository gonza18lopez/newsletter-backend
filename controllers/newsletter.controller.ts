import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Recipient } from "../models/Recipient";
import { Newsletter } from "../models/Newsletter";
import { Attachment } from "../models/Attachment";
import { In } from "typeorm";
import { transporter } from "../lib/mailer";
import path from "path";
import { User } from "../models/User";

const recipientRepository = AppDataSource.getRepository(Recipient);
const newsletterRepository = AppDataSource.getRepository(Newsletter);

/**
 * Get all newsletters
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export async function index(req: Request, res: Response) {
    const newsletters: Newsletter[] = await newsletterRepository.find({
        relations: {
            recipients: true,
            attachment: false,
        },
    });

    return res.json(newsletters);
}

/**
 * Endpoint to store a newsletter in database
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export async function store(req: Request, res: Response) {
    try {
        const recipients: Recipient[] = await recipientRepository.find({
            where: {
                id: In(req.body.recipients),
            },
        });

        await AppDataSource.manager.transaction(
            async (transactionalEntityManager) => {
                const attachment = new Attachment();
                attachment.path = req.file?.path as string;

                const newsletter = new Newsletter();
                newsletter.name = req.body.name;
                newsletter.body = req.body.body;
                newsletter.attachment = attachment;
                newsletter.recipients = recipients;
                newsletter.sendAt = new Date(req.body.sendAt);

                await transactionalEntityManager.save(attachment);
                await transactionalEntityManager.save(newsletter);
            }
        );

        return res.json({
            message: "Newsletter created successfully",
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Endpoint to send a newsletter
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export async function send(req: Request & { user: User }, res: Response) {
    const newsletter: Newsletter | null = await newsletterRepository.findOne({
        where: {
            id: req.params.id as any,
        },
        relations: {
            recipients: true,
            attachment: true,
        },
    });

    if (!newsletter) {
        return res.status(404).json({
            message: "Newsletter not found",
        });
    }

    await transporter.sendMail({
        from: req.user.email,
        to: newsletter.recipients.map((recipient) => recipient.email),
        subject: newsletter.name,
        html: newsletter.body,
        attachments: [
            {
                filename: path.basename(newsletter.attachment.path),
                path: `${__dirname}/../${newsletter.attachment.path}`,
            },
        ],
    });

    newsletter.isSent = true;
    await newsletterRepository.save(newsletter);

    return res.json({
        message: "Newsletter sent successfully",
    });
}

/**
 * Endpoint to delete a newsletter
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export async function destroy(req: Request, res: Response) {
    const newsletter: Newsletter | null = await newsletterRepository.findOne({
        where: {
            id: req.params.id as any,
        },
    });

    if (!newsletter) {
        return res.status(404).json({
            message: "Newsletter not found",
        });
    }

    await newsletterRepository.remove(newsletter);

    return res.json({
        message: "Newsletter deleted successfully",
    });
}

/**
 * Endpoint register an email to the newsletter
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export async function subscribe(req: Request, res: Response) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const isEmailValid = regex.test(req.body.email);

    // Check if the email is valid
    if (!req.body.email || !isEmailValid) {
        return res.status(422).json({
            message: "Invalid email",
        });
    }

    try {
        const findEmail = await recipientRepository.findOneBy({
            email: req.body.email,
        });

        // Check if the email is already subscribed
        if (findEmail) {
            return res.json({
                message: "You are successfully subscribed",
            });
        }

        // Subscribe
        const recipient = new Recipient();
        recipient.email = req.body.email;
        await recipientRepository.save(recipient);

        return res.json({
            message: "You are successfully subscribed",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

/**
 * Endpoint to get all recipients
 *
 * @param req Request
 * @param res Response
 * @return Response
 */
export async function recipients(req: Request, res: Response) {
    const recipients: Recipient[] = await recipientRepository.find();

    return res.json(recipients);
}
