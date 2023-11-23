import { Schema, model } from "mongoose";
import { IGrapeVarietal } from "./GrapeVarietal";

export interface IWine {
    name: string,
    color: string,
    description?: string,
    year: number,
    residualSugar?: number,
    alcoholContent?: number,
    acidity?: number,
    grapesSweetness?: number,
    tasteResult?: string,
    productionMethod?: string,
    grapeVarietals?: [IGrapeVarietal],
    imageUrl?: string,
    winaryId: Schema.Types.ObjectId
}

const wineSchema = new Schema<IWine>({
    name: { type: String, required: true },
    color: { type: String, required: true },
    description: {type: String, default: null },
    year: { 
        type: Number, 
        required: true,
        set: function(res: number) { return Math.round(res) }
    },
    residualSugar: { type: Number },
    alcoholContent: { type: Number },
    acidity: { type: Number },
    grapesSweetness: { type: Number },
    tasteResult: { type: String },
    productionMethod: { type: String },
    grapeVarietals: [{ type: Schema.Types.ObjectId, ref: "GrapeVarietal" }],
    imageUrl: { type: String, required: false },
    winaryId: { type: Schema.Types.ObjectId, ref: "Winary" }
});

export const Wine = model<IWine>("Wine", wineSchema);