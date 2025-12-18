// src/app/pipes/ordinal.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordinal',
  standalone: true
})
export class OrdinalPipe implements PipeTransform {
  transform(n: number | string): string {
    const s = n.toString();
    if (['11', '12', '13'].includes(s)) return s + 'th';
    const lastDigit = s.slice(-1);
    switch (lastDigit) {
      case '1': return s + 'st';
      case '2': return s + 'nd';
      case '3': return s + 'rd';
      default: return s + 'th';
    }
  }
}
