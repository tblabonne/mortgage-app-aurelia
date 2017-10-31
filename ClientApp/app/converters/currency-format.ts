import * as numeral from "numeral";

export class CurrencyFormatValueConverter {
    public toView(value: number): string {
        return numeral(value).format("($0,0.00)");
    }

    public fromView(value: string): number {
        return numeral(value).value();
    }
}
