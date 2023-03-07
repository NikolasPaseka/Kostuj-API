import { Schema, model, connect } from "mongoose";

export interface ICommissionMember {
    catalogueId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
}

const commissionMemberSchema = new Schema<ICommissionMember>({
    catalogueId: { type: Schema.Types.ObjectId, required: true, ref: "Catalogue" },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

export const CommissionMember = model<ICommissionMember>("CommissionMember", commissionMemberSchema);