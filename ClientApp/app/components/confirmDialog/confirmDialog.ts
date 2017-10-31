import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";

export interface IConfirmDialogModel {
    message: string;
    title: string;
}

@autoinject
export class ConfirmDialog {
    public message: string;
    public title: string;

    constructor(public controller: DialogController) {

    }

    public activate(model: IConfirmDialogModel) {
        this.message = model.message;
        this.title = model.title;
    }
}
