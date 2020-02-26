import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    filter = filter.trim();
    return items.filter(
      item =>
        item.email.indexOf(filter) !== -1 ||
        item.fullName.indexOf(filter) !== -1
    );
  }
}
