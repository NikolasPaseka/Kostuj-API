import { Schema, model } from "mongoose";

export interface ICommissionMember {
    catalogueId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    commissionNumber: number
}

const commissionMemberSchema = new Schema<ICommissionMember>({
    catalogueId: { type: Schema.Types.ObjectId, required: true, ref: "Catalogue" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    commissionNumber: { type: Number, required: true }
});

export const CommissionMember = model<ICommissionMember>("CommissionMember", commissionMemberSchema);