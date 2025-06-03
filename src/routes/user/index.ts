import express from 'express';
import { UserController } from '../../controller/user';

const router = express.Router();


router.get(
    '/',
    UserController.getAllFromDB
);



export const UserRoutes = router;