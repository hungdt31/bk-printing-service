"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./abstractions/base-controller");
const user_middleware_1 = require("../middlewares/user.middleware");
const prisma_client_1 = require("../providers/prisma.client");
const http_status_codes_1 = require("http-status-codes");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jwt_provider_1 = require("../providers/jwt.provider");
const ms_1 = __importDefault(require("ms"));
const constant_1 = require("../utils/constant");
class UsersController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.path = "/users";
        this.login = (0, express_async_handler_1.default)(async (request, response, next) => {
            const customer = await prisma_client_1.prisma.customer.findFirst({
                where: {
                    email: request.body.email,
                },
            });
            if (!customer) {
                response
                    .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                    .json({ message: "Invalid email or password" });
                return;
            }
            const isExactPassword = bcryptjs_1.default.compareSync(request.body.password, customer.password);
            if (!isExactPassword) {
                response
                    .status(http_status_codes_1.StatusCodes.FORBIDDEN)
                    .json({ message: "Invalid email or password." });
                return;
            }
            const customerInfo = {
                id: customer.customer_id,
                name: customer.name,
                email: customer.email,
                type: customer.type,
            };
            const accessToken = await jwt_provider_1.JwtProvider.generateToken(customerInfo, process.env.ACCESS_TOKEN_SECRET_SIGNATURE, constant_1.tokenLife.accessToken);
            const refreshToken = await jwt_provider_1.JwtProvider.generateToken(customerInfo, process.env.REFRESH_TOKEN_SECRET_SIGNATURE, constant_1.tokenLife.refreshToken);
            // console.log("accessToken: ", accessToken);
            response.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: (0, ms_1.default)("14 days"),
            });
            response.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: (0, ms_1.default)("14 days"),
            });
            response.status(http_status_codes_1.StatusCodes.OK).json({
                data: {
                    customerInfo,
                    accessToken,
                    refreshToken,
                },
                message: "Login successfully!",
            });
        });
        this.refresh_token = async (request, response) => {
            var _a;
            const refreshToken = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
            // console.log("refreshToken: ", refreshToken);
            try {
                const refreshTokenDecoded = (await jwt_provider_1.JwtProvider.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_SIGNATURE));
                // console.log("refreshTokenDecoded: ", refreshTokenDecoded);
                const customer = await prisma_client_1.prisma.customer.findUnique({
                    where: {
                        customer_id: refreshTokenDecoded.id,
                    },
                });
                if (!customer) {
                    response
                        .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                        .json({ message: "Invalid refresh token" });
                }
                // Tạo một accessToken mới
                const accessToken = await jwt_provider_1.JwtProvider.generateToken({
                    id: refreshTokenDecoded.id,
                    email: refreshTokenDecoded.email,
                    name: refreshTokenDecoded.name,
                    type: refreshTokenDecoded.type,
                }, process.env.ACCESS_TOKEN_SECRET_SIGNATURE, constant_1.tokenLife.accessToken);
                // Response lại cookie accessToken mới cho trường hợp sử dụng cookie
                response.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: (0, ms_1.default)("14 days"),
                });
                // Trả về cho phía client một accessToken mới
                response.status(http_status_codes_1.StatusCodes.OK).json({ accessToken });
            }
            catch (error) {
                // console.log("Refresh token is not valid!");
                response.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    message: "Your session is ended. Please login!",
                });
            }
        };
        this.register = async (request, response) => {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hashedPassword = bcryptjs_1.default.hashSync(request.body.password, salt);
            const customer = await prisma_client_1.prisma.customer.create({
                data: {
                    email: request.body.email,
                    name: request.body.name,
                    password: hashedPassword,
                    type: request.body.type ? request.body.type : "STUDENT",
                },
            });
            response.status(http_status_codes_1.StatusCodes.OK).json({
                data: {
                    id: customer.customer_id,
                    email: customer.email,
                    name: customer.name,
                },
                message: "Register successfully!",
            });
        };
        this.profile = async (request, response) => {
            response.status(http_status_codes_1.StatusCodes.OK).json({
                profile: request.jwtDecoded,
                message: "Profile information",
            });
        };
        this.logout = (0, express_async_handler_1.default)(async (request, response) => {
            response.clearCookie("accessToken");
            response.clearCookie("refreshToken");
            response.status(http_status_codes_1.StatusCodes.OK).json({ message: "Logout successfully" });
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/login`, [user_middleware_1.userMiddleware.loginRequest], this.login);
        this.router.post(`${this.path}/register`, [user_middleware_1.userMiddleware.registerRequest], this.register);
        this.router.put(`${this.path}/refresh-token`, this.refresh_token);
        this.router.get(`${this.path}/profile`, this.profile);
        this.router.delete(`${this.path}/logout`, this.logout);
    }
}
exports.default = UsersController;
