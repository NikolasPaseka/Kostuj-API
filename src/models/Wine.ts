import { Schema, model, Types, InferSchemaType } from "mongoose";

const wineSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    description: {type: String, default: null },
    year: { 
        type: Number, 
        required: true,
        set: function(res: number) { return Math.round(res) }
    },
    residualSugar: { type: Number },
    alcoholContent: { type: Number },
    acidity: { type: Number },
    grapesSweetness: { type: Number },
    tasteResult: { type: String },
    productionMethod: { type: String },
    grapeVarietals: [{ grape: String }],
    imageUrl: { type: String, required: false },
    winaryId: { type: Schema.Types.ObjectId, ref: "Winary" }
});

export const Wine = model<IWine>("Wine", wineSchema);

export type IWine = InferSchemaType<typeof wineSchema> & Partial<{ _id: Types.ObjectId }>; 

export const WineUtil = {
    checkWineExists: (wines: IWine[], wineToFind: IWine, wineryId: string): IWine | null => {
        return wines.find(winery => 
            winery.name === wineToFind.name &&
            winery.year === wineToFind.year && 
            winery.winaryId?.toString() === wineryId
        ) ?? null;
    }
}
