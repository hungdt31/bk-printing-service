"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenLife = exports.protectedRoutes = exports.colorText = void 0;
exports.colorText = "\x1b[36m%s\x1b[0m";
exports.protectedRoutes = ["/api/users/profile"];
exports.tokenLife = {
    accessToken: "1h",
    refreshToken: "7d",
};
