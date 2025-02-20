import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'indCurrency',
    standalone: false
})
export class IndCurrencyPipe implements PipeTransform {
  transform(value: any): string | null {
    if (isNaN(value) || value == 0) return null;

    // Convert to a number and format as currency
    const numberValue = Number(value);
    return (
      '₹ ' +
      numberValue.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
}
