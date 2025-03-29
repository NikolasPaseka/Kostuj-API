import { ISample } from "../models/Sample";
import { WineColorOptions } from "../models/utils/WineColorOptions";
import { IWine } from "../models/Wine";

export class CommissionAssigner {
    private commissionsCount: {
        [key in WineColorOptions]: number;
    }

    constructor(commissionCount: { [key in WineColorOptions]: number }) {
        this.commissionsCount = commissionCount;
    }

    private assignForWineColor(
        catalogueSamples: ISample[], 
        wineColor: WineColorOptions, 
        commissionCount: number,
        currentCommission: number
    ): { assignedSamples: ISample[], currentCommission: number } {
        const filteredSamples = catalogueSamples.filter(sample => {
            const wine = sample.wineId as unknown as IWine;
            return wine.color === wineColor;
        });

        const sortedSamples = filteredSamples.sort((a, b) => {
            const wineA = a.wineId as unknown as IWine;
            const wineB = b.wineId as unknown as IWine;

            return wineA.name.localeCompare(wineB.name);
        });

        const winesPerCommission = Math.ceil(sortedSamples.length / commissionCount);
        let i = 1;
        for (const sample of sortedSamples) {
            if (i > winesPerCommission) {
                i = 1;
                currentCommission++;
            }
            sample.ratingCommission = currentCommission;
            i++;
        }
        // fort next color commission shall be changed
        currentCommission++;

        return { assignedSamples: sortedSamples, currentCommission };
    }

    public assignCommission(catalogueSamples: ISample[]): ISample[] {
        let currentCommission = 1;
        let assignedSamples: ISample[] = [];

        // Assign commissions for each wine color

        for (const wineColor of Object.values(WineColorOptions)) {
            const result = this.assignForWineColor(
                catalogueSamples,
                wineColor as WineColorOptions,
                this.commissionsCount[wineColor.valueOf()],
                currentCommission
            );
            assignedSamples.push(...result.assignedSamples);
            currentCommission = result.currentCommission;
        }

        return assignedSamples
    }
}