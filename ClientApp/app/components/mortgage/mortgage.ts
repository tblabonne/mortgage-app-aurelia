import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogService } from 'aurelia-dialog';
import * as toastr from 'toastr';
import { Mortgage, AmortizationData } from '../../models/mortgage';
import { DataService } from '../../dataService';
import { ConfirmDialog } from '../confirmDialog/confirmDialog';
import { areEqual } from '../../utilities';

@autoinject
export class MortgageViewModel {
    mortgage: Mortgage;
    originalMortgage: Mortgage;
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

        this.originalMortgage = JSON.parse(JSON.stringify(this.mortgage));

        return this.mortgage;
    }

    canDeactivate(): Promise<boolean> {
        if (this.canSave) {
            return this.dialogService.open({ viewModel: ConfirmDialog, model: 'You have unsaved changes.  Are you sure you want to leave?' }).whenClosed(response => {
                return response.output;
            });
        }

        return Promise.resolve(true);
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
        this.dialogService.open({ viewModel: ConfirmDialog, model: 'Are you sure you want to delete this mortgage?' }).whenClosed(response => {
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

    get canSave(): boolean {
        return this.isNewMortgage || !areEqual(this.mortgage, this.originalMortgage);
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