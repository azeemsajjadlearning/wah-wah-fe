import { Component, OnInit } from '@angular/core';
import { Coverage, Match, Stage, State } from 'src/app/models/cricket';
import { CricketService } from 'src/app/services/cricket.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
