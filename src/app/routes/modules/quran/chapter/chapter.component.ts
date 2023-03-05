import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChapterDetail, LanguageList } from 'src/app/models/quran';

import { QuranService } from 'src/app/services/quran.service';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent {
  chapterId: number;
  chapterDetail: ChapterDetail;
  languages: LanguageList[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private quranService: QuranService
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.chapterId = parseInt(atob(res.chapter_id));
    });
  }

  ngOnInit() {
    forkJoin([
      this.quranService.getLanguage(),
      this.quranService.getChapter(this.chapterId),
    ]).subscribe((resp) => {
      this.languages = resp[0].result;
      this.chapterDetail = resp[1].result;
    });
  }

  getChapterDetails(chapterId: number, language: string | undefined) {
    this.quranService.getChapter(chapterId, language).subscribe((resp) => {
      this.chapterDetail = resp.result;
    });
  }

  goTo(type: string) {
    if (type == 'pre') {
      this.chapterId -= 1;
    } else {
      this.chapterId += 1;
    }

    this.getChapterDetails(this.chapterId, '');
  }
}
