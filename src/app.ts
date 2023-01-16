import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { connect } from "./config/db.config";

import getWinaryRouter from "./routes/winary.routes";
import getCatalogueRouter from "./routes/catalogue.routes";
import getUserRouter from "./routes/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import getMapLocationRouter from "./routes/mapLocation.routes";
import getWineRouter from "./routes/wines.routes";

// connect to databse
connect();
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

app.use('/catalogues', getCatalogueRouter());
app.use('/wineries', getWinaryRouter());
app.use('/wines', getWineRouter());
app.use('/users', getUserRouter());
app.use("/mapLocations", getMapLocationRouter());

app.all('*', (req, res) => {
    res.send("not found");
})

app.use(errorHandler);

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server is listening on port ' + port)
});