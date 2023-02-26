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
    imageUrl?: string,
    published: boolean,
    locked: boolean,
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
    imageUrl: String,
    published: { type: Boolean, required: true, default: false },
    locked: { type: Boolean, required: true, default: false }
});

export const Catalogue = model<ICatalogue>("Catalogue", catalogueSchema);