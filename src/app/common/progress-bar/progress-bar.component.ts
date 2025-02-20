import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudStorageService } from 'src/app/services/cloud-storage.service';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss'],
    standalone: false
})
export class ProgressBarComponent implements OnInit {
  progress$: Observable<number>;
  show$: Observable<boolean>;
  operation$: Observable<string>;

  constructor(private cloudStorageService: CloudStorageService) {}

  ngOnInit(): void {
    this.progress$ = this.cloudStorageService.progress$;
    this.show$ = this.cloudStorageService.show$;
    this.operation$ = this.cloudStorageService.operation$;
  }
}
