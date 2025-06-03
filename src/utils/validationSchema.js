"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSchema = exports.Signin = exports.Signup = void 0;
const zod_1 = require("zod");
exports.Signup = zod_1.z.object({
    username: zod_1.z.string({ required_error: "User name is required" }).min(3, "Username must be at least 3 characters long"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters long")
        .regex(/(?=.*\d)(?=.*[@$!%*?&])/, "Password must include at least one number and one special character"),
    shops: zod_1.z
        .array(zod_1.z.string({ required_error: "Shops is required" }).min(1, "Shop name cannot be empty"))
        .min(3, "At least 3 shop names are required")
        .max(4, "Maximum 4 shops allowed"),
});
exports.Signin = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string().min(1, "Password is required"),
    remember: zod_1.z.boolean().optional(),
});
exports.ValidationSchema = {
    Signup: exports.Signup,
    Signin: exports.Signin
};
