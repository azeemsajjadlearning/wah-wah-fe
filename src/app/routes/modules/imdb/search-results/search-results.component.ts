import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { SearchResult } from 'src/app/models/imdb';
import { GeneralService } from 'src/app/services/general.service';
import { IMDbService } from 'src/app/services/imdb.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  query: string;
  category: string[] = [];
  serachResults: SearchResult[];

  imageUrlPrefix: string = environment.imdb_image_prefix;
  defaultImage = '../../../../../assets/svg/default.svg';

  constructor(
    private activatedRoutes: ActivatedRoute,
    private imdbService: IMDbService,
    private generalService: GeneralService,
    private router: Router
  ) {
    this.activatedRoutes.queryParams.subscribe((res: any) => {
      this.query = res.search_query;
    });
  }

  ngOnInit() {
    this.imdbService.search(this.query).subscribe((res) => {
      this.serachResults = res.result.results;
    });
  }

  getDetail(ele: SearchResult) {
    this.router.navigateByUrl('/imdb/' + ele.media_type + '/' + ele.id);
  }
}
