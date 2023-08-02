import { Component } from '@angular/core';
import { MyInvestment } from 'src/app/models/third-party';
import { ThirdPartyService } from 'src/app/services/third-party.service';

@Component({
  selector: 'app-my-investment',
  templateUrl: './my-investment.component.html',
  styleUrls: ['./my-investment.component.scss'],
})
export class MyInvestmentComponent {
  constructor(private thirdPartyService: ThirdPartyService) {}

  myInvestment: MyInvestment[];

  displayedColumns = [
    'fund_name',
    'investing_date',
    'invested',
    'value',
    'today_value',
    'return',
    'return_percentage',
    'total',
    'cagr',
  ];

  ngOnInit() {
    this.thirdPartyService.getMyInvestment().subscribe((res) => {
      this.myInvestment = res.result;
    });
  }
}
