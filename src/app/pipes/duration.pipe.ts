import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    const [hours, minutes] = value.split(':');
    return `${parseInt(hours, 10)}hrs ${parseInt(minutes, 10)}mins`;
  }
}
