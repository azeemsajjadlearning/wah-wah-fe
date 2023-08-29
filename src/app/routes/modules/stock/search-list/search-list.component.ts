import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CollectionList,
  CollectionType,
  SearchList,
} from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
})
export class SearchListComponent {
  type: string;
  query: CollectionType;
  searchList: SearchList;
  collectionList: CollectionList;

  displayedSearchColumns: string[] = ['scheme_name', 'type'];
  displayedCollectionColumns: string[] = ['scheme_name', '1y', '3y', '5y'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private stockService: StockService,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.type = res.type;
      this.query = res.q;
    });
  }

  ngOnInit() {
    if (this.type == 'search') {
      this.stockService.searchMF(this.query).subscribe((resp) => {
        this.searchList = resp.result;
      });
    } else if (this.type == 'collection') {
      this.stockService.getCollection(this.query).subscribe((res) => {
        this.collectionList = res.result;
      });
    }
  }

  getFund(fund: any) {
    this.router.navigate(['stock/fund-details'], {
      queryParams: { search_id: fund.search_id },
    });
  }
}
