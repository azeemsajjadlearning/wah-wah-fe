import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PNRStatus } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-pnr',
  templateUrl: './pnr.component.html',
  styleUrls: ['./pnr.component.scss'],
})
export class PNRComponent {
  form: FormGroup;
  pnrStatus: PNRStatus;

  constructor(private fb: FormBuilder, private trainService: TrainService) {}

  ngOnInit() {
    this.form = this.fb.group({
      pnr: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
    });
  }

  onFormSubmit() {
    this.trainService
      .getPNRStatus(this.form.get('pnr')?.value)
      .subscribe((res) => {
        this.pnrStatus = res.result;
      });
  }
}
