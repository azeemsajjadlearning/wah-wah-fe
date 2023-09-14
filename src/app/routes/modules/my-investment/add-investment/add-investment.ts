import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, debounceTime, finalize, switchMap } from 'rxjs/operators';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { Investment } from 'src/app/models/investment';
import { Content } from 'src/app/models/stock';
import { InvestmentService } from 'src/app/services/investment.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  templateUrl: 'add-investment.html',
})
export class AddInvestment implements OnInit {
  form: FormGroup;
  mutualFundList: Content[];

  today = new Date();

  constructor(
    public dialogRef: MatDialogRef<AddInvestment>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private investmentService: InvestmentService,
    private stockService: StockService,
    private confirmationService: ConfirmationService
  ) {
    console.log(this.data);
  }

  ngOnInit() {
    this.initializeForm();

    this.form
      .get('schema_code')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((val) => this.stockService.searchMF(val))
      )
      .subscribe((res) => {
        this.mutualFundList = res.result.content.filter(
          (ele: any) => ele.fund_name
        );
      });
  }

  private initializeForm() {
    const formData = {
      schema_code: [null, Validators.required],
      type: [null, Validators.required],
      date: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
    };

    this.form = this.fb.group(formData);

    console.log(this.data.detail);

    if (this.data) {
      this.form.get('schema_code')?.setValue(this.data.detail.schema_code);
      this.form.get('type')?.setValue('sip');

      if (this.data.type == 'Edit') {
        this.form.get('date')?.setValue(new Date(this.data.detail.date));
        this.form.get('amount')?.setValue(this.data.detail.amount);
      }
    }
    console.log(this.form.value);
  }

  onFormSubmit() {
    if (!this.data) {
      this.form
        .get('schema_code')
        ?.setValue(this.mutualFundList[0]?.scheme_code);

      this.investmentService
        .createNewInvestment(this.form.value)
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
        this.investmentService
          .addInvestment(this.form.value)
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
