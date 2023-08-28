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

  public getTrainSchedule(trainNo: number): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'train/get-train-schedule/' + trainNo
    );
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

  public searchTrain(query: string): Observable<any[]> {
    return this.getAllTrain().pipe(
      map((trains) =>
        trains.filter((train) =>
          train.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  public getPNRStatus(pnr: number): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'train/get-pnr-status/' + pnr
    );
  }

  public getLiveTrainStatus(trainNo: number, date: string): Observable<any> {
    return this.http.post(environment.api_prefix + 'train/get-running-status', {
      train_no: trainNo,
      date: date,
    });
  }

  public getTrainComposition(
    trainNo: string,
    date: string,
    boardingStation: string
  ): Observable<any> {
    return this.http.post(
      environment.api_prefix + 'train/get-train-composition',
      {
        train_no: trainNo,
        date: date,
        boarding_station: boardingStation,
      }
    );
  }

  public getClassChart(
    trainNo: string,
    boardingStation: string,
    remoteStation: string,
    source: string,
    date: string,
    cls: string
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'train/get-class-chart', {
      train_no: trainNo,
      boarding_station: boardingStation,
      remote_station: remoteStation,
      source: source,
      date: date,
      cls: cls,
    });
  }

  public getCoachChart(
    trainNo: string,
    boardingStation: string,
    remoteStation: string,
    source: string,
    date: string,
    coach: string,
    cls: string
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'train/get-coach-chart', {
      train_no: trainNo,
      boarding_station: boardingStation,
      remote_station: remoteStation,
      source: source,
      date: date,
      coach: coach,
      cls: cls,
    });
  }

  private getAllStation(): Observable<any[]> {
    return this.http
      .get<any>(environment.api_prefix + 'train/get-all-stations')
      .pipe(map((response) => response.result));
  }

  private getAllTrain(): Observable<any[]> {
    return this.http
      .get<any>(environment.api_prefix + 'train/get-all-trains')
      .pipe(map((response) => response.result));
  }
}
