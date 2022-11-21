import { Router } from "express";
import { WinaryController } from "../controllers/winary.controller";
import catchAsync from "../utils/catchAsync";

export class WinaryRouter {
    private router: Router
    private winaryController: WinaryController

    constructor() {
        this.router = Router()
        this.winaryController = new WinaryController()

        this.registerRoutes()
    }

    getRouter(): Router {
        return this.router
    }

    registerRoutes() {
        this.router.route('/')
            .get(catchAsync(this.winaryController.getWinaries))
    }
}