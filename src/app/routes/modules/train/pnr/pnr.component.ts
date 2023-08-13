import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-pnr',
  templateUrl: './pnr.component.html',
  styleUrls: ['./pnr.component.scss'],
})
export class PNRComponent {
  pnrForm: FormGroup;

  pnrStatus: any;

  constructor(private fb: FormBuilder, private trainService: TrainService) {}

  ngOnInit() {
    this.pnrForm = this.fb.group({
      pnr: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  onSubmitPNRForm() {
    this.pnrStatus = null;
    this.trainService
      .getPNRStatus(this.pnrForm.get('pnr')?.value)
      .subscribe((res) => {
        this.pnrStatus = res.result;
      });
  }
}
