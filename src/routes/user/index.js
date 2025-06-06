"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../controller/user");
const router = express_1.default.Router();
router.get('/', user_1.UserController.getAllFromDB);
exports.UserRoutes = router;
