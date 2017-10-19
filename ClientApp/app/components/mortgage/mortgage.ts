import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';
import * as toastr from 'toastr';
import { Mortgage, AmortizationData } from '../../models/mortgage';
import { DataService } from '../../dataService';
import { ConfirmDialog } from '../confirmDialog/confirmDialog';

@autoinject
export class MortgageViewModel {
    mortgage: Mortgage;
    amortizationData: AmortizationData[];
    amortizationOption: string = "YEARLY";

    constructor(private dataService: DataService,
                private router: Router,
                private dialogService: DialogService) {
        this.mortgage = this.createDefaultMortgage();
    }

    async activate(params: any): Promise<Mortgage> {
        let id = params.id;
        if (id && id !== 0) {
            this.mortgage = await this.dataService.getMortgage(id);
        }

        return this.mortgage;
    }

    calculateAmortization() {
        this.amortizationData = this.mortgage.computeAmortization(this.amortizationOption == "YEARLY");
    }

    async save() {
        let isNew = this.isNewMortgage;
        this.mortgage = await this.dataService.saveMortgage(this.mortgage);
        // navigate to the new mortgage's route
        if (isNew) {
            this.router.navigateToRoute('mortgage', { id: this.mortgage.id });
        }

        toastr.success('Mortgage saved.');
    }

    delete() {
        this.dialogService.open({ viewModel: ConfirmDialog }).whenClosed(response => {
            if (response.output === true) {
                this.dataService.deleteMortgage(this.mortgage.id).then(success => {
                    if (success) {
                        this.router.navigateToRoute('home');
                        toastr.success('Mortgage deleted.');
                    }
                });
            }
        });
    }

    get isNewMortgage(): boolean {
        return this.mortgage.id === 0;
    }

    private createDefaultMortgage() {
        let m = new Mortgage();

        // setup a default mortgage
        m.purchasePrice = 200000;
        m.downPayment = 40000;
        m.term = 30;
        m.rate = 4.5;
        m.propertyTax = 2000;
        m.name = "New Mortgage";

        return m;
    }
}