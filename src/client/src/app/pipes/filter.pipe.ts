import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterArray',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.title.indexOf(filter.title) !== -1);
    }
}