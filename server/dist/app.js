"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const route_middleware_1 = require("./middlewares/route.middleware");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const constant_1 = require("./utils/constant");
const corsOptions_1 = require("./config/corsOptions");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class App {
    constructor(controllers, port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)(corsOptions_1.corsOptions));
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeControllers(controllers) {
        this.app.get("/", (request, response) => {
            response.send("Application is running");
        });
        controllers.forEach((controller) => {
            this.app.use("/api", [auth_middleware_1.authMiddleware.isAuthorized], controller.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
        this.app.use(route_middleware_1.notFoundRoute);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(constant_1.colorText, `[LISTENING]: http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
