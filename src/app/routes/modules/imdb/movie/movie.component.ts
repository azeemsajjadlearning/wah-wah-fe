import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import {
  KeyValue,
  MovieCast,
  MovieDetail,
  MovieExternals,
  MovieReview,
} from 'src/app/models/imdb';
import { GeneralService } from 'src/app/services/general.service';
import { IMDbService } from 'src/app/services/imdb.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
  id: number;
  imageUrlPrefix: string = environment.imdb_image_prefix;
  defaultImage = '../../../../../assets/svg/default.svg';

  movieDetail: MovieDetail;
  cast: MovieCast[];
  crew: MovieCast[];
  externalIds: MovieExternals;
  keywords: KeyValue[];
  reviews: MovieReview[];

  mainCrew: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private imdbService: IMDbService,
    private _snackBar: MatSnackBar,
    public generalService: GeneralService
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.id = res.id;
    });
  }

  ngOnInit() {
    this.imdbService.getDetail('movie', this.id).subscribe((res) => {
      this.movieDetail = res.result;
    });

    forkJoin([
      this.imdbService.getDetails('movie', this.id, 'credits'),
      this.imdbService.getDetails('movie', this.id, 'external_ids'),
      this.imdbService.getDetails('movie', this.id, 'keywords'),
      this.imdbService.getDetails('movie', this.id, 'reviews'),
    ]).subscribe((results) => {
      this.cast = results[0].result.cast;
      this.crew = results[0].result.crew;

      this.mainCrew = this.generalService
        .jobByName(this.crew)
        .filter((ele: any) => {
          return this.generalService.matchArrays(ele.job, [
            'Director',
            'Novel',
            'Screenplay',
            'Story',
            'Producer',
          ]);
        });

      this.externalIds = results[1].result;
      this.keywords = results[2].result.keywords;
      this.reviews = results[3].result.results;
      console.log(this.reviews);
    });
  }

  snackBar() {
    this._snackBar.open('Feature coming soon!', 'Ok!', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
