import { Pipe, PipeTransform } from '@angular/core';

const MAX_USER_NAME_LENGTH = 30;

@Pipe({
  name: 'nameFormatter',
  standalone: true
})
export class NameFormatterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    if (value.length > MAX_USER_NAME_LENGTH) {
      return value.slice(0, MAX_USER_NAME_LENGTH) + '...';
    }

    return value;
  }
}
