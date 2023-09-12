import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, interval, Subscription } from 'rxjs';
import {
  CollectionType,
  LiveStock,
  PopularMutualFund,
} from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, OnDestroy {
  search: FormControl = new FormControl(null);
  popularMF: PopularMutualFund[] = [];
  liveStatus: LiveStock[] = [];
  allIndices: any;
  private refreshSubscription: Subscription;

  constructor(private stockService: StockService, private router: Router) {}

  ngOnInit() {
    this.loadData();
    this.refreshSubscription = interval(5000)
      .pipe(
        switchMap(() =>
          forkJoin([
            this.stockService.getPopularMF(),
            this.stockService.getLatestAggregate(),
            this.stockService.getAllIndices(),
          ])
        )
      )
      .subscribe(([popularMFResponse, liveStatusResponse, allIndices]) => {
        this.popularMF = popularMFResponse.result;
        this.liveStatus = liveStatusResponse.result;
        this.allIndices = allIndices.result;

        console.log(this.allIndices);
      });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadData() {
    forkJoin([
      this.stockService.getPopularMF(),
      this.stockService.getLatestAggregate(),
    ]).subscribe(([popularMFResponse, liveStatusResponse]) => {
      this.popularMF = popularMFResponse.result;
      this.liveStatus = liveStatusResponse.result;
    });
  }

  searchFund() {
    this.navigateToStockList({ type: 'search', q: this.search.value });
  }

  getCollection(type: CollectionType) {
    this.navigateToStockList({ type: 'collection', q: type });
  }

  getFund(ele: any) {
    this.router.navigate(['stock/fund-details'], {
      queryParams: { search_id: ele.search_id },
    });
  }

  private navigateToStockList(queryParams: { type: string; q: any }) {
    this.router.navigate(['stock/list'], { queryParams });
  }
}
