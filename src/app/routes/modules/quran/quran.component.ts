import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Chapter, QuranInfo } from 'src/app/models/quran';
import { QuranService } from 'src/app/services/quran.service';

@Component({
    selector: 'app-quran',
    templateUrl: './quran.component.html',
    styleUrls: ['./quran.component.scss'],
    standalone: false
})
export class QuranComponent {
  quranInfo: QuranInfo;
  chapters: any;
  searchInputControl = new FormControl(null);

  displayedColumns: string[] = ['arabicname', 'name', 'englishname'];

  constructor(private quranService: QuranService, private router: Router) {}

  ngOnInit() {
    this.quranService.getInfo().subscribe((res) => {
      this.quranInfo = res.result;
      this.chapters = new MatTableDataSource(this.quranInfo.chapters);
    });

    this.searchInputControl.valueChanges.subscribe((res: any) => {
      this.chapters.filter = res.trim().toLowerCase();
    });
  }

  getChapter(chapter: Chapter) {
    this.router.navigateByUrl('/quran/' + btoa(chapter.chapter.toString()));
  }
}
