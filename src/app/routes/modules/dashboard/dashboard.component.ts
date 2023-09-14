import { Component, OnInit } from '@angular/core';
import { Coverage, Match, Stage, State } from 'src/app/models/cricket';
import { CricketService } from 'src/app/services/cricket.service';

@Component({
  selector: 'selector-name',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  listOfMatches: Match[];
  constructor(private cricketService: CricketService) {}

  ngOnInit() {
    this.getLiveScore();
    setTimeout(() => {
      this.getLiveScore();
    }, 30000);
  }

  private getLiveScore() {
    this.cricketService.getLiveMatches().subscribe((res) => {
      this.listOfMatches = res.result.matches
        .filter(
          (ele: Match) =>
            ele.state === State.Live &&
            ele.coverage == Coverage.Y &&
            ele.stage == Stage.Running
        )
        .reverse();
      console.log(this.listOfMatches);
    });
  }
}
