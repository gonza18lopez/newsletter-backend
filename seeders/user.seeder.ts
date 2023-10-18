import * as bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";

AppDataSource.initialize()
    .then(async () => {
        const user = new User();

        user.name = "Admin";
        user.email = "admin@example.com";
        user.password = await bcrypt.hash("password", 10);
        user.generateAccessToken();

        await AppDataSource.manager.save(user);
    })
    .catch((error) => console.log(error))
    .finally(() => AppDataSource.destroy());
