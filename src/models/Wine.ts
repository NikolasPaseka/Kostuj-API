import { Schema, model, Types, InferSchemaType } from "mongoose";
import { ResultSweetnessOptions } from "./utils/ResultSweetnessOptions";

const wineSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    description: {type: String, default: null },
    year: { 
        type: Number, 
        required: true,
        set: function(res: number) { return Math.round(res) }
    },
    attribute: { type: String },
    residualSugar: { type: Number },
    resultSweetness: { type: String, enum: ResultSweetnessOptions},
    alcoholContent: { type: Number },
    acidity: { type: Number },
    grapesSweetness: { type: Number },
    tasteResult: { type: String },
    productionMethod: { type: String },
    grapeVarietals: [{ grape: String }],
    imageUrl: { type: String, required: false },
    winaryId: { type: Schema.Types.ObjectId, ref: "Winary" }
});

export const Wine = model<IWine>("Wine", wineSchema);

export type IWine = InferSchemaType<typeof wineSchema> & Partial<{ _id: Types.ObjectId }>; 

export const WineUtil = {
    checkWineExists: (wines: IWine[], wineToFind: IWine, wineryId: string): IWine | null => {
        return wines.find(wine => 
            wine.name === wineToFind.name &&
            wine.year === wineToFind.year &&
            wine.color === wineToFind.color &&
            wine.winaryId?.toString() === wineryId
        ) ?? null;
    }
}
