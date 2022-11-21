import { Schema, model, connect } from "mongoose";

export interface IWine {
    name: string,
    color: string,
    winaryId: Schema.Types.ObjectId
}

const wineSchema = new Schema<IWine>({
    name: { type: String, required: true },
    color: { type: String, required: true },
    winaryId: { type: Schema.Types.ObjectId, ref: "Winary" }
});

export const Wine = model<IWine>("Wine", wineSchema);