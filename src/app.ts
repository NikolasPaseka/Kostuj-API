import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "./config/db.config";
require("./config/cloudinary");
import { load } from 'ts-dotenv';
import { errorHandler } from "./middleware/errorHandler";
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'

import wineryRouter from "./routes/winary.routes";
import userRouter from "./routes/user.routes";
import mapLocationRouter from "./routes/mapLocation.routes";
import catalogueRouter from "./routes/catalogue.routes";
import wineRouter from "./routes/wines.routes";
import { ResponseError } from "./utils/ResponseError";

const env = load({
    PORT: Number,
});

// connect to databse
connect();
const app: Express = express();

// configure CORS
const options: cors.CorsOptions = {
    origin: "*"
};
app.use(cors(options));

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// routes
app.get('/', (req: Request, res: Response) => {
    res.send("Kostuj API")
});

app.use('/catalogues', catalogueRouter);
app.use('/wineries', wineryRouter);
app.use('/wines', wineRouter);
app.use('/users', userRouter);
app.use("/mapLocations", mapLocationRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));     


app.all('*', (req, res) => {
    const error = new ResponseError("Not found", 404);
    res.statusCode = 404;
    res.json(error);
});

app.use(errorHandler);

const port = env.PORT || 3000
app.listen(port, () => {
    console.log('server is listening on port ' + port)
});