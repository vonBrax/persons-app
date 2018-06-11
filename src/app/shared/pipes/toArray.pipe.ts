import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toArray' })
export class ToArrayPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const arr = [];
    for (const name in value) {
      if (value.hasOwnProperty(name)) {
        arr.push({ name, value: value[name] });
      }
    }
    return arr;
  }
}
