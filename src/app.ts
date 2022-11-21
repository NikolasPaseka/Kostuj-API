import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import { Winary, IWinary } from "./models/winary";
import { Sample, ISample } from "./models/sample";
import { Wine, IWine } from "./models/wine";
import { Catalogue, ICatalogue } from "./models/catalogue";

mongoose.connect('mongodb://localhost:27017/kostuj')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch((err: any) => {
        console.log(`err: ${err}`)
    });

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


app.get('/winaries', async (req: Request, res: Response) => {
    try {
        const winaries: IWinary[] = await Winary.find({})

        res.status(200).json(winaries)
    } catch(e) {
        console.log(e)
    }
});

app.get('/samples', async (req: Request, res: Response) => {
    try {
        const samples: ISample[] = await Sample.find({})

        res.status(200).json(samples)
    } catch(e) {
        console.log(e)
    }
});

app.get('/catalogues', async (req: Request, res: Response) => {
    try {
        const catalogues: ICatalogue[] = await Catalogue.find({})

        res.status(200).json(catalogues)
    } catch(e) {
        console.log(e)
    }
});

app.get('/catalogues/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const catalogue: ICatalogue | null = await Catalogue.findById(id)
        if (catalogue != null) {
            res.status(200).json(catalogue);
        } else {
            res.status(404);
        }
    } catch(e) {
        console.log(e)
    }
});

app.get('/catalogues/:id/samples', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const samples: ISample[] = await Sample.find({
            catalogueId: id
        })
        .populate({ path: 'wineId', model: Wine });

        res.status(200).json(samples)
    } catch(e) {
        console.log(e)
    }
});


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('server is listening on port ' + port)
});