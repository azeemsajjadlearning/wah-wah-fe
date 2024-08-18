import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class CricketService {
  constructor(private http: HttpClient) {}

  public getLiveMatches(): Observable<any> {
    return this.http.get(environment.api_prefix + 'cricket/live-matches');
  }

  public getMatch(matchId: number): Observable<any> {
    return this.http.get(environment.api_prefix + 'cricket/match/' + matchId);
  }

  public getFile(id: string): Observable<any> {
    return this.http.get(environment.api_prefix + 'storage/getFile/' + id);
  }
}
