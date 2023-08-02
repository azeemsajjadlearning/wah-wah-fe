import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class TrainService {
  constructor(private http: HttpClient) {}

  public getAllTrains(): Observable<any> {
    return this.http.get(environment.api_prefix + 'train');
  }

  public getTrainDetails(trainNo: number, date: number): Observable<any> {
    return this.http.post(environment.api_prefix + 'train/get-details', {
      train_no: trainNo,
      date: date,
    });
  }

  public getTrainCoach(
    trainNo: number,
    date: string,
    boardingStation: string
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'train/get-coach', {
      train_no: trainNo,
      date: date,
      boarding_station: boardingStation,
    });
  }

  public getCoachComposition(
    trainNo: number,
    boardingStation: string,
    remoteStation: string,
    trainSourceStation: string,
    date: string,
    coach: string,
    cls: string
  ): Observable<any> {
    return this.http.post(
      environment.api_prefix + 'train/get-coach-composition',
      {
        train_no: trainNo,
        boarding_station: boardingStation,
        remote_station: remoteStation,
        train_source_station: trainSourceStation,
        date: date,
        coach: coach,
        cls: cls,
      }
    );
  }
}
