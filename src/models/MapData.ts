import { InferSchemaType, model, Schema, Types } from "mongoose";

const mapDataSchema = new Schema({
    catalogueId: { type: Schema.Types.ObjectId, ref: "Catalogue", required: true },
    center: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    zoom: { type: Number, required: true },
    shapeData: [{
        id: { type: String, required: true },
        type: { type: String, required: true, enum: ["marker", "polygon"] },
        color: { type: String, required: true },
        position: {
            lat: { type: Number },
            lng: { type: Number }
        },
        positions: [{
            lat: { type: Number },
            lng: { type: Number }
        }],
        label: { type: String },
        selectedWineryId: { type: Schema.Types.ObjectId, ref: "Winary" },
        icon: { type: String },
    }]
});

export const MapData = model<IMapData>("MapData", mapDataSchema);

export type IMapData = InferSchemaType<typeof mapDataSchema> & Partial<{ _id: Types.ObjectId }>;