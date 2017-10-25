import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@autoinject
export class ConfirmDialog {
    message: string;

    constructor(public controller: DialogController) {

    }

    activate(message: string) {
        this.message = message;
    }
}