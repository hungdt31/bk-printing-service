"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtProvider = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = async (payload, secretSignature, tokenLife) => {
    try {
        return jsonwebtoken_1.default.sign(payload, secretSignature, {
            expiresIn: tokenLife,
            algorithm: "HS256",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
};
const verifyToken = async (token, secretSignature) => {
    try {
        return jsonwebtoken_1.default.verify(token, secretSignature);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
};
exports.JwtProvider = {
    generateToken,
    verifyToken,
};
