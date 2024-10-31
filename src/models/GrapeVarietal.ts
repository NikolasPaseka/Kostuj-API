import { Schema, model } from "mongoose";

export interface IGrapeVarietal {
    grape: string,
    shortcut?: string,
    color?: string,
}

const grapeVarietalSchema = new Schema<IGrapeVarietal>({
    grape: { type: String, required: true },
    shortcut: { type: String, required: false },
    color: { type: String },
});

export const GrapeVarietal = model<IGrapeVarietal>("GrapeVarietal", grapeVarietalSchema);