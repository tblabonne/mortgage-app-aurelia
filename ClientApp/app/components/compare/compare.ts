import { autoinject } from "aurelia-framework";
import { DataService } from "../../dataService";
import { Mortgage } from "../../models/mortgage";
import { computedFrom } from "../../utilities";

interface IMortgageSelection {
    selected: boolean;
    mortgage: Mortgage;
}

@autoinject
export class CompareViewModel {
    public allMortgages: IMortgageSelection[];

    constructor(private dataService: DataService) {

    }

    public async activate(): Promise<IMortgageSelection[]> {
        const mortgages = await this.dataService.getMortgages();

        const results: IMortgageSelection[] = [];
        for (const m of mortgages) {
            const selector = {
                selected: false,
                mortgage: m,
            };

            results.push(selector);
        }

        this.allMortgages = results;
        return results;
    }

    public clear() {
        for (const item of this.allMortgages) {
            item.selected = false;
        }
    }

    public get selectedMortgages(): Mortgage[] {
        const results: Mortgage[] = [];
        for (const item of this.allMortgages) {
            if (item.selected) {
                results.push(item.mortgage);
            }
        }

        return results;
    }

    @computedFrom<CompareViewModel>("selectedMortgages")
    public get canSelect(): boolean {
        return this.selectedMortgages.length < 3;
    }

    @computedFrom<CompareViewModel>("selectedMortgages")
    public get hasSelection(): boolean {
        return this.selectedMortgages.length > 1;
    }

    @computedFrom<CompareViewModel>("selectedMortgages")
    public get bestMortgage(): Mortgage | null {
        if (this.selectedMortgages.length <= 1) {
            return null;
        }

        let min = Number.MAX_VALUE;
        let best: Mortgage | null = null;
        for (const item of this.selectedMortgages) {
            if (item.totalCost < min) {
                best = item;
                min = best.totalCost;
            }
        }

        return best;
    }
}
