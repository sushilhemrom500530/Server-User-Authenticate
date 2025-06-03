import express from "express";
import { AuthRoutes } from "./auth";
import { UserRoutes } from "./user";


const router = express.Router();

const modulesRoute = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
];


modulesRoute.forEach(route => router.use(route.path, route.route))

export default router;