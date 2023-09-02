import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FundDetails, FundGraph, Holding } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';
import { Chart } from 'chart.js';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.scss'],
})
export class FundDetailsComponent {
  searchId: string;
  fundDetail: FundDetails;
  fundGraph: FundGraph;
  holdings: Holding[];
  months: number = 36;

  investment: FormGroup;

  constructor(
    private activatedRoutes: ActivatedRoute,
    private stockService: StockService,
    private fb: FormBuilder
  ) {
    this.activatedRoutes.queryParams.subscribe((res: any) => {
      this.searchId = res.search_id;
    });
  }

  chart: any;

  ngOnInit() {
    this.stockService.getMFInfo(this.searchId).subscribe((res) => {
      this.fundDetail = res.result;
      this.holdings = res.result.holdings.slice(0, 10);
      this.getChart(this.months);

      this.investment = this.fb.group({
        type: 'sip',
        amount: 10,
        time: '1',
      });

      this.investment.valueChanges.subscribe((val) => {
        console.log(this.getReturn(val.type, val.amount, val.time));
      });

      console.log(res.result);

      this.stockService
        .getMFDetails(this.fundDetail.isin, this.fundDetail.scheme_type)
        .subscribe((resp) => {
          console.log(resp.result);
        });
    });
  }

  getChart(months: number) {
    this.months = months;

    this.stockService
      .getMFGraph(this.fundDetail.scheme_code, this.months)
      .subscribe((res) => {
        this.fundGraph = res.result;

        let dates = this.fundGraph.folio.data.map((ele) => {
          return this.formatDate(ele[0]);
        });
        let nav = this.fundGraph.folio.data.map((ele) => {
          return ele[1];
        });

        this.chart?.destroy();

        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: dates,
            datasets: [
              {
                data: nav,
                fill: false,
                borderColor: nav[0] < nav[nav.length - 1] ? 'green' : 'red',
                radius: 0,
              },
            ],
          },
          options: {
            legend: {
              display: false,
            },
            aspectRatio: 2.5,
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                  display: false,
                },
              ],
              yAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                  display: false,
                },
              ],
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
          },
        });
      });
  }

  getAllHoldings() {
    this.holdings.length == 10
      ? (this.holdings = this.fundDetail.holdings)
      : (this.holdings = this.fundDetail.holdings.slice(0, 10));
  }

  private formatDate(timestamp: number) {
    const date = new Date(timestamp);

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;
    return formattedDate;
  }

  private getReturn(type: string, amount: number, time: string): any {
    amount = amount * (type == 'sip' ? 500 : 1000);
    let rate;
    switch (time) {
      case '1': {
        rate = this.fundDetail.return_stats[0].return1y;
        break;
      }
      case '3': {
        rate = this.fundDetail.return_stats[0].return3y;
        break;
      }
      case '5': {
        rate = this.fundDetail.return_stats[0].return5y;
        break;
      }
      default: {
        rate = 0;
        break;
      }
    }
    if (type === 'sip') {
      if (rate != null)
        return amount * Math.pow(1 + rate / 12 / 100, 12 * +time);
    } else {
      if (rate != null) return amount * Math.pow(1 + rate / 100, +time);
    }
  }
}
