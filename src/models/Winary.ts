import { InferSchemaType, Schema, Types, model } from "mongoose";
import { convertIdPlugin } from "./utils/convertIdPlugin";

const winarySchema = new Schema({
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
    adminId: { type: Schema.Types.ObjectId, ref: "User"},
    isPublic: { type: Boolean, required: true, default: false },
});

export type IWinary = InferSchemaType<typeof winarySchema> & Partial<{ _id: Types.ObjectId, id?: string }>; 
export type WineryDomain = InferSchemaType<typeof winarySchema> & Partial<{ id: string }>;

export const Winary = model<IWinary>("Winary", winarySchema);

export const WineryUtil = {
    checkWineryExists: (wineries: IWinary[], wineryToFind: IWinary, adminId: string): IWinary | null => {
        return wineries.find(winery => 
            winery.name === wineryToFind.name && 
            winery.address === wineryToFind.address &&
            winery.adminId?.toString() === adminId
        ) ?? null;
    }
}
