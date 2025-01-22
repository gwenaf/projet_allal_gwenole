import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalRound',
  standalone: true
})
export class DecimalRoundPipe implements PipeTransform {
  transform(value: number, decimals: number = 2): number {
    if (!value) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
