"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_provider_1 = require("../providers/jwt.provider");
const http_status_codes_1 = require("http-status-codes");
const constant_1 = require("../utils/constant");
const http_errors_1 = __importDefault(require("http-errors"));
// Middleware này sẽ đảm nhiệm việc quan trọng: lấy và xác thực JWT accessToken nhận được từ phía FE có hợp lệ hay không
// Chỉ một trong hai cách lấy token: cookie và localstorage
const isAuthorized = async (req, res, next) => {
    var _a, _b;
    console.log(constant_1.colorText, "[ENDPOINT]", req.method, req.originalUrl);
    const isPrivate = constant_1.protectedRoutes.includes(req.originalUrl);
    if (isPrivate) {
        const accessTokenFromCookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        // console.log("Access token: ", accessTokenFromCookie);
        try {
            const accessTokenDecoded = (await jwt_provider_1.JwtProvider.verifyToken(accessTokenFromCookie, process.env.ACCESS_TOKEN_SECRET_SIGNATURE));
            // console.log(accessTokenDecoded);
            req.jwtDecoded = accessTokenDecoded;
            next();
        }
        catch (error) {
            // console.log("Error from authMiddleware: ", error);
            if (error instanceof Error && ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes("jwt expired"))) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.NOT_FOUND, "Need to refresh token"));
            }
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized: Please login"));
        }
        return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You don't have permission to access this endpoint!"));
    }
    next();
};
exports.authMiddleware = {
    isAuthorized,
};
