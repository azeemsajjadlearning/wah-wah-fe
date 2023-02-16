import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMDbService } from 'src/app/services/imdb.service';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss'],
})
export class TvComponent {
  tvDetails: any;
  id: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private imdbService: IMDbService
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.id = res.id;
    });
  }

  ngOnInit() {
    this.imdbService.getDetail('tv', this.id).subscribe((res) => {
      console.log(res);
    });
  }
}
