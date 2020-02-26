import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'count' })
export class CountPipe implements PipeTransform {
  transform(value: any): number {
    if (value) {
      return value.length;
    }
    return 0;
  }
}
