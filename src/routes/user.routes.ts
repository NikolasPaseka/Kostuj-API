import { Router } from "express";
import { UserController } from "../controllers/UserController";
import catchAsync from "../utils/catchAsync";

function getUserRouter(): Router {
    const router = Router();
    const userController = new UserController();

    router.route('/')
        .get(catchAsync(userController.getUsers))

    router.route('/login')
        .post(catchAsync(userController.login))

    router.route('/register')
        .post(catchAsync(userController.register))

    return router;
}

export default getUserRouter;