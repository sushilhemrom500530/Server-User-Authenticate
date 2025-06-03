"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_1 = require("../../controller/auth");
const validate_1 = require("../../middleware/validate");
const validationSchema_1 = require("../../utils/validationSchema");
const verifyUserToken_1 = require("../../middleware/verifyUserToken");
const router = express_1.default.Router();
router.post('/signup', (0, validate_1.validate)(validationSchema_1.ValidationSchema.Signup), (0, asyncHandler_1.AsyncHandler)(auth_1.authController.Signup));
router.post('/signin', (0, validate_1.validate)(validationSchema_1.ValidationSchema.Signin), (0, asyncHandler_1.AsyncHandler)(auth_1.authController.Signin));
router.post('/logout', (0, asyncHandler_1.AsyncHandler)(auth_1.authController.Logout));
router.get("/me", verifyUserToken_1.verifyUserToken, (req, res) => {
    res.json({ user: req.user });
});
exports.AuthRoutes = router;
