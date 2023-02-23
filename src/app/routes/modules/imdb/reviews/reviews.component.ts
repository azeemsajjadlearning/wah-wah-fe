import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import { MovieReview } from 'src/app/models/imdb';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent {
  imageUrlPrefix: string = environment.imdb_image_prefix;
  defaultImage = '../../../../../assets/svg/default.svg';

  constructor(
    public dialogRef: MatDialogRef<ReviewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MovieReview[]
  ) {}

  ngOnInit() {}
}
