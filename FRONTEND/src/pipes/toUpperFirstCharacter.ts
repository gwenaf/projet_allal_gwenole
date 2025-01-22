import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toUpperFirstCharacter',
  standalone: true
})
export class ToUpperFirstCharacterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
