import { Component } from '@angular/core';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
})
export class AvailabilityComponent {
  constructor(private trainService: TrainService) {}

  ngOnInit() {}
}
