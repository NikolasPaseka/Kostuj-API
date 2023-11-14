import { Schema, model } from "mongoose";

export interface IRatedSample extends Document {
    commissionMemberId: Schema.Types.ObjectId,
    sampleId: Schema.Types.ObjectId,
    rating: number
}

const ratedSampleSchema = new Schema<IRatedSample>({
    commissionMemberId: { type: Schema.Types.ObjectId, required: true ,ref: "CommissionMember" },
    sampleId: { type: Schema.Types.ObjectId, required: true, ref: "Sample" },
    rating: { type: Number, required: true}
});

export const RatedSample = model<IRatedSample>("RatedSample", ratedSampleSchema);