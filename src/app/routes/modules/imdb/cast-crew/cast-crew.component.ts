import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import { MovieCast, MovieCrew } from 'src/app/models/imdb';

@Component({
  selector: 'app-cast-crew',
  templateUrl: './cast-crew.component.html',
  styleUrls: ['./cast-crew.component.scss'],
})
export class CastCrewComponent {
  imageUrlPrefix: string = environment.imdb_image_prefix;
  defaultImage = '../../../../../assets/svg/default.svg';

  constructor(
    public dialogRef: MatDialogRef<CastCrewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatData
  ) {}

  ngOnInit() {
    console.log(this.data.cast[9].name);
  }
}

interface MatData {
  cast: MovieCast[];
  crew: MovieCrew[];
}
