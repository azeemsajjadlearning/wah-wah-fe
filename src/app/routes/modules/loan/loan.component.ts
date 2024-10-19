import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'loan.component.html',
})
export class LoanComponent implements OnInit {
  loanForm: FormGroup;
  prepaymentForm: FormGroup;
  amortizationTable: any[] = [];
  displayedColumns: string[] = [
    'index',
    'date',
    'rate',
    'emi',
    'interest',
    'principal',
    'balance',
    'repayment',
  ];

  constructor(private fb: FormBuilder) {
    this.loanForm = this.fb.group({
      loanAmount: [null, [Validators.required, Validators.min(1)]],
      tenure: [null, [Validators.required, Validators.min(1)]],
      tenureUnit: ['years', Validators.required], // Added tenure unit
      rate: [null, [Validators.required, Validators.min(0.01)]],
      firstPaymentDate: [null, Validators.required],
    });

    this.prepaymentForm = this.fb.group({
      prepaymentDate: [null, Validators.required],
      prepaymentAmount: [10000, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loanForm.valid) {
      this.generateAmortizationTable();
    }
  }

  generateAmortizationTable() {
    const loanAmount = this.loanForm.value.loanAmount;
    let tenure = this.loanForm.value.tenure;
    const tenureUnit = this.loanForm.value.tenureUnit;
    const rate = this.loanForm.value.rate;
    const firstPaymentDate = this.loanForm.value.firstPaymentDate;

    // Convert years to months if tenure is given in years
    if (tenureUnit === 'years') {
      tenure *= 12;
    }

    const monthlyRate = rate / 100 / 12;
    const monthlyEMI =
      (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure));
    let balance = loanAmount;
    let date = new Date(firstPaymentDate);

    this.amortizationTable = [];

    for (let i = 0; i < tenure; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyEMI - interest;
      balance -= principal;

      this.amortizationTable.push({
        date: new Date(date),
        rate: rate,
        emi: monthlyEMI,
        interest: interest,
        principal: principal,
        balance: balance,
      });

      // Increment the date by 1 month
      date.setMonth(date.getMonth() + 1);
    }
  }

  applyPrepayment() {
    if (this.prepaymentForm.valid) {
      let prepaymentDate = new Date(this.prepaymentForm.value.prepaymentDate);
      const prepaymentAmount = this.prepaymentForm.value.prepaymentAmount;

      const index = this.amortizationTable.findIndex(
        (row) => new Date(row.date).getTime() >= prepaymentDate.getTime()
      );

      if (index !== -1 && this.amortizationTable[index].balance > 0) {
        if (
          new Date(this.amortizationTable[index].date).getTime() >
          prepaymentDate.getTime()
        ) {
          prepaymentDate = this.addTime(prepaymentDate);
          this.amortizationTable.splice(index, 0, {
            date: prepaymentDate.toISOString().split('T')[0],
            emi: 0,
            interest: 0,
            principal: 0,
            repayment: prepaymentAmount,
            balance: this.amortizationTable[index].balance - prepaymentAmount,
          });

          if (this.amortizationTable[index].balance < 0) {
            this.amortizationTable[index].balance = 0;
          }
        } else {
          this.amortizationTable[index].repayment = prepaymentAmount;
          this.amortizationTable[index].balance -= prepaymentAmount;
          if (this.amortizationTable[index].balance < 0) {
            this.amortizationTable[index].balance = 0;
          }
        }

        let balance = this.amortizationTable[index].balance;
        const ratePerMonth = this.loanForm.value.rate / 100 / 12;

        for (let i = index + 1; i < this.amortizationTable.length; i++) {
          if (balance <= 0) {
            this.amortizationTable[i].emi = 0;
            this.amortizationTable[i].interest = 0;
            this.amortizationTable[i].principal = 0;
            this.amortizationTable[i].balance = 0;
            break;
          }

          const interest = balance * ratePerMonth;
          const principal = this.amortizationTable[i].emi - interest;
          balance -= principal;

          this.amortizationTable[i].interest = interest;
          this.amortizationTable[i].principal = principal;
          this.amortizationTable[i].balance = balance > 0 ? balance : 0;
        }

        const lastNonZeroIndex = this.amortizationTable.findIndex(
          (row) => row.balance <= 0
        );
        if (lastNonZeroIndex !== -1) {
          this.amortizationTable = this.amortizationTable.slice(
            0,
            lastNonZeroIndex + 1
          );
        }

        this.prepaymentForm.reset();
      }
    }
  }

  private addTime(date: Date): Date {
    const hoursToAdd = 5;
    const minutesToAdd = 30;

    const newDate = new Date(date.getTime());

    newDate.setHours(newDate.getHours() + hoursToAdd);
    newDate.setMinutes(newDate.getMinutes() + minutesToAdd);

    return newDate;
  }
}
