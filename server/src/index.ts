import dotenv from "dotenv";
import App from "./app";
import UsersController from "./controllers/users.controller";

dotenv.config();

const port = process.env.PORT || 5000;
const app = new App([new UsersController()], port);

app.listen();
