import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChapterDetail, LanguageList, VerseInfo } from 'src/app/models/quran';

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
  audioText: number;
  audio = new Audio();
  audioUrlPrefix: string =
    'https://equran.nos.wjv-1.neo.id/audio-partial/Abdullah-Al-Juhany/';
  showPlayer: boolean = false;
  isPlay: boolean = false;

  @ViewChildren('activeDiv') activeDiv: QueryList<ElementRef>;

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

  play(verse: VerseInfo) {
    this.audio.addEventListener('error', (err) => {
      this.showPlayer = false;
      this.isPlay = false;
      return;
    });

    this.showPlayer = true;

    this.audio.src =
      this.audioUrlPrefix +
      verse.chapter.toString().padStart(3, '0') +
      verse.verse.toString().padStart(3, '0') +
      '.mp3';

    this.audio.addEventListener('canplaythrough', () => {
      this.audioText = verse.verse;
      this.audio.play();

      this.activeDiv['_results'][this.audioText].nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });

    this.audio.addEventListener('ended', () => {
      verse.verse += 1;

      this.audio.src =
        this.audioUrlPrefix +
        verse.chapter.toString().padStart(3, '0') +
        verse.verse.toString().padStart(3, '0') +
        '.mp3';

      this.audio.load();
    });

    this.audio.load();
  }

  pause() {
    if (this.audio.paused) {
      this.audio.play();
      this.isPlay = false;
    } else {
      this.audio.pause();
      this.isPlay = true;
    }
  }

  goTo(type: string) {
    this.chapterId += type === 'pre' ? -1 : 1;
    this.getChapterDetails(this.chapterId, '');
  }
}
