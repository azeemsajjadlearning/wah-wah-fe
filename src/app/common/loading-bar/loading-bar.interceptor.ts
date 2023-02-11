import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingBarService } from './loading-bar.service';

@Injectable()
export class LoadingBarInterceptor implements HttpInterceptor {
  handleRequestsAutomatically: boolean;

  /**
   * Constructor
   */
  constructor(private loadingBarService: LoadingBarService) {
    // Subscribe to the auto
    this.loadingBarService.auto$.subscribe((value) => {
      this.handleRequestsAutomatically = value;
    });
  }

  /**
   * Intercept
   *
   * @param req
   * @param next
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // If the Auto mode is turned off, do nothing
    if (!this.handleRequestsAutomatically) {
      return next.handle(req);
    }

    // Set the loading status to true
    this.loadingBarService._setLoadingStatus(true, req.url);

    return next.handle(req).pipe(
      finalize(() => {
        // Set the status to false if there are any errors or the request is completed
        this.loadingBarService._setLoadingStatus(false, req.url);
      })
    );
  }
}
