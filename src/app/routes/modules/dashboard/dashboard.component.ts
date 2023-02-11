import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InSHORT } from 'src/app/models/third-party';
import { ThirdPartyService } from 'src/app/services/third-party.service';

@Component({
  selector: 'selector-name',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private thirdPartyService: ThirdPartyService) {}

  inShorts: InSHORT[];

  category: FormControl = new FormControl('all');

  ngOnInit() {
    this.getInshort('all');

    this.category.valueChanges.subscribe((res) => {
      this.getInshort(res);
    });
  }

  getInshort(category: string) {
    this.thirdPartyService.getInShort(category).subscribe((res) => {
      this.inShorts = res.result.data;
    });
  }

  inShortCategory = [
    { value: 'all', viewValue: 'All' },
    { value: 'national', viewValue: 'National' },
    { value: 'business', viewValue: 'Business' },
    { value: 'sports', viewValue: 'Sports' },
    { value: 'world', viewValue: 'World' },
    { value: 'politics', viewValue: 'Politics' },
    { value: 'startup', viewValue: 'Start-Up' },
    { value: 'entertainment', viewValue: 'Entertainment' },
    { value: 'miscellaneous', viewValue: 'Miscellaneous' },
    { value: 'hatke', viewValue: 'Hatke' },
    { value: 'science', viewValue: 'Science' },
    { value: 'automobile', viewValue: 'Automobile' },
  ];
}
