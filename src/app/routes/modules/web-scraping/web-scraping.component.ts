import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { ProductDetails } from 'src/app/models/scraping';
import { WebScrapingService } from 'src/app/services/web-scarping.service';

@Component({
    selector: 'app-web-scraping',
    templateUrl: './web-scraping.component.html',
    styleUrls: ['./web-scraping.component.scss'],
    standalone: false
})
export class WebScrapingComponent {
  url: FormControl = new FormControl(null);
  productDetails: ProductDetails;
  productPrice: number;

  constructor(
    private webScrappingService: WebScrapingService,
    private confirmationService: ConfirmationService
  ) {}

  getPrice() {
    this.webScrappingService
      .getPrice(this.url.value)
      .pipe(
        catchError((err) => {
          this.confirmationService.open({
            title: 'Error',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            message:
              err.error?.err?.message ||
              err.error?.error ||
              'something went wrong!',
            dismissible: false,
            actions: {
              confirm: {
                label: 'Ok!',
                color: 'warn',
                show: true,
              },
              cancel: {
                show: false,
              },
            },
          });

          throw new Error(err);
        })
      )
      .subscribe((res) => {
        if (res.success) {
          this.productDetails = res.result;
          this.productPrice = parseFloat(
            this.productDetails.price.replace(/[^0-9.-]+/g, '')
          );
        } else {
          this.confirmationService.open({
            title: 'Error',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            message:
              res.error?.err?.message ||
              res.error?.error ||
              'something went wrong!',
            dismissible: false,
            actions: {
              confirm: {
                label: 'Ok!',
                color: 'warn',
                show: true,
              },
              cancel: {
                show: false,
              },
            },
          });
        }
      });
  }

  trackProduct() {
    this.webScrappingService
      .trackPrice(
        this.productDetails.title,
        this.productDetails.price.replace(/[^0-9.-]+/g, ''),
        this.url.value
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
