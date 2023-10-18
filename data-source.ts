import "reflect-metadata"
import { DataSource } from "typeorm"
import { Attachment } from "./models/Attachment"
import { Newsletter } from "./models/Newsletter"
import { Recipient } from "./models/Recipient"
import { User } from "./models/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: process.env.DB_PORT as any,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        Attachment,
        Newsletter,
        Recipient,
        User
    ],
    migrations: ['./migrations/**/*.{js,ts}'],
    subscribers: ['./subscribers/**/*.{js,ts}'],
})
