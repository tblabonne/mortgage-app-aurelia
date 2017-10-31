import { HttpClient, json } from "aurelia-fetch-client";
import { autoinject } from "aurelia-framework";
import { Mortgage } from "./models/mortgage";

@autoinject
export class DataService {
    constructor(private http: HttpClient) { }

    public async getMortgages(): Promise<Mortgage[]> {
        const data = await this.fetch("api/mortgages");

        const results: Mortgage[] = [];
        for (const item of data) {
            const mortgage = new Mortgage(item);
            results.push(mortgage);
        }

        return results;
    }

    public async getMortgage(id: number): Promise<Mortgage> {
        const data = await this.fetch("api/mortgages/" + id);

        return new Mortgage(data);
    }

    public async saveMortgage(mortgage: Mortgage): Promise<Mortgage> {
        let method = "POST";
        if (mortgage.id !== 0) {
            method = "PUT";
        }

        const resp = await this.http.fetch("api/mortgages", {
            method,
            body: JSON.stringify(mortgage),
            headers: {
                "content-type": "application/json",
            },
        });

        const data = await resp.json();
        return new Mortgage(data);
    }

   public async deleteMortgage(id: number): Promise<boolean> {
        const resp = await this.http.fetch("api/mortgages/" + id, {
            method: "DELETE",
        });

        return resp.status === 200;
    }

    private async fetch(url: string): Promise<any> {
        const resp = await this.http.fetch(url);
        return resp.json();
    }
}
