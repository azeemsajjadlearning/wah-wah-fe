import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandDevice } from 'src/app/models/mobile';
import { MobileService } from 'src/app/services/mobile.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent {
  brandId: string;
  devices: BrandDevice[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private mobileService: MobileService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe((res: any) => {
      this.brandId = res.brand;
    });
  }

  ngOnInit() {
    this.mobileService.getBrand(this.brandId).subscribe((res) => {
      this.devices = res.result;
    });
  }

  getDetail(item: BrandDevice) {
    this.router.navigate(['/mobile/device'], {
      queryParams: { device_id: item.id },
    });
  }
}
