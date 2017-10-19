import * as numeral from 'numeral';

export class CurrencyFormatValueConverter {
    toView(value: number): string {
        return numeral(value).format("($0,0.00)");
    }

    fromView(value: string): number {
        return numeral(value).value();
    }
}