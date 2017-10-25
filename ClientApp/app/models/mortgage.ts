import { computedFrom } from 'aurelia-framework';

export class Mortgage {
    id: number = 0;
    name: string = "";
    purchasePrice: number = 0;
    downPayment: number = 0;
    rate: number = 0;
    term: number = 0;
    propertyTax: number = 0;
    pmi: number = 0;
    dues: number = 0;

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

    get propertyTaxPerMonth(): number {
        return this.propertyTax / 12;
    }

    get termInMonths(): number {
        return this.term * 12;
    }

    @computedFrom('rate', 'purchasePrice', 'downPayment', 'termInMonths')
    get monthlyPayment(): number {
        let r = this.rate / 100 / 12,
            p = this.purchasePrice - this.downPayment,
            n = this.termInMonths;
        return (p * r) * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    get monthlyPaymentWithTaxesAndFees(): number {
        return this.monthlyPayment + this.propertyTaxPerMonth + this.pmi + this.dues;
    }

    get totalPrincipal(): number {
        return this.purchasePrice - this.downPayment;
    }

    get ltv(): number {
        return Math.round(this.totalPrincipal / this.purchasePrice * 100);
    }

    get totalInterest(): number {
        return this.monthlyPayment * this.termInMonths - this.totalPrincipal;
    }

    get totalTaxes(): number {
        return this.propertyTax * this.term;
    }

    get totalPmi(): number {
        return this.pmi * this.termInMonths;
    }

    get totalDues(): number {
        return this.dues * this.termInMonths;
    }

    get totalCost(): number {
        return this.totalPrincipal + this.totalInterest + this.totalTaxes + this.totalPmi + this.totalDues;
    }

    computeAmortization(yearly: boolean): AmortizationData[] {
        return yearly ? this.computeYearlyAmortization() : this.computeMonthlyAmortization();
    }

    private computeMonthlyAmortization(): AmortizationData[] {
        let principal = this.totalPrincipal,
            months = this.termInMonths,
            rate = this.rate / 100 / 12,
            results: AmortizationData[] = [];

        for (var i = 1; i <= months; i++) {
            let payment = this.monthlyPayment,
                interest = Math.round(principal * rate * 100) / 100,
                data = {
                    period: i,
                    payment: payment,
                    principal: payment - interest,
                    interest: interest,
                    balance: principal - (payment - interest)
                };

            principal -= data.principal;
            results.push(data);
        }

        return results;
    }

    private computeYearlyAmortization(): AmortizationData[] {
        let amortization = this.computeMonthlyAmortization(),
            results: AmortizationData[] = [],
            payments = 0,
            principal = 0,
            interest = 0;

        for (var i = 1; i <= amortization.length; i++) {
            let data = amortization[i - 1];

            payments += data.payment;
            principal += data.principal;
            interest += data.interest;

            if ((i % 12) === 0) {
                let yearData = {
                    period: i / 12,
                    payment: payments,
                    principal: principal,
                    interest: interest,
                    balance: data.balance
                };

                results.push(yearData);

                payments = principal = interest = 0;
            }
        }

        return results;
    }
}

export interface AmortizationData {
    period: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}