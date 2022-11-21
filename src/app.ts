import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { connect } from "./config/db.config";

import { Winary, IWinary } from "./models/winary";
import { Sample, ISample } from "./models/sample";
import { Wine, IWine } from "./models/wine";
import { Catalogue, ICatalogue } from "./models/catalogue";
import { CatalogueRouter } from "./routes/catalogue.routes";
import { WinaryRouter } from "./routes/winary.routes";

// connect to databse
connect()

const app: Express = express();

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// routes
app.get('/', (req: Request, res: Response) => {
    res.send("hello from typescript + express!!!")
});

const catalogueRouter = new CatalogueRouter();
const winaryRouter = new WinaryRouter();

app.use('/catalogues', catalogueRouter.getRouter());
app.use('/winaries', winaryRouter.getRouter());

app.all('*', (req, res) => {
    res.send("not found");
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server is listening on port ' + port)
});