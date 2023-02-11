import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { PopularMovie, PopularTv } from 'src/app/models/imdb';
import { IMDbService } from 'src/app/services/imdb.service';

@Component({
  selector: 'selector-name',
  templateUrl: 'imdb.component.html',
  styleUrls: ['imdb.component.scss'],
})
export class IMDbComponent implements OnInit {
  constructor(private imdbService: IMDbService, private router: Router) {}

  propularMovies: PopularMovie[];
  propularTv: PopularTv[];

  ngOnInit() {
    this.imdbService.getPopular().subscribe((res) => {
      this.propularMovies = res.result.movie.results.map(
        (ele: PopularMovie) => {
          ele.poster_path = environment.imdb_image_prefix + ele.poster_path;
          return ele;
        }
      );
      this.propularTv = res.result.tv.results.map((ele: PopularTv) => {
        ele.poster_path = environment.imdb_image_prefix + ele.poster_path;
        return ele;
      });
    });
  }

  getDetail(item: PopularMovie | PopularTv, type: string) {
    this.router.navigateByUrl('/imdb/' + type + '/' + item.id);
  }
}
