import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { MovieDetail } from 'src/app/models/imdb';
import { IMDbService } from 'src/app/services/imdb.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent {
  movieDetails: MovieDetail;
  id: number;
  imageUrlPrefix: string = environment.imdb_image_prefix;
  mainCrew: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private imdbService: IMDbService,
    private _snackBar: MatSnackBar
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.id = res.id;
    });
  }

  ngOnInit() {
    this.imdbService.getDetails('movie', this.id).subscribe((res: any) => {
      this.movieDetails = res.result;

      this.mainCrew = this.jobByName(this.movieDetails.credits.crew).filter(
        (ele: any) => {
          return this.matchArrays(ele.job, this.crew);
        }
      );

      this.imageUrlPrefix + this.movieDetails.detail.backdrop_path;
    });
  }

  snackBar() {
    this._snackBar.open('Feature coming soon!', 'Ok!', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  jobByName(list: any) {
    let result: any = [];
    let map = new Map();
    for (let i = 0; i < list.length; i++) {
      let original_name = list[i].original_name;
      let job = list[i].job;
      if (!map.has(original_name)) {
        map.set(original_name, []);
      }
      map.get(original_name).push(job);
    }
    map.forEach((value, key) => {
      result.push({
        original_name: key,
        job: value,
      });
    });
    return result;
  }

  groupByJob(list: any) {
    let result: any = [];
    let map = new Map();
    for (let i = 0; i < list.length; i++) {
      let name = list[i].name;
      let job = list[i].job;
      if (!map.has(job)) {
        map.set(job, []);
      }
      map.get(job).push(name);
    }
    map.forEach((value, key) => {
      result.push({
        job: key,
        names: value.join(', '),
      });
    });
    return result;
  }

  convertToHoursMinutes(minutes: number) {
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours}h ${minutes}m`;
  }

  matchArrays(arr1: any, arr2: any) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.includes(arr1[i])) {
        return true;
      }
    }
    return false;
  }

  crew: string[] = ['Director', 'Novel', 'Screenplay', 'Story', 'Producer'];
}
