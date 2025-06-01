import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { StreamService } from 'src/app/services/stream.service';
import videojs from 'video.js';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  magnetLink: FormControl = new FormControl(null);
  fileList: any;
  safeVideoUrl: any;

  constructor(
    private streamService: StreamService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  getFiles() {
    this.streamService.getFiles(this.magnetLink.value).subscribe((resp) => {
      this.fileList = resp.files.sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      );
    });
  }

  getUrl(file: any) {
    this.streamService
      .getStreamURL(this.magnetLink.value, file.name)
      .subscribe((blob) => {
        const videoUrl = URL.createObjectURL(blob);
        this.safeVideoUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
      });
  }
}
