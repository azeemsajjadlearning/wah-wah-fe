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
  summary: any;

  constructor(private cricketService: CricketService) {}

  ngOnInit() {
    this.getLiveScore();
    setTimeout(() => {
      this.getLiveScore();
    }, 30000);

    // this.cricketService
    //   .getFile(
    //     'BQACAgUAAxkDAAMDZrt22yRntnTrDdG5pNYss5jwHB8AAqYPAAL9ReBVpJenmaW2yxM1BA'
    //   )
    //   .subscribe((res) => console.log(res));
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
    });
  }

  getScoreCard(match: Match) {
    this.cricketService.getMatch(match.objectId).subscribe((resp) => {
      this.summary = resp.result;
    });
  }
}
