import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import {
  KeyValue,
  MovieCast,
  MovieCrew,
  MovieDetail,
  MovieExternals,
  MovieImage,
  MovieRecommendation,
  MovieReview,
  MovieSimilar,
  MovieVideo,
} from 'src/app/models/imdb';
import { GeneralService } from 'src/app/services/general.service';
import { IMDbService } from 'src/app/services/imdb.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { CastCrewComponent } from '../cast-crew/cast-crew.component';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
  id: number;
  imageUrlPrefix: string = environment.imdb_image_prefix;
  defaultImage = '../../../../../assets/svg/default.svg';
  backgroundColor: string;
  window = window;

  movieDetail: MovieDetail;
  cast: MovieCast[];
  crew: MovieCast[];
  externalIds: MovieExternals;
  keywords: KeyValue[];
  reviews: MovieReview[];
  images: MovieImage;
  videos: MovieVideo[];
  recommendation: MovieRecommendation[];
  similar: MovieSimilar[];
  watchProviders: any;

  mainCrew: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private imdbService: IMDbService,
    private _snackBar: MatSnackBar,
    public generalService: GeneralService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.id = res.id;
    });
  }

  ngOnInit() {
    this.imdbService.getDetail('movie', this.id).subscribe((res) => {
      this.movieDetail = res.result;

      this.generalService
        .getMaxColor(
          this.imageUrlPrefix + 'original' + this.movieDetail.backdrop_path
        )
        .then((res) => {
          this.backgroundColor = res.slice(0, -1);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    forkJoin([
      this.imdbService.getDetails('movie', this.id, 'credits'),
      this.imdbService.getDetails('movie', this.id, 'external_ids'),
      this.imdbService.getDetails('movie', this.id, 'keywords'),
      this.imdbService.getDetails('movie', this.id, 'reviews'),
      this.imdbService.getDetails('movie', this.id, 'images'),
      this.imdbService.getDetails('movie', this.id, 'videos'),
      this.imdbService.getDetails('movie', this.id, 'recommendations'),
      this.imdbService.getDetails('movie', this.id, 'similar'),
      this.imdbService.getDetails('movie', this.id, 'watch/providers'),
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
      this.images = results[4].result;
      this.videos = results[5].result.results;
      this.recommendation = results[6].result.results;
      this.similar = results[7].result.results;
      this.watchProviders = this.findProviderName(results[8].result);

      for (const video of this.videos) {
        this.generalService
          .getYoutubeThumbnail(video.key)
          .subscribe((response) => {
            const thumbnails = response.result.items[0].snippet.thumbnails;
            const highestResolutionUrl =
              this.extractHighestResolutionImageUrl(thumbnails);

            // Update the corresponding MovieVideo object with the thumbnail URL
            const matchingVideo: any = this.videos.find(
              (v) => v.key === video.key
            );
            if (matchingVideo) {
              matchingVideo.thumbnailUrl = highestResolutionUrl;
            }
          });
      }
    });
  }

  getAllReview() {
    this.dialog.open(ReviewsComponent, {
      data: this.reviews,
      width: '90%',
      maxWidth: '1400px',
    });
  }

  getAllCastandCrew() {
    this.dialog.open(CastCrewComponent, {
      data: { cast: this.cast, crew: this.crew },
      width: '90%',
      maxWidth: '1400px',
    });
  }

  getPerson(item: MovieCast) {
    if (!item.id) {
      let x: any = this.crew.find(
        (ele) => ele.original_name === item.original_name
      );
      item = x;
    }
    this.router.navigate(['imdb/person', item.id]);
  }

  snackBar() {
    this._snackBar.open('Feature coming soon!', 'Ok!', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  findProviderName(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return null;
    }

    if ('provider_name' in obj && 'logo_path' in obj) {
      return {
        provider_name: obj.provider_name,
        logo_path: obj.logo_path,
      };
    }

    for (let key in obj) {
      let result = this.findProviderName(obj[key]);
      if (result !== null) {
        return result;
      }
    }

    return null;
  }

  extractHighestResolutionImageUrl(thumbnails: {
    [key: string]: Thumbnail;
  }): string {
    let maxResThumbnail: Thumbnail | null = null;

    // Iterate over all available thumbnails and select the one with the highest resolution
    for (const key of ['maxres', 'standard', 'high', 'medium', 'default']) {
      if (thumbnails[key]) {
        if (!maxResThumbnail || thumbnails[key].width > maxResThumbnail.width) {
          maxResThumbnail = thumbnails[key];
        }
      }
    }

    return maxResThumbnail ? maxResThumbnail.url : '';
  }
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}
