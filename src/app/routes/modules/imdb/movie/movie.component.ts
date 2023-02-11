import { Component } from '@angular/core';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private imdbService: IMDbService
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.id = res.id;
    });
  }

  ngOnInit() {
    this.imdbService.getDetails('movie', this.id).subscribe((res: any) => {
      this.movieDetails = res.result;
    });
  }
}
