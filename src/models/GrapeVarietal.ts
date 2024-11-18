import { InferSchemaType, Schema, Types, model } from "mongoose";

const grapeVarietalSchema = new Schema({
    grape: { type: String, required: true },
    shortcut: { type: String, required: false },
    color: { type: String },
});

export const GrapeVarietal = model<IGrapeVarietal>("GrapeVarietal", grapeVarietalSchema);

export type IGrapeVarietal = InferSchemaType<typeof grapeVarietalSchema> & Partial<{ _id: Types.ObjectId }>; 