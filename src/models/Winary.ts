import { Schema, model } from "mongoose";

export interface IWinary {
    name: string,
    description?: string,
    phoneNumber?: string,
    email?: string,
    websitesUrl: string
    address: string,
    imageUrl?: string,
    location?: {
        latitude: number,
        longitude: number
    }
}

const winarySchema = new Schema<IWinary>({
    name: { type: String, required: true },
    description: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    websitesUrl: { type: String },
    address: { type: String, required: true },
    imageUrl: String,
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
});

export const Winary = model<IWinary>("Winary", winarySchema);
