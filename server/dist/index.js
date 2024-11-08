"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const users_controller_1 = __importDefault(require("./controllers/users.controller"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = new app_1.default([new users_controller_1.default()], port);
app.listen();
