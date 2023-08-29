import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FundDetails, FundGraph } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.scss'],
})
export class FundDetailsComponent {
  searchId: string;
  fundDetail: FundDetails;
  fundGraph: FundGraph;

  constructor(
    private activatedRoutes: ActivatedRoute,
    private stockService: StockService
  ) {
    this.activatedRoutes.queryParams.subscribe((res: any) => {
      this.searchId = res.search_id;
    });
  }

  ngOnInit() {
    this.stockService.getMFInfo(this.searchId).subscribe((res) => {
      this.fundDetail = res.result;
      console.log(this.fundDetail);

      this.stockService
        .getMFGraph(this.fundDetail.scheme_code)
        .subscribe((res) => {
          this.fundGraph = res.result;
          console.log(this.fundGraph);
        });
    });
  }
}
