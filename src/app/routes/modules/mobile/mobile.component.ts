import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, forkJoin, map, Observable, startWith } from 'rxjs';
import { Brand, Popular } from 'src/app/models/mobile';
import { MobileService } from 'src/app/services/mobile.service';

@Component({
    selector: 'app-mobile',
    templateUrl: './mobile.component.html',
    styleUrls: ['./mobile.component.scss'],
    standalone: false
})
export class MobileComponent {
  popularBrands: string[] = [
    'Samsung',
    'Apple',
    'Xiaomi',
    'Oppo',
    'Vivo',
    'OnePlus',
    'Realme',
    'Motorola',
    'Nokia',
    'Lenovo',
    'LG',
    'Huawei',
    'Asus',
    'HTC',
    'Sony',
    'Google',
    'Blackberry',
    'ZTE',
    'Alcatel',
    'Infinix',
    'Tecno',
    'Honor',
    'Gionee',
    'Micromax',
    'Lava',
    'Intex',
    'Panasonic',
    'Coolpad',
    'Meizu',
    'LeEco',
    'YU',
    'iBall',
  ];

  popular: Popular[];
  popularByFan: Popular[];
  allBrands: Brand[];

  search = new FormControl('');
  options: Popular[] = [];
  filteredOptions: Observable<Popular[]>;

  constructor(private mobileService: MobileService, private router: Router) {}

  ngOnInit() {
    forkJoin([
      this.mobileService.getPopular(),
      this.mobileService.getBrands(),
    ]).subscribe((resp) => {
      this.popular = resp[0].result[0].list;
      this.popularByFan = resp[0].result[1].list;
      this.allBrands = resp[1].result;
    });

    this.filteredOptions = this.search.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.search.valueChanges.pipe(delay(200)).subscribe((res: any) => {
      this.mobileService.search(res).subscribe((res) => {
        this.options = res.result;
      });
    });
  }

  getBrand(item: string) {
    let brand: any = this.allBrands.find((ele: Brand) => ele.name == item);

    this.router.navigateByUrl('/mobile/' + brand.id);
  }

  getDetail(item: Popular) {
    this.router.navigate(['/mobile/device'], {
      queryParams: { device_id: item.id },
    });
  }

  private _filter(value: string): Popular[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: Popular) => {
      return option.name.toLowerCase().includes(filterValue);
    });
  }
}
