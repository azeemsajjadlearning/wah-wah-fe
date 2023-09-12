import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Investment } from 'src/app/models/investment';
import { InvestmentService } from 'src/app/services/investment.service';
import { AddInvestment } from './add-investment/add-investment';
import { xirr, convertRate } from 'node-irr';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { AllInvestment } from './all-investment/all-investment';

@Component({
  selector: 'app-my-investment',
  templateUrl: './my-investment.component.html',
  styleUrls: ['./my-investment.component.scss'],
})
export class MyInvestmentComponent {
  investment: Investment[];
  filteredInvestment: Investment[];
  totalInvestment: number;
  totalReturn: number;
  totalXIRR: number;

  displayedColumns = ['schema_name', 'return', 'current', 'options'];

  constructor(
    private investmentService: InvestmentService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getInvestment();
  }

  getInvestment() {
    this.totalInvestment = 0;
    this.totalReturn = 0;

    this.investmentService.getAllInvestment().subscribe((res) => {
      this.investment = res.data;

      this.filteredInvestment = this.calculateTotalInvestmentAndReturn(
        res.data
      );

      this.filteredInvestment.forEach((ele) => {
        // @ts-ignore
        this.totalInvestment += ele.total_amount_invested;
        // @ts-ignore
        this.totalReturn += +ele.total_return;
      });

      this.totalXIRR = this.calculateXIRR(this.investment);
    });
  }

  addInvestment() {
    const dialogRef = this.dialog.open(AddInvestment, {
      width: '90%',
      maxWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp.success) {
        this.getInvestment();

        this.confirmationService.open({
          title: 'Successful',
          message:
            'Wait for 5 min updating your data feel free to add more investment!',
          icon: {
            name: 'done',
            color: 'success',
            show: true,
          },
          actions: {
            confirm: {
              label: 'Ok!',
            },
            cancel: {
              show: false,
            },
          },
          dismissible: true,
        });
      }
    });
  }

  addMoreInvestment(investment: Investment) {
    const dialogRef = this.dialog.open(AddInvestment, {
      data: investment,
      width: '90%',
      maxWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp.success) {
        this.getInvestment();

        this.confirmationService.open({
          title: 'Successful',
          message:
            'Wait for 5 min updating your data feel free to add more investment!',
          icon: {
            name: 'done',
            color: 'success',
            show: true,
          },
          actions: {
            confirm: {
              label: 'Ok!',
            },
            cancel: {
              show: false,
            },
          },
          dismissible: true,
        });
      }
    });
  }

  getDetail(investment: Investment) {
    const detailInvestment = this.investment.filter(
      (ele) => ele.schema_id === investment.schema_id
    );

    this.dialog.open(AllInvestment, { data: detailInvestment, width: '90%' });
  }

  private calculateTotalInvestmentAndReturn(investments: Investment[]) {
    const schemaIdMap = new Map();

    for (const investment of investments) {
      const { schema_id, amount, current_value, ...rest } = investment;

      if (!schemaIdMap.has(schema_id)) {
        schemaIdMap.set(schema_id, {
          schema_id: schema_id,
          total_amount_invested: 0,
          total_return: 0,
          ...rest,
        });
      }

      const schemaData = schemaIdMap.get(schema_id);
      schemaData.total_amount_invested += amount;
      // @ts-ignore
      schemaData.total_return += parseFloat(current_value);
    }

    return Array.from(schemaIdMap.values());
  }

  private calculateXIRR(investmentData: any[]): any {
    const cashFlows = investmentData.map((item) => {
      const date = new Date(item.date);
      const amount = -item.amount;
      return { date, amount };
    });

    cashFlows.push({ date: new Date(), amount: this.totalReturn });

    return convertRate(xirr(cashFlows).rate, 365);
  }
}
