// src/app/pipes/space.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'space',
  standalone: true
})
export class SpacePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim();
  }
}
