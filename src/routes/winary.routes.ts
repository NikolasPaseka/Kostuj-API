import { Router } from "express";
import { WinaryController } from "../controllers/winary.controller";
import catchAsync from "../utils/catchAsync";

function getWinaryRouter(): Router {
    const router = Router();
    const winaryController = new WinaryController();

    router.route('/')
        .get(catchAsync(winaryController.getWinaries))

    return router;
}

export default getWinaryRouter;