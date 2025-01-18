import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, debounceTime } from 'rxjs';
import { SalaryService } from 'src/app/services/salary.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
})
export class SalaryComponent implements OnInit {
  salaryForm: FormGroup;
  deductionForm: FormGroup;
  selectedYear: FormControl;
  metroCity: FormControl = new FormControl(false);
  regime: FormControl = new FormControl(false);
  sd: number = 50000;
  yearList: string[] = [];
  monthList: string[] = [];
  minDate: Date;
  maxDate: Date;

  constructor(private fb: FormBuilder, private salaryService: SalaryService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.yearList = this.generateYearList();
    this.monthList = this.financialYearMonths(this.selectedYear.value);

    this.selectedYear.valueChanges.subscribe((year) => {
      this.monthList = this.financialYearMonths(year);
      this.resetForm();
      this.getSalaries(year);
      this.getDeductions(year);
    });

    this.salaryForm.valueChanges.pipe(debounceTime(1000)).subscribe((val) => {
      if (this.salaryForm.valid) {
        this.salaryService.saveSalary(val).subscribe(
          () => {},
          (error) => {
            console.error('Error saving salary:', error);
          }
        );
      }
    });

    this.deductionForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((val) => {
        this.calculateIncomeTax();
        this.saveDeductions();
      });

    this.regime.valueChanges.subscribe((val) => {
      if (val) this.sd = 75000;
      else this.sd = 50000;
      this.saveDeductions();
    });

    this.metroCity.valueChanges.subscribe(() => this.saveDeductions());

    this.getSalaries(this.selectedYear.value);
    this.getDeductions(this.selectedYear.value);
  }

  calculateIncomeTax() {
    let income =
      this.calculateTotal('basic') +
      this.calculateTotal('hra') +
      this.calculateTotal('lta') +
      this.calculateTotal('sa') +
      this.calculateTotal('bonus');

    let tax = 0;

    const oldRegimeSlabs = [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    const newRegimeSlabs = [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 0.05 },
      { limit: 900000, rate: 0.1 },
      { limit: 1200000, rate: 0.15 },
      { limit: 1500000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    const isOldRegime = !this.regime?.value;
    let standardDeduction = 50000;

    if (!isOldRegime && income > 1550000) {
      standardDeduction = 75000;
    }

    const totalDeductions =
      standardDeduction +
      this.deductionForm.get('elss')?.value +
      this.deductionForm.get('nps')?.value +
      this.deductionForm.get('mi')?.value +
      this.calculateTotal('interestPaid');

    const taxableIncome = isOldRegime
      ? income - totalDeductions - this.calculateHRA()
      : income;

    const slabs = isOldRegime ? oldRegimeSlabs : newRegimeSlabs;

    let previousLimit = 0;

    for (const slab of slabs) {
      if (taxableIncome > previousLimit) {
        const taxableAmount =
          Math.min(taxableIncome, slab.limit) - previousLimit;
        tax += taxableAmount * slab.rate;
        previousLimit = slab.limit;
      } else {
        break;
      }
    }

    if (!isOldRegime) {
      if (taxableIncome <= 700000) {
        const rebate = Math.min(tax, 25000);
        tax -= rebate;
      }
    } else {
      if (taxableIncome <= 500000) {
        const rebate = Math.min(tax, 12500);
        tax -= rebate;
      }
    }

    tax = Math.max(tax, 0) * 1.04;

    return tax;
  }

  onMonthChange(event: any, index: number) {
    const selectedMonth = event.value;
    const [month, year] = selectedMonth.split('-');
    const monthIndex = this.getMonthIndex(month);

    if (monthIndex !== -1) {
      const lastDate = this.getLastDateOfMonth(monthIndex, parseInt(year));
      const dateControl = this.salaryBreakups.at(index).get('date');
      dateControl?.setValue(lastDate);
    }
  }

  donwloadSheet() {}

  private getMonthIndex(month: string): number {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames.indexOf(month);
  }

  private getLastDateOfMonth(month: number, year: number): Date {
    return new Date(year, month + 1, 0);
  }

  private initializeForm(): void {
    this.selectedYear = new FormControl(
      this.getCurrentFinancialYear(),
      Validators.required
    );
    this.salaryForm = this.fb.group({
      salaryBreakups: this.fb.array([this.createSalaryFormGroup()]),
    });
    this.deductionForm = this.fb.group({
      elss: null,
      nps: null,
      mi: null,
      lta: null,
    });
  }

  private resetForm(): void {
    this.salaryForm.reset();
    this.salaryBreakups.clear();
    this.salaryBreakups.push(this.createSalaryFormGroup());
  }

  private getSalaries(year: string): void {
    this.salaryService.getSalary(year).subscribe(
      (resp) => {
        if (resp && resp.data.length > 0) {
          this.populateSalaryForm(resp.data);
        }
      },
      (error) => {
        console.error('Error fetching salaries:', error);
      }
    );
  }

  private getDeductions(year: string): void {
    this.salaryService
      .getDeductions(year)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((resp) => {
        this.populateDeductions(resp.data);
      });
  }

  private populateSalaryForm(salaries: any[]): void {
    this.salaryBreakups.clear();
    for (const salary of salaries) {
      this.salaryBreakups.push(this.createSalaryFormGroup(salary));
    }
  }

  private saveDeductions(): void {
    const val = {
      ...this.deductionForm.value,
      year: this.selectedYear.value,
      metro: this.metroCity.value,
      regime: this.regime.value,
    };

    this.salaryService.saveDeductions(val).subscribe({
      error: (error) => console.error('Error saving deductions:', error),
    });
  }

  private populateDeductions(deduction: any): void {
    this.deductionForm.reset();
    this.deductionForm.get('elss')?.setValue(deduction[0].elss);
    this.deductionForm.get('nps')?.setValue(deduction[0].nps);
    this.deductionForm.get('mi')?.setValue(deduction[0].mi);
    this.deductionForm.get('lta')?.setValue(deduction[0].lta);
    this.metroCity.reset();
    this.metroCity.setValue(deduction[0].metro);
    this.regime.reset();
    this.regime.setValue(deduction[0].regime);
  }

  private createSalaryFormGroup(data: any = {}): FormGroup {
    return this.fb.group({
      id: [data._id || null],
      month: [data.month || null, Validators.required],
      date: [data.date || null, Validators.required],
      basic: [data.basic || null, Validators.required],
      hra: [data.hra || null, Validators.required],
      lta: [data.lta || null],
      sa: [data.sa || null],
      pt: [data.pt || null],
      tds: [data.tds || null],
      epf: [data.epf || null],
      bonus: [data.bonus || null],
      rentPaid: [data.rentPaid || null],
      interestPaid: [data.interestPaid || null],
    });
  }

  get salaryBreakups(): FormArray {
    return this.salaryForm.get('salaryBreakups') as FormArray;
  }

  addSalaryBreakup(): void {
    this.salaryBreakups.push(this.createSalaryFormGroup());
  }

  removeSalaryBreakup(index: number, ele: any): void {
    if (this.salaryBreakups.length > 1) {
      this.salaryBreakups.removeAt(index);
      this.salaryService.deleteSalary(ele.value.id).subscribe();
    }
  }

  calculateTotal(controlName: string): number {
    return this.salaryBreakups.controls
      .map((salary) => salary.get(controlName)?.value || 0)
      .reduce((acc, value) => acc + value, 0);
  }

  getPreviousMonthDate(date: Date) {
    if (date) {
      const previousMonthDate = new Date(date);
      previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
      return previousMonthDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } else return null;
  }

  calculateHRA() {
    let data = this.salaryForm.get('salaryBreakups')?.value;

    const metroPercentage = this.metroCity?.value ? 0.5 : 0.4;

    const totalHraExemption = data.reduce((total: any, entry: any) => {
      const { hra, rentPaid, basic } = entry;

      const rentPaidMinus10PercentBasic = rentPaid - 0.1 * basic;
      const halfBasic = metroPercentage * basic;

      const hraExemption = Math.min(
        hra,
        rentPaidMinus10PercentBasic,
        halfBasic
      );

      return total + hraExemption;
    }, 0);

    return totalHraExemption;
  }

  private generateYearList(decreasing: boolean = true): string[] {
    const currentYear = new Date().getFullYear();
    const yearList: string[] = [];

    for (let year = 2000; year <= currentYear; year++) {
      const nextYear = year + 1;
      yearList.push(`${year}-${nextYear}`);
    }

    return decreasing ? yearList.reverse() : yearList;
  }

  private getCurrentFinancialYear(): string {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let startYear: number;
    if (month < 3) {
      startYear = currentYear - 1;
    } else {
      startYear = currentYear;
    }

    const endYear = startYear + 1;
    return `${startYear}-${endYear}`;
  }

  private financialYearMonths(financialYear: string) {
    const [startYear, endYear] = financialYear.split('-').map(Number);
    const months = [
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
      'January',
      'February',
      'March',
    ];

    const result = [];

    for (let i = 0; i < months.length; i++) {
      const year = i < 9 ? startYear : endYear;
      result.push(`${months[i]}-${year}`);
    }

    return result;
  }
}
