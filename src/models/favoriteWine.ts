import { Schema, model, connect } from "mongoose";

export interface IFavoriteWine {
    wineId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    notes: string,
}

const favoriteWineSchema = new Schema<IFavoriteWine>({
    wineId: { type: Schema.Types.ObjectId, ref: "Wine" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String }
});

export const FavoriteWine = model<IFavoriteWine>("FavoriteWine", favoriteWineSchema);