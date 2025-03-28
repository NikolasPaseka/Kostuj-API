import { ISample } from "../models/Sample";
import { IWine } from "../models/Wine";

export class CommissionAssigner {
    private commissionCount: number = 0;
    private maxWineSamples: number = 0;

    constructor(commissionCount: number, maxWineSamples: number) {
        this.commissionCount = commissionCount;
        this.maxWineSamples = maxWineSamples;
    }

    public assignCommission(catalogueSamples: ISample[]): ISample[] {
        const sortedSamples = catalogueSamples.sort((a, b) => { 
            const wineA = a.wineId as unknown as IWine;
            const wineB = b.wineId as unknown as IWine;

            if (wineA.color !== wineB.color) {
                return wineA.color.localeCompare(wineB.color);
            }
            return wineA.name.localeCompare(wineB.name);
        });

        let i = 0;
        let currentCommission = 1;

        let color = "";
        if (sortedSamples.length > 0) {
            color = (sortedSamples[0].wineId as unknown as IWine).color;
        }

        for (const sample of sortedSamples) {
            const wine = sample.wineId as unknown as IWine;

            if (wine.color !== color) {
                color = wine.color;
                i = 0;
                currentCommission++;
            }
            if (i >= this.maxWineSamples) {
                i = 0;
                currentCommission++;
            }
            sample.ratingCommission = currentCommission;
            i++;
        }

        return sortedSamples;
    }
}