import { autoinject } from "aurelia-framework";
import { DataService } from "../../dataService";
import { Mortgage } from "../../models/mortgage";

@autoinject
export class Home {
    public mortgages: Mortgage[];

    constructor(private dataService: DataService) { }

    public async activate(): Promise<Mortgage[]> {
        this.mortgages = await this.dataService.getMortgages();
        return this.mortgages;
    }
}
