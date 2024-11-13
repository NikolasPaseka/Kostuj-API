import { Schema, model } from "mongoose";

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
    imageUrl?: string[],
    published: boolean,
    locked: boolean,
    maxWineRating: number,
    adminId: Schema.Types.ObjectId,
    price: number,
    downloads: number,
    participatedWineries?: Schema.Types.ObjectId[]
    coorganizators: Schema.Types.ObjectId[]
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
    imageUrl: [{ type: String, required: false }],
    published: { type: Boolean, required: true, default: false },
    locked: { type: Boolean, required: true, default: false },
    maxWineRating: { type: Number, required: true, default: 20 },
    adminId: { type: Schema.Types.ObjectId, ref: "User"},
    price: { type: Number, required: true, default: 0 },
    downloads: { type: Number, required: true, default: 0 },
    participatedWineries: [{ type: Schema.Types.ObjectId, ref: "Winary" }],
    coorganizators: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export const Catalogue = model<ICatalogue>("Catalogue", catalogueSchema);
