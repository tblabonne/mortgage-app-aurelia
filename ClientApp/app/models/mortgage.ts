import { computedFrom } from "../utilities";

export class Mortgage {
    public id: number = 0;
    public name: string = "";
    public purchasePrice: number = 0;
    public downPayment: number = 0;
    public rate: number = 0;
    public term: number = 0;
    public propertyTax: number = 0;
    public pmi: number = 0;
    public dues: number = 0;

    constructor(data?: any) {
        if (data) {
            this.id = data.id || 0;
            this.name = data.name || "";
            this.purchasePrice = data.purchasePrice || 0;
            this.downPayment = data.downPayment || 0;
            this.rate = data.rate || 0;
            this.term = data.term || 0;
            this.propertyTax = data.propertyTax || 0;
            this.pmi = data.pmi || 0;
            this.dues = data.dues || 0;
        }
    }

    public get propertyTaxPerMonth(): number {
        return this.propertyTax / 12;
    }

    public get termInMonths(): number {
        return this.term * 12;
    }

    @computedFrom<Mortgage>("rate", "purchasePrice", "downPayment", "termInMonths")
    public get monthlyPayment(): number {
        const r = this.rate / 100 / 12,
            p = this.purchasePrice - this.downPayment,
            n = this.termInMonths;
        return (p * r) * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    public get monthlyPaymentWithTaxesAndFees(): number {
        return this.monthlyPayment + this.propertyTaxPerMonth + this.pmi + this.dues;
    }

    public get totalPrincipal(): number {
        return this.purchasePrice - this.downPayment;
    }

    public get ltv(): number {
        return Math.round(this.totalPrincipal / this.purchasePrice * 100);
    }

    public get totalInterest(): number {
        return this.monthlyPayment * this.termInMonths - this.totalPrincipal;
    }

    public get totalTaxes(): number {
        return this.propertyTax * this.term;
    }

    public get totalPmi(): number {
        return this.pmi * this.termInMonths;
    }

    public get totalDues(): number {
        return this.dues * this.termInMonths;
    }

    public get totalCost(): number {
        return this.totalPrincipal + this.totalInterest + this.totalTaxes + this.totalPmi + this.totalDues;
    }

    public computeAmortization(yearly: boolean): IAmortizationData[] {
        return yearly ? this.computeYearlyAmortization() : this.computeMonthlyAmortization();
    }

    private computeMonthlyAmortization(): IAmortizationData[] {
        let principal = this.totalPrincipal;

        const rate = this.rate / 100 / 12,
            months = this.termInMonths,
            results: IAmortizationData[] = [];

        for (let i = 1; i <= months; i++) {
            const payment = this.monthlyPayment,
                interest = Math.round(principal * rate * 100) / 100,
                data = {
                    period: i,
                    payment,
                    principal: payment - interest,
                    interest,
                    balance: principal - (payment - interest),
                };

            principal -= data.principal;
            results.push(data);
        }

        return results;
    }

    private computeYearlyAmortization(): IAmortizationData[] {
        const amortization = this.computeMonthlyAmortization();
        const results: IAmortizationData[] = [];
        let payments = 0,
            principal = 0,
            interest = 0;

        for (let i = 1; i <= amortization.length; i++) {
            const data = amortization[i - 1];

            payments += data.payment;
            principal += data.principal;
            interest += data.interest;

            if ((i % 12) === 0) {
                const yearData = {
                    period: i / 12,
                    payment: payments,
                    principal,
                    interest,
                    balance: data.balance,
                };

                results.push(yearData);

                payments = principal = interest = 0;
            }
        }

        return results;
    }
}

export interface IAmortizationData {
    period: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}
