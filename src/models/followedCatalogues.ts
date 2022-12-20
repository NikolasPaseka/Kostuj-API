import { Schema, model, connect } from "mongoose";

export interface IFollowedCatalogue {
    catalogueId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId
}

const followedCatalogueSchema = new Schema<IFollowedCatalogue>({
    catalogueId: { type: Schema.Types.ObjectId, ref: "Catalogue" },
    userId: { type: Schema.Types.ObjectId, ref: "User" }
});

export const FollowedCatalogue = model<IFollowedCatalogue>("FollowedCatalogues", followedCatalogueSchema);