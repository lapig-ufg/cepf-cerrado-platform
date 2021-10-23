import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterArray',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter((item) => {
            return this.normalize(item.title).includes(this.normalize(filter))
                ||  this.normalize(item.keys).includes(this.normalize(filter));
        });
    }
    normalize(value): string {
        return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}