"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./db/connect"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, connect_1.default)();
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     const staticOrigin = 'http://localhost:5173';
//     const dynamicSubdomainRegex = /^http:\/\/[\w-]+\.localhost:5173$/;
//     if (origin === staticOrigin || dynamicSubdomainRegex.test(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'https://user-authentication-client-nine.vercel.app'
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/api/v1', routes_1.default);
app.get('/', (_req, res) => {
    res.send('Server is running...');
});
app.listen(config_1.default.port, () => {
    console.log(`Server running on port : ${config_1.default.port}`);
});
