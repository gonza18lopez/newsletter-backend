import "reflect-metadata";

import { AppDataSource } from "./data-source";
import { Newsletter } from "./models/Newsletter";
import { sendNewsletter, transporter } from "./lib/mailer";
import { Equal } from "typeorm";
import path from "path";
import cron from "node-cron";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

dayjs.extend(utc);

const newsletterRepository = AppDataSource.getRepository(Newsletter);

console.log("Cron jobs initialized.");

cron.schedule("* * * * *", () => {
    AppDataSource.initialize()
        .then(async () => {
            const newsletters: Newsletter[] = await newsletterRepository.find({
                where: {
                    isSent: false,
                    sendAt: Equal(
                        dayjs()
                            .second(0)
                            .millisecond(0)
                            .format("YYYY-MM-DD HH:mm:ss")
                    ),
                },
                relations: {
                    recipients: true,
                    attachment: true,
                },
            });

            console.log(`Sending ${newsletters.length} newsletters`);

            newsletters.forEach(async (newsletter: Newsletter) => {
                await sendNewsletter(newsletter);

                newsletter.isSent = true;
                await newsletterRepository.save(newsletter);
            });

            console.log(`Sent ${newsletters.length} newsletters`);
        })
        .catch((error) => console.log(error));
});
