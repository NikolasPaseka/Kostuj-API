import { Schema, model, connect } from "mongoose";

export interface IFavoriteWinery {
    wineryId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
}

const favoriteWinery = new Schema<IFavoriteWinery>({
    wineryId: { type: Schema.Types.ObjectId, ref: "Winary" },
    userId: { type: Schema.Types.ObjectId, ref: "User" }
});

export const FavoriteWinery = model<IFavoriteWinery>("FavoriteWinery", favoriteWinery);