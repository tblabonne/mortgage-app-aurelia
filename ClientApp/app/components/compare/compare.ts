import { autoinject, computedFrom } from 'aurelia-framework';
import { DataService } from '../../dataService';
import { Mortgage } from '../../models/mortgage';

interface MortgageSelection {
    selected: boolean;
    mortgage: Mortgage;
}

@autoinject
export class CompareViewModel {
    allMortgages: MortgageSelection[];

    constructor(private dataService: DataService) {

    }

    async activate(): Promise<MortgageSelection[]> {
        let mortgages = await this.dataService.getMortgages();

        let results: MortgageSelection[] = [];
        for (let m of mortgages) {
            let selector = {
                selected: false,
                mortgage: m
            };

            results.push(selector);
        }

        this.allMortgages = results;
        return results;
    }

    clear() {
        for (let item of this.allMortgages) {
            item.selected = false;
        }
    }

    get selectedMortgages(): Mortgage[] {
        let results: Mortgage[] = [];
        for (let item of this.allMortgages) {
            if (item.selected) {
                results.push(item.mortgage);
            }
        }

        return results;
    }

    get canSelect(): boolean {
        return this.selectedMortgages.length < 3;
    }

    get hasSelection(): boolean {
        return this.selectedMortgages.length > 1;
    }

    get bestMortgage(): Mortgage | null {
        if (this.selectedMortgages.length <= 1) {
            return null;
        }

        let min = Number.MAX_VALUE, best: Mortgage | null = null;
        for (let item of this.selectedMortgages) {
            if (item.totalCost < min) {
                best = item;
                min = best.totalCost;
            }
        }

        return best;
    }
}