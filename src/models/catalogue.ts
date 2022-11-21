import { Schema, model, connect } from "mongoose";

export interface ICatalogue {
    title: string,
    description?: string,
    year: number,
    startDate: number,
    address: string,
    location: {
        latitude: number,
        longitude: number
    }
    imageUrl?: string
}

const catalogueSchema = new Schema<ICatalogue>({
    title: { type: String, required: true },
    description: String,
    year: { type: Number, required: true },
    startDate: { type: Number, required: true },
    address: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    imageUrl: String
});

export const Catalogue = model<ICatalogue>("Catalogue", catalogueSchema);