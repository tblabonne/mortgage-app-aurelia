import { HttpClient, json } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';
import { Mortgage } from './models/mortgage';

@autoinject
export class DataService {
    constructor(private http: HttpClient) { }

    async getMortgages(): Promise<Mortgage[]> {
        let data = await this.fetch('api/mortgages');

        let results: Mortgage[] = [];
        for (let item of data) {
            let mortgage = new Mortgage(item);
            results.push(mortgage);
        }
        
        return results;
    }

    async getMortgage(id: number): Promise<Mortgage> {
        let data = await this.fetch('api/mortgages/' + id);

        return new Mortgage(data);
    }

    async saveMortgage(mortgage: Mortgage): Promise<Mortgage> {
        let method = "POST";
        if (mortgage.id !== 0) {
            method = "PUT";
        }

        let resp = await this.http.fetch('api/mortgages', {
            method: method,
            body: JSON.stringify(mortgage),
            headers: {
                "content-type": "application/json"
            }
        });

        let data = await resp.json();
        return new Mortgage(data);
    }

    async deleteMortgage(id: number): Promise<boolean> {
        let resp = await this.http.fetch('api/mortgages/' + id, {
            method: 'DELETE'
        });

        return resp.status === 200;
    }

    private async fetch(url: string): Promise<any> {
        let resp = await this.http.fetch(url);
        return resp.json();
    }
}