import { DialogService } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import * as toastr from "toastr";
import { DataService } from "../../dataService";
import { IAmortizationData, Mortgage } from "../../models/mortgage";
import { areEqual, computedFrom, deepCopy } from "../../utilities";
import { ConfirmDialog } from "../confirmDialog/confirmDialog";

@autoinject
export class MortgageViewModel {
    public mortgage: Mortgage;
    public originalMortgage: Mortgage;

    public amortizationData: IAmortizationData[];
    public amortizationOption: string = "YEARLY";

    constructor(private dataService: DataService,
                private router: Router,
                private dialogService: DialogService) {
        this.mortgage = this.createDefaultMortgage();
    }

    public async activate(params: any): Promise<Mortgage> {
        const id = params.id;
        if (id && id !== 0) {
            this.mortgage = await this.dataService.getMortgage(id);
        }

        this.updateOriginalMortgage();

        return this.mortgage;
    }

    public canDeactivate(): Promise<boolean> {
        if (this.canSave) {
            const dialogModel = {
                message: "You have unsaved changes.  Are you sure you want to leave?",
                title: "Confirm",
            };

            return this.dialogService.open({ viewModel: ConfirmDialog, model: dialogModel }).whenClosed((response) => {
                return response.output;
            });
        }

        return Promise.resolve(true);
    }

    public calculateAmortization() {
        this.amortizationData = this.mortgage.computeAmortization(this.amortizationOption === "YEARLY");
    }

    public async save() {
        const isNew = this.isNewMortgage;
        this.mortgage = await this.dataService.saveMortgage(this.mortgage);
        this.updateOriginalMortgage();

        // navigate to the new mortgage's route
        if (isNew) {
            this.router.navigateToRoute("mortgage", { id: this.mortgage.id });
        }

        toastr.success("Mortgage saved.");
    }

    public delete() {
        const dialogModel = {
            message: "Are you sure you want to delete this mortgage?",
            title: "Confirm Delete",
        };

        this.dialogService.open({ viewModel: ConfirmDialog, model: dialogModel }).whenClosed((response) => {
            if (response.output === true) {
                this.dataService.deleteMortgage(this.mortgage.id).then((success) => {
                    if (success) {
                        this.router.navigateToRoute("home");
                        toastr.success("Mortgage deleted.");
                    }
                });
            }
        });
    }

    @computedFrom<MortgageViewModel>("mortgage")
    public get isNewMortgage(): boolean {
        return this.mortgage.id === 0;
    }

    @computedFrom<MortgageViewModel>("isNewMortgage", "mortgage", "originalMortgage")
    public get canSave(): boolean {
        return this.isNewMortgage || !areEqual(this.mortgage, this.originalMortgage);
    }

    private createDefaultMortgage() {
        const mortgage = new Mortgage();

        // setup a default mortgage
        mortgage.purchasePrice = 200000;
        mortgage.downPayment = 40000;
        mortgage.term = 30;
        mortgage.rate = 4.5;
        mortgage.propertyTax = 2000;
        mortgage.name = "New Mortgage";

        return mortgage;
    }

    private updateOriginalMortgage() {
        this.originalMortgage = deepCopy(this.mortgage);
    }
}
