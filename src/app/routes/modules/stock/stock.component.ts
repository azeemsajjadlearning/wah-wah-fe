import { Component } from '@angular/core';
import { CollectionType } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent {
  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.stockService.getPopularMF().subscribe((res) => {
      console.log(res.result);
    });

    this.stockService.searchMF('canara').subscribe((res) => {
      console.log(res.result);
    });

    this.stockService
      .getMFInfo('quant-small-cap-fund-direct-plan-growth')
      .subscribe((res) => {
        console.log(res.result);
      });

    this.stockService.getMFGraph('120828').subscribe((res) => {
      console.log(res.result);
    });

    this.stockService
      .getMFDetails('INF966L01689', 'Growth')
      .subscribe((res) => {
        console.log(res.result);
      });
  }

  getCollection(type: CollectionType) {
    this.stockService.getCollection(type).subscribe((res) => {
      console.log(res.result);
    });
  }
}
