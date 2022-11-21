import { Schema, model, connect } from "mongoose";

export interface IWinary {
    name: string,
    address: string,
    imageUrl?: string
}

const winarySchema = new Schema<IWinary>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    imageUrl: String
});

export const Winary = model<IWinary>("Winary", winarySchema);