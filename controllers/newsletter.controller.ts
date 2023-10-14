import { Request, Response } from "express";

export default {
    /**
     * Endpoint register an email to the newsletter
     * 
     * @param req Request
     * @param res Response
     * @return Response
     */
    join: (req: Request, res: Response) => {
        res.json({
            message: 'join!'
        });
    }
}