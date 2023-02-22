import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { TvCast, TvCrew, TvDetail } from 'src/app/models/imdb';
import { GeneralService } from 'src/app/services/general.service';
import { IMDbService } from 'src/app/services/imdb.service';
import { CastCrewComponent } from '../cast-crew/cast-crew.component';
import { ReviewsComponent } from '../reviews/reviews.component';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss'],
})
export class TvComponent {
  tvDetails: TvDetail;
  id: number;
  imageUrlPrefix: string = environment.imdb_image_prefix;
  backgroundColor: string;
  defaultImage = '../../../../../assets/svg/default.svg';
  window = window;

  watchProviders: any;
  cast: TvCast[];
  crew: TvCrew[];
  reviews: any;
  videos: any;
  recommendation: any;
  externalIds: any;
  keywords: any;

  mainCrew: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private imdbService: IMDbService,
    public generalService: GeneralService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.id = res.id;
    });
  }

  ngOnInit() {
    this.imdbService.getDetail('tv', this.id).subscribe((res) => {
      this.tvDetails = res.result;

      this.generalService
        .getMaxColor(
          this.imageUrlPrefix + 'original' + this.tvDetails.backdrop_path
        )
        .then((res) => {
          this.backgroundColor = res.slice(0, -1);
        })
        .catch((err) => {
          console.log(err);
        });

      forkJoin([
        this.imdbService.getDetails('tv', this.id, 'credits'),
        this.imdbService.getDetails('tv', this.id, 'external_ids'),
        this.imdbService.getDetails('tv', this.id, 'keywords'),
        this.imdbService.getDetails('tv', this.id, 'recommendations'),
        this.imdbService.getDetails('tv', this.id, 'reviews'),
        this.imdbService.getDetails('tv', this.id, 'videos'),
        this.imdbService.getDetails('tv', this.id, 'watch/providers'),
      ]).subscribe((result) => {
        console.log(result);

        this.cast = result[0].result.cast;
        this.crew = result[0].result.crew;
        this.externalIds = result[1].result;
        this.keywords = result[2].result.results;
        this.recommendation = result[3].result.results;
        this.reviews = result[4].result.results;
        this.videos = result[5].result.results;
        this.watchProviders = result[6].result;

        for (const video of this.videos) {
          this.generalService
            .getYoutubeThumbnail(video.key)
            .subscribe((response) => {
              const thumbnails = response.result.items[0].snippet.thumbnails;
              const highestResolutionUrl =
                this.extractHighestResolutionImageUrl(thumbnails);

              // Update the corresponding MovieVideo object with the thumbnail URL
              const matchingVideo: any = this.videos.find(
                (v: any) => v.key === video.key
              );
              if (matchingVideo) {
                matchingVideo.thumbnailUrl = highestResolutionUrl;
              }
            });
        }
      });
    });
  }

  getPerson(item: any) {
    this.router.navigate(['imdb/person', item.id]);
  }

  getAllCastandCrew() {
    this.dialog.open(CastCrewComponent, {
      data: { cast: this.cast, crew: this.crew },
      width: '90%',
      maxWidth: '1400px',
    });
  }

  getAllReview() {
    this.dialog.open(ReviewsComponent, {
      data: this.reviews,
      width: '90%',
      maxWidth: '1400px',
    });
  }

  snackBar() {
    this._snackBar.open('Feature coming soon!', 'Ok!', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
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
