import { Request, Response } from "express";

import { User } from "../../models/User";

export const currentUser = async (req: Request & { user: User }, res: Response) => {
    return res.json(req.user);
};
