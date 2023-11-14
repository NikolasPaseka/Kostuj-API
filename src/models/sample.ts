import { Schema, model } from "mongoose";

export interface ISample {
    name: string,
    rating?: number,
    catalogueId: Schema.Types.ObjectId,
    wineId: Schema.Types.ObjectId
}

const sampleSchema = new Schema<ISample>({
    name: { type: String, required: true },
    rating: { type: Number, required: false },
    catalogueId: { type: Schema.Types.ObjectId, ref: "Catalogue" },
    wineId: { type: Schema.Types.ObjectId, ref: "Wine" }
});

export const Sample = model<ISample>("Sample", sampleSchema);