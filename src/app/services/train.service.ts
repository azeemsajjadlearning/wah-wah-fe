import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class TrainService {
  constructor(private http: HttpClient) {}

  public searchStation(query: string): Observable<string[]> {
    return this.getAllStation().pipe(
      map((stations) =>
        stations.filter((station) =>
          station.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  public getTrains(
    source: string,
    destination: string,
    date: string,
    quota: string = 'GN'
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'train/get-bw-trains', {
      source,
      destination,
      doj: date,
      quota,
    });
  }

  public getAvailability(
    trainNo: string,
    source: string,
    destination: string,
    dateOfJourney: string,
    cls: string,
    quota: string = 'GN'
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'train/get-availability', {
      train_no: trainNo,
      source: source,
      destination: destination,
      doj: dateOfJourney,
      cls: cls,
      quota: quota,
    });
  }

  public getAllTrain(): Observable<any> {
    return this.http.get(environment.api_prefix + 'train/get-all-trains');
  }

  private getAllStation(): Observable<any[]> {
    return this.http
      .get<any>(environment.api_prefix + 'train/get-all-stations')
      .pipe(map((response) => response.result));
  }
}
