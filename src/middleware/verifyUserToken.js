"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserToken = void 0;
const jwtHelper_1 = require("../utils/jwtHelper");
const config_1 = __importDefault(require("../config"));
const verifyUserToken = (req, res, next) => {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token;
    if (!token) {
        res.status(401).json({ message: "Unauthorized: Token missing" });
        return;
    }
    try {
        const decoded = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
exports.verifyUserToken = verifyUserToken;
