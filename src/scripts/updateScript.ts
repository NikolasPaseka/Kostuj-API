import { GrapeVarietal } from "../models/GrapeVarietal";
import { IWine, Wine } from "../models/Wine";

export const updateScript = async () => {
    const wines = await Wine.find({
        // $or: [
        //     { name: { $regex: /^směs/i } },
            // {
            //     grapeVarietals: {
            //         $elemMatch: {
            //             grape: { $type: "string" }
            //         }
            //     }
            // }
        //]
    });

    const finalWines: IWine[] = [];

    for (const wine of wines) {
        if (wine.grapeVarietals.length === 1 && wine.grapeVarietals[0] == null) {
            finalWines.push(wine);
        } 
        // if (wine.name.startsWith("směs")) {
        //     wine.grapeVarietals = [];
        // } else {
        //     const foundVarieatal = await GrapeVarietal.findOne({ grape: wine.grapeVarietals[0].grape });
        //     wine.grapeVarietals = [foundVarieatal?._id];
        // }
        //await wine.save();
    }
} 
