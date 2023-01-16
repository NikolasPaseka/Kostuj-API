import { Router } from "express";
import { WinaryController } from "../controllers/WinaryController";
import catchAsync from "../utils/catchAsync";

function getWinaryRouter(): Router {
    const router = Router();
    const winaryController = new WinaryController();

    router.route('/')
        .get(catchAsync(winaryController.getWinaries))

    router.route("/:id")
        .get(catchAsync(winaryController.getWineryDetail))

    return router;
}

export default getWinaryRouter;