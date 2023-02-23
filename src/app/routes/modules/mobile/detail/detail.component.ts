import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetail } from 'src/app/models/mobile';
import { MobileService } from 'src/app/services/mobile.service';

@Component({
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class MobileDetailComponent {
  deviceId: string;
  deviceDetail: DeviceDetail;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mobileService: MobileService
  ) {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.deviceId = res.device_id;
    });
  }

  ngOnInit() {
    this.mobileService.getDetail(this.deviceId).subscribe((res) => {
      this.deviceDetail = res.result;
    });
  }
}
