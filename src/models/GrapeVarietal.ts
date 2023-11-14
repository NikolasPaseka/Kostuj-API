import { Schema, model } from "mongoose";

export interface IGrapeVarietal {
    grape: string,
    shortcut: string
}

const grapeVarietalSchema = new Schema<IGrapeVarietal>({
    grape: { type: String, required: true },
    shortcut: { type: String, required: true }
});

export const GrapeVarietal = model<IGrapeVarietal>("GrapeVarietal", grapeVarietalSchema);