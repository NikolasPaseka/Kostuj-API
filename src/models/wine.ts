import { Schema, model, connect } from "mongoose";
import { IGrapeVarietal } from "./GrapeVarietal";

export interface IWine {
    name: string,
    color: string,
    year: number,
    type: string,
    description: string,
    grapeVarietals: [IGrapeVarietal],
    imageUrl: string,
    winaryId: Schema.Types.ObjectId
}

const wineSchema = new Schema<IWine>({
    name: { type: String, required: true },
    color: { type: String, required: true },
    year: { 
        type: Number, 
        required: true,
        set: function(res: number) { return Math.round(res) }
    },
    type: { type: String, required: true },
    description: {type: String },
    grapeVarietals: [{ type: Schema.Types.ObjectId, ref: "GrapeVarietal" }],
    imageUrl: { type: String, required: false },
    winaryId: { type: Schema.Types.ObjectId, ref: "Winary" }
});

export const Wine = model<IWine>("Wine", wineSchema);