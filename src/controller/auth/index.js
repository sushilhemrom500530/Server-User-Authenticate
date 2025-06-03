"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.Signin = exports.Signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const config_1 = __importDefault(require("../../config"));
const jwtHelper_1 = require("../../utils/jwtHelper");
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const sendError = (res, status, message) => res.status(status).json({ message });
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, shops } = req.body;
        if (!passwordRegex.test(password)) {
            return sendError(res, 400, "Password must be at least 8 characters long and include at least one number and one special character.");
        }
        if (!Array.isArray(shops) || shops.length < 3) {
            return sendError(res, 400, "At least 3 shop names are required.");
        }
        // Normalize shop names to lowercase for case-insensitive uniqueness
        const normalizedShops = shops.map((name) => name.trim().toLowerCase());
        // Check for duplicate shop names across all users
        const existingShops = yield User_1.default.find({ shops: { $in: normalizedShops } });
        if (existingShops.length > 0) {
            const takenShopNames = existingShops
                .flatMap(user => user === null || user === void 0 ? void 0 : user.shops)
                .filter(shop => normalizedShops === null || normalizedShops === void 0 ? void 0 : normalizedShops.includes(shop.toLowerCase()));
            return sendError(res, 400, `These shop names are already taken: ${[...new Set(takenShopNames)].join(", ")}`);
        }
        // Check for duplicate shop names in the input itself
        const duplicates = normalizedShops.filter((item, index) => normalizedShops.indexOf(item) !== index);
        if (duplicates.length > 0) {
            return sendError(res, 400, `Duplicate shop names provided: ${[...new Set(duplicates)].join(", ")}`);
        }
        if (yield User_1.default.findOne({ username })) {
            return sendError(res, 400, "Username is already taken.");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield User_1.default.create({
            username,
            password: hashedPassword,
            shops: normalizedShops,
        });
        return res.status(201).json({
            message: "User created successfully.",
            data: {
                id: newUser._id,
                username: newUser.username,
                shops: newUser.shops,
            },
        });
    }
    catch (error) {
        console.error("Signup Error:", error);
        return sendError(res, 500, "Something went wrong. Please try again.");
    }
});
exports.Signup = Signup;
const Signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, rememberMe } = req.body;
        if (!username || !password) {
            return sendError(res, 400, "Username and password required");
        }
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            return sendError(res, 400, "User not found");
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return sendError(res, 400, "Incorrect password");
        }
        const expiresIn = rememberMe ? "7d" : "30m";
        const token = jwtHelper_1.jwtHelpers.generateToken({ id: user._id, username: user.username }, config_1.default.jwtSecret, expiresIn);
        // Set token in cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : '.localhost',
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
        });
        return res.status(200).json({
            message: "User signed in successfully",
            token
        });
    }
    catch (error) {
        console.error("Signin error:", error);
        return sendError(res, 500, "Server error");
    }
});
exports.Signin = Signin;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("auth_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out" });
});
exports.authController = {
    Signin: exports.Signin,
    Signup: exports.Signup,
    Logout
};
