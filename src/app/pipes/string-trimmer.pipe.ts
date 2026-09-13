import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringTrimmer',
  standalone: true
})
export class StringTrimmerPipe implements PipeTransform {
  transform(value: string, length: number): string {
    if (!value) {
      return '';
    }

    if (value.length > length) {
      return value.slice(0, length) + '...';
    }

    return value;
  }
}
