import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { IMDbService } from 'src/app/services/imdb.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'imdb.component.html',
    styleUrls: ['imdb.component.scss'],
    standalone: false
})
export class IMDbComponent implements OnInit {
  constructor(private imdbService: IMDbService, private router: Router) {}

  trending: any[];

  popular: any[];

  imageUrlPrefix: string = environment.imdb_image_prefix;

  search: FormControl = new FormControl(null);

  ngOnInit() {
    forkJoin([
      this.imdbService.getPopular('movie'),
      this.imdbService.getTrending('movie', 'day'),
      this.imdbService.getTrending('tv', 'day'),
    ]).subscribe((results) => {
      this.popular = results[0].result.results;

      this.trending = results[1].result.results.concat(
        results[2].result.results
      );
    });
  }

  onSearchSubmit() {
    this.router.navigate(['/imdb/search-results'], {
      queryParams: {
        search_query: this.search.value,
      },
    });
  }

  getTrendSelection(event: 'day' | 'week') {
    forkJoin([
      this.imdbService.getTrending('movie', event),
      this.imdbService.getTrending('movie', event),
    ]).subscribe((results) => {
      this.trending = results[0].result.results.concat(
        results[1].result.results
      );
    });
  }

  getPopSelection(event: 'movie' | 'tv' | 'person') {
    this.imdbService.getPopular(event).subscribe((res) => {
      this.popular = res.result.results.map((ele: any) => {
        ele['media_type'] = event;
        return ele;
      });
    });
  }

  getDetail(item: any) {
    this.router.navigateByUrl(
      '/imdb/' + (item.media_type || 'movie') + '/' + item.id
    );
  }
}
