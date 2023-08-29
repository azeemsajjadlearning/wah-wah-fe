import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionType, PopularMutualFund } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent {
  search: FormControl = new FormControl(null);
  popularMF: PopularMutualFund[];

  constructor(private stockService: StockService, private router: Router) {}

  ngOnInit() {
    this.stockService.getPopularMF().subscribe((res) => {
      this.popularMF = res.result;
    });
  }

  searchFund() {
    this.router.navigate(['stock/list'], {
      queryParams: {
        type: 'search',
        q: this.search.value,
      },
    });
  }

  getCollection(type: CollectionType) {
    this.router.navigate(['stock/list'], {
      queryParams: {
        type: 'collection',
        q: type,
      },
    });
  }

  getFund(ele: any) {
    this.router.navigate(['stock/fund-details'], {
      queryParams: { search_id: ele.search_id },
    });
  }
}
