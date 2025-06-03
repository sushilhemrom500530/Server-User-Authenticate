import express, { Response } from 'express';
import { AsyncHandler } from '../../utils/asyncHandler';
import { authController } from '../../controller/auth';
import { validate } from '../../middleware/validate';
import { ValidationSchema } from '../../utils/validationSchema';
import { verifyUserToken } from '../../middleware/verifyUserToken';
import { AuthenticatedRequest } from '../../interface/AuthenticatedRequest';


const router = express.Router();

router.post(
    '/signup',
    validate(ValidationSchema.Signup),
     AsyncHandler(authController.Signup)
);

router.post(
    '/signin',
    validate(ValidationSchema.Signin),
     AsyncHandler(authController.Signin)
);
router.post(
    '/logout',
     AsyncHandler(authController.Logout)
);


router.get("/me", verifyUserToken, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
});


export const AuthRoutes = router;