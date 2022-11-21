import express, { Express, Request, Response, Router } from "express";
import { CatalogueController } from "../controllers/catalogue.controller";
import catchAsync from "../utils/catchAsync";

export class CatalogueRouter {
    private router: Router
    private catalogueController: CatalogueController

    constructor() {
        this.router = Router()
        this.catalogueController = new CatalogueController()

        this.registerRoutes()
    }

    getRouter(): Router {
        return this.router
    }

    registerRoutes() {
        this.router.route('/')
            .get(catchAsync(this.catalogueController.getCatalogues))

        this.router.route('/:id')
            .get(catchAsync(this.catalogueController.getCatalogueDetail))

        this.router.route('/:id/samples')
            .get(catchAsync(this.catalogueController.getCatalogueSamples))
    }
}