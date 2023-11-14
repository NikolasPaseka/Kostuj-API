import mongoose, { Schema, model } from "mongoose";

export interface ITastedSample extends mongoose.Document {
    sampleId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    rating: number,
    note: string,
    modifiedAt: Number
}

const tastedSampleSchema = new Schema<ITastedSample>({
    sampleId: { type: Schema.Types.ObjectId, ref: "Sample" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    note: { type: String },
    rating: { type: Number, required: true },
    modifiedAt: { type: Number, default: new Date().getTime() }
})
    

export const TastedSample = model<ITastedSample>("TastedSample", tastedSampleSchema);