import { Schema, model, connect } from "mongoose";

export interface IWinary {
    name: string,
    address: string,
    imageUrl?: string,
    location: {
        latitude: number,
        longitude: number
    }
}

const winarySchema = new Schema<IWinary>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    imageUrl: String,
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
});

export const Winary = model<IWinary>("Winary", winarySchema);