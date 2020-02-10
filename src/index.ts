import env from "dotenv";
env.config();

import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import { json, urlencoded } from "body-parser";
import { createConnection } from "typeorm";
import Routes from "./routes";

(async () => {
  // App Instance
  const app = express();

  // App Middlewares
  app.use(morgan("dev"));
  app.use(json());
  app.use(urlencoded({ extended: false }));

  // Db Connection
  await createConnection()
    .then(() => console.log("Database Successful Connected!!"))
    .catch(err => console.log("Bad Connection", err));

  // App Routes
  app.use(Routes);

  // Server Start
  app.listen(process.env.PORT, () => console.log("Server Running!"));
})();
