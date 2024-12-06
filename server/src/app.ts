import express from "express";
import { BaseController } from "./controllers/abstractions/base-controller";
import errorMiddleware from "./middlewares/error.middleware";
import { notFoundRoute } from "./middlewares/route.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";
import { colorText } from "./utils/constant";
import { corsOptions } from "./config/corsOptions";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { prisma } from "./providers/prisma.client";
import { systemProvider } from "./providers/system.provider";

class App {
  public app: express.Application;
  public port: number | string;

  constructor(controllers: BaseController[], port: number | string) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: BaseController[]) {
    this.app.get("/", (request, response) => {
      response.send("Application is running");
    });
    controllers.forEach((controller) => {
      // throw new Error("Method not implemented.");
      this.app.use("/api", [authMiddleware.isAuthorized], controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
    this.app.use(notFoundRoute);
  }

  public listen() {
    this.app.listen(this.port, async () => {
      const settings = systemProvider.getConfig();
      cron.schedule(settings.DATE_TO_UPDATE, async () => {
        try {
          // add value of default balance to balance column of all users
          await prisma.$executeRaw`
          Update "User" 
          Set "balance" = "balance" + ${settings.DEFAULT_BALANCE}`;
          console.log(settings);
        } catch (error) {
          console.error("[CRON] Error:", error);
        }
      });
      console.log(colorText, `[LISTENING]: http://localhost:${this.port}`);
    });
  }
}

export default App;
