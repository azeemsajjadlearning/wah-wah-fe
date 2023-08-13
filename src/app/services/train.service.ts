import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { StationCode } from '../models/train';

@Injectable()
export class TrainService {
  private stationList = '../../assets/station-list.json';

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

  public getPNRStatus(pnr: number): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'train/get-pnr-status/' + pnr
    );
  }

  public searchTrain(query: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'train/search-train/' + query
    );
  }

  public getRunningStatus(
    trainNo: string,
    departureDate: string
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'train/get-running-status', {
      departure_date: departureDate,
      train_number: trainNo,
    });
  }

  public getTrainsBetweenStation(
    source: string,
    destination: String,
    date: string
  ): Observable<any> {
    return this.http.post(
      environment.api_prefix + 'train/get-train-bw-station',
      {
        source: source,
        destination: destination,
        date: date,
      }
    );
  }

  public getAvailability(
    trainNo: string,
    journey_date: string,
    source: string,
    destination: string,
    cls: string,
    quota: string = 'GN'
  ) {
    return this.http.post(environment.api_prefix + 'train/get-availability', {
      train_no: trainNo,
      journey_date: journey_date,
      source: source,
      destination: destination,
      class: cls,
      quota: quota,
    });
  }

  public getStationList(): Observable<StationCode[]> {
    return this.http.get<StationCode[]>(this.stationList);
  }
}
