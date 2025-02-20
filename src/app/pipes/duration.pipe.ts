import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration',
    standalone: false
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    const [hours, minutes] = value.split(':');
    return `${parseInt(hours, 10)} hr ${parseInt(minutes, 10)} min`;
  }
}
