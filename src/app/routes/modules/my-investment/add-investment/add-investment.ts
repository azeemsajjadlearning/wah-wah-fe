import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { InvestmentService } from 'src/app/services/investment.service';

@Component({
    templateUrl: 'add-investment.html',
    standalone: false
})
export class AddInvestment implements OnInit {
  form: FormGroup;
  mutualFundList: any[];

  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<AddInvestment>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private investmentService: InvestmentService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeForm();

    this.form
      .get('scheme_code')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((val) => this.investmentService.searchMF(val))
      )
      .subscribe((res) => {
        this.mutualFundList = res.result;
      });
  }

  private initializeForm() {
    const formData = {
      scheme_code: [null, Validators.required],
      type: [null, Validators.required],
      date: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
    };

    this.form = this.fb.group(formData);

    if (this.data) {
      this.form.get('scheme_code')?.setValue(this.data.detail.scheme_code);
      this.form.get('type')?.setValue('sip');

      if (this.data.type == 'Edit') {
        this.form.get('date')?.setValue(new Date(this.data.detail.date));
        this.form.get('amount')?.setValue(this.data.detail.amount);
      }
    }
  }

  onFormSubmit() {
    if (!this.data) {
      let obj = {
        scheme_code: this.mutualFundList.find(
          (ele) => ele.schemeName == this.form.get('scheme_code')?.value
        )?.schemeCode,
        type: this.form.get('type')?.value,
        date: this.form.get('date')?.value,
        amount: this.form.get('amount')?.value,
      };

      this.investmentService
        .createNewInvestment(obj)
        .pipe(
          catchError((err) => {
            const errorMessage =
              err.error?.err?.message ||
              err.error?.error ||
              'Something went wrong!';

            this.showErrorMessage(errorMessage);

            throw new Error(err);
          })
        )
        .subscribe((res) => {
          if (res.success) {
            this.dialogRef.close(res);
          } else {
            this.showErrorMessage(res.error || 'Something went wrong!');
          }

          this.form.reset();
        });
    } else {
      if (this.data.type == 'Add') {
        let obj = {
          scheme_code: this.form.get('scheme_code')?.value,
          date: this.form.get('date')?.value,
          amount: this.form.get('amount')?.value,
        };

        this.investmentService
          .addInvestment(obj)
          .pipe(
            catchError((err) => {
              const errorMessage =
                err.error?.err?.message ||
                err.error?.error ||
                'Something went wrong!';

              this.showErrorMessage(errorMessage);

              throw new Error(err);
            })
          )
          .subscribe((res) => {
            if (res.success) {
              this.dialogRef.close(res);
            } else {
              this.showErrorMessage(res.error || 'Something went wrong!');
            }

            this.form.reset();
          });
      } else {
        this.form.addControl('id', new FormControl(this.data.detail._id));

        this.investmentService
          .updateInvestment(this.form.value)
          .subscribe((res) => {
            if (res.success) {
              this.dialogRef.close(res);
            } else {
              this.showErrorMessage(res.error || 'Something went wrong!');
            }

            this.form.reset();
          });
      }
    }
  }

  private showErrorMessage(errorMessage: string) {
    this.confirmationService.open({
      title: 'Error',
      icon: { color: 'warn', name: 'error', show: true },
      message: errorMessage,
      dismissible: false,
      actions: {
        confirm: { label: 'Ok!', color: 'warn', show: true },
        cancel: { show: false },
      },
    });
  }
}
