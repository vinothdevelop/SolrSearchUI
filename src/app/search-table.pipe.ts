import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTable'
})
export class SearchTablePipe implements PipeTransform {

  public transform(value, keys: Array<string>, term: string) {
    if (!term) { return value; }
    return (value || []).filter((item) => keys.some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

  }

}
