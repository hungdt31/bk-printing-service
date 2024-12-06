import dotenv from "dotenv";
import App from "./app";
import UsersController from "./controllers/users.controller";
import PrintersController from "./controllers/printers.controller";
import DocumentsController from "./controllers/documents.controller";
import PurchaseOrdersController from "./controllers/purchaseOrders.controller";
import PrintOrdersController from "./controllers/printOrders.controller";
import ConfigController from "./controllers/config.controller";
import StatisticController from "./controllers/statistic.controller";
import ReportsController from "./controllers/reports.controller";

dotenv.config();

const port = process.env.PORT || 5000;
const app = new App([
  new UsersController(),
  new PrintersController(),
  new DocumentsController(),
  new PurchaseOrdersController(),
  new PrintOrdersController(),
  new ConfigController(),
  new StatisticController(),
  new ReportsController(),
], port);

app.listen();
