import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingBarComponent } from './loading-bar.component';
import { LoadingBarInterceptor } from './loading-bar.interceptor';

@NgModule({
  declarations: [LoadingBarComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [LoadingBarComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingBarInterceptor,
      multi: true,
    },
  ],
})
export class LoadingBarModule {}
