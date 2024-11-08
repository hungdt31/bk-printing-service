"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const user_schema_1 = require("../schemas/user.schema");
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const loginRequest = (req, res, next) => {
    const result = user_schema_1.LoginSchema.safeParse(req.body);
    if (!result.success) {
        const messages = result.error.issues.map((issue) => `${issue.path} ${issue.message.toLowerCase()}`);
        next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, messages.join(", ")));
    }
    next();
    return;
};
const registerRequest = (req, res, next) => {
    const result = user_schema_1.RegisterSchema.safeParse(req.body);
    if (!result.success) {
        const messages = result.error.issues.map((issue) => `${issue.path} ${issue.message.toLowerCase()}`);
        next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, messages.join(", ")));
    }
    next();
    return;
};
exports.userMiddleware = {
    loginRequest,
    registerRequest,
};
