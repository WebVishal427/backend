import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { env } from "./environments/Env";
import Routes from "./routes/Routes";
import { NextFunction } from "express";
import path from "path";
import { ReqInterface, ResInterface } from "./interfaces/RequestInterface";

const cookieParser = require("cookie-parser");

class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigurations();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  private setConfigurations() {
    this.enableCors();
    this.configBodyParser();
    this.connectDatabase();
  }

  private enableCors() {
    this.app.use(
      cors({
        origin: true,
        credentials: true,
      })
    );
  }

  private configBodyParser() {
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(cookieParser());
  }


  private async connectDatabase() {
    try {
      await mongoose.connect(env?.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }

  private setRoutes() {
    this.app.use(
      (req: ReqInterface, res: ResInterface, next: express.NextFunction) => {
        res.startTime = new Date().getTime();
        console.log(`API URL => ${req.url} (${req.method})`);
        console.log("Request Body:", req.body);
        next();
      }
    );

    this.app.use("/api-doc", express.static(path.resolve(process.cwd(), "apidoc")));
    this.app.use("/img", express.static(path.resolve(process.cwd(), "assets/images")));
    this.app.use("/api", Routes);
  }

  private error404Handler() {
    this.app.use((_req, res) => {
      res.status(404).json({
        message: "Route not found",
        status: 404,
      });
    });
  }

  private handleErrors() {
    this.app.use((error: any, _req: ReqInterface, res: ResInterface, _next: NextFunction) => {
      const errorStatus = error.status || 500;
      res.status(errorStatus).json({
        message: error.message || "Something went wrong!",
        status: error.statusText || "ERROR",
        data: {},
      });
    });
  }
}

const server = new Server();
export default server.app;
