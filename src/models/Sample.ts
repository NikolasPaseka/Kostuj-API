import { InferSchemaType, Schema, Types, model } from "mongoose";

const sampleSchema = new Schema({
    name: { type: String, required: false },
    rating: { type: Number, required: false },
    champion: { type: Boolean, required: true, default: false },
    note: { type: String, required: false },
    catalogueId: { type: Schema.Types.ObjectId, ref: "Catalogue" },
    wineId: { type: Schema.Types.ObjectId, ref: "Wine" }
});

export const Sample = model<ISample>("Sample", sampleSchema);

export type ISample = InferSchemaType<typeof sampleSchema> & Partial<{ _id: Types.ObjectId, id?: string }>; 