import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberRoundoff',
  standalone: true
})
export class NumberRoundoffPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 999) {
      return value.toString();
    } else if (value < 99999) {
      return this.roundAndFormat(value / 1000) + 'K';
    } else if (value < 9999999) {
      const result = this.roundAndFormat(value / 100000);
      return parseInt(result, 10) < 2 ? result + ' Lac' : result + ' Lacs';
    } else {
      return this.roundAndFormat(value / 10000000) + ' Cr';
    }
  }

  private roundAndFormat(num: number): string {
    const integerPart = Math.floor(num);
    const decimalPart = num - integerPart;

    const roundedNum = decimalPart > 0.5 ? Math.floor((num + 0.1) * 10) / 10 : Math.floor(num * 10) / 10;
    return roundedNum.toString();
  }
}
