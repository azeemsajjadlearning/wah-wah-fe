import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { PersonCombineCredits, PersonDetail } from 'src/app/models/imdb';
import { GeneralService } from 'src/app/services/general.service';
import { IMDbService } from 'src/app/services/imdb.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent {
  id: number;
  details: PersonDetail;
  credits: PersonCombineCredits;
  workList: any;
  imageUrlPrefix: string = environment.imdb_image_prefix;

  constructor(
    private activatedRoute: ActivatedRoute,
    private imdbService: IMDbService,
    private generalService: GeneralService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.id = res.id;
    });
  }

  ngOnInit() {
    forkJoin([
      this.imdbService.getDetail('person', this.id),
      this.imdbService.getDetails('person', this.id, 'combined_credits'),
    ]).subscribe((res) => {
      this.details = res[0].result;
      this.details['age'] = this.generalService.getAge(this.details.birthday);
      this.credits = res[1].result;
      this.workList = [...this.credits.cast, ...this.credits.crew];
    });
  }

  getDetail(ele: any) {
    this.router.navigateByUrl('imdb/' + ele.media_type + '/' + ele.id);
  }
}
