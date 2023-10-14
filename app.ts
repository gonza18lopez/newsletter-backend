import "reflect-metadata"

import http from "http";
import express, { Request, Response } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import errorHandler from "errorhandler";
import cors from "cors";

import routes from "./routes";

const app = express();

app.set("port", process.env.SERVER_PORT || 3000);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// error handling middleware should be loaded after the loading the routes
if ("development" == app.get("env")) {
    app.use(errorHandler());
}

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Newsletter API"
    });
});

// register routes
app.use('/api', routes);

const server = http.createServer(app);

server.listen(app.get("port"), () => {
    console.log(`Server listening on port ${app.get("port")}`);
});
