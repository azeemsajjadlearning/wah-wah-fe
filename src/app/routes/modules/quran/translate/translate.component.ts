import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { LanguageList } from 'src/app/models/quran';

@Component({
    selector: 'app-translate',
    templateUrl: './translate.component.html',
    styleUrls: ['./translate.component.scss'],
    standalone: false
})
export class TranslateComponent {
  languageCtrl = new FormControl(null);
  languages: LanguageList[];
  filteredlanguages: Observable<LanguageList[]>;

  constructor(
    public dialogRef: MatDialogRef<TranslateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.languages = this.data;

    this.filteredlanguages = this.languageCtrl.valueChanges.pipe(
      startWith(''),
      map((language) =>
        language ? this._filterlanguage(language) : this.languages.slice()
      )
    );
  }

  ngOnInit() {}

  getLanguage(event: LanguageList) {
    this.dialogRef.close({
      selectedLanguage: event,
    });
  }

  private _filterlanguage(value: string): LanguageList[] {
    const filterValue = value.toLowerCase();

    return this.languages.filter((lang) =>
      lang.language.toLowerCase().includes(filterValue)
    );
  }
}
