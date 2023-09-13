import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    @Inject(MAT_DIALOG_DATA) public data: Investment,
    private fb: FormBuilder,
    private investmentService: InvestmentService,
    private stockService: StockService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.initializeForm();

    this.form
      .get('schema_id')
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
      schema_id: [null, Validators.required],
      type: [null, Validators.required],
      date: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
    };

    this.form = this.fb.group(formData);

    if (this.data) {
      this.form.get('schema_id')?.setValue(this.data.schema_id);
      this.form.get('type')?.setValue('sip');
    }
  }

  onFormSubmit() {
    if (!this.data) {
      this.form.get('schema_id')?.setValue(this.mutualFundList[0]?.search_id);
    }

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
