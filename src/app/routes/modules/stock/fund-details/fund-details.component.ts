import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FundDetails, FundGraph, Holding } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';
import { Chart } from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  return = null;
  returnChart: any;
  equityShare: any = [];
  equityShareChart: any;

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

  ngOnInit() {
    this.stockService.getMFInfo(this.searchId).subscribe((res) => {
      this.fundDetail = res.result;
      this.holdings = res.result.holdings.slice(0, 10);
      this.getChart(this.months);
      this.getEquity(res.result.holdings);

      this.investment = this.fb.group({
        type: 'sip',
        amount: 10,
        time: '1',
      });

      this.investment.valueChanges.subscribe((val) => {
        this.return = this.getReturn(val.type, val.amount, val.time);
      });

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

        this.returnChart?.destroy();

        this.returnChart = new Chart('canvas', {
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

  getEquity(holdings: Holding[]) {
    const validSectors = [
      'Construction',
      'Metals & Mining',
      'Healthcare',
      'Financial',
      'Consumer Staples',
      'Services',
      'Chemicals',
    ];

    holdings.forEach((item) => {
      const sectorName = item.sector_name || 'Others';

      if (validSectors.includes(sectorName)) {
        if (this.equityShare[sectorName]) {
          this.equityShare[sectorName]++;
        } else {
          this.equityShare[sectorName] = 1;
        }
      } else {
        if (this.equityShare['Others']) {
          this.equityShare['Others']++;
        } else {
          this.equityShare['Others'] = 1;
        }
      }
    });

    this.equityShareChart = new Chart('canvasEquity', {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.equityShare),
        datasets: [
          {
            data: Object.values(this.equityShare) as number[],
            backgroundColor: this.generateDistinctColors(
              Object.keys(this.equityShare).length
            ),
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
      },
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

  private generateDistinctColors(n: number) {
    const distinctColors = [
      '#FF5733',
      '#33FF57',
      '#5733FF',
      '#FF33A6',
      '#33A6FF',
      '#A6FF33',
      '#FF3366',
      '#3366FF',
      '#66FF33',
      '#FF3366',
      '#3366FF',
      '#66FF33',
      '#FFCC33',
      '#33CCFF',
      '#CC33FF',
      '#FF9933',
      '#33FF99',
      '#9933FF',
      '#FF33CC',
      '#33CCFF',
      '#CC33FF',
      '#FFFF33',
      '#33FFFF',
      '#FF33FF',
      '#33FF33',
    ];

    if (n <= distinctColors.length) {
      return distinctColors.slice(0, n);
    } else {
      const generatedColors = [];
      for (let i = 0; i < n; i++) {
        const randomColor =
          '#' + Math.floor(Math.random() * 16777215).toString(16);
        generatedColors.push(randomColor);
      }
      return generatedColors;
    }
  }
}
