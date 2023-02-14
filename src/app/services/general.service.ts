import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeneralService {
  constructor(private http: HttpClient) {}

  public getYoutubeThumbnail(video_id: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'third-party/get-youtube-thumbnail/' + video_id
    );
  }

  public reduceAndCombineObject(arr: Array<any>) {
    return arr.reduce((acc: any, obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (!acc[key]) {
          acc[key] = [];
        }
        if (!acc[key].includes(obj[key])) {
          acc[key].push(obj[key]);
        }
      });
      return acc;
    }, {});
  }

  public jobByName(list: any) {
    let result: any = [];
    let map = new Map();
    for (let i = 0; i < list.length; i++) {
      let original_name = list[i].original_name;
      let job = list[i].job;
      if (!map.has(original_name)) {
        map.set(original_name, []);
      }
      map.get(original_name).push(job);
    }
    map.forEach((value, key) => {
      result.push({
        original_name: key,
        job: value,
      });
    });
    return result;
  }

  public groupByJob(list: any) {
    let result: any = [];
    let map = new Map();
    for (let i = 0; i < list.length; i++) {
      let name = list[i].name;
      let job = list[i].job;
      if (!map.has(job)) {
        map.set(job, []);
      }
      map.get(job).push(name);
    }
    map.forEach((value, key) => {
      result.push({
        job: key,
        names: value.join(', '),
      });
    });
    return result;
  }

  public convertToHoursMinutes(minutes: number) {
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours}h ${minutes}m`;
  }

  public matchArrays(arr1: any, arr2: any) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.includes(arr1[i])) {
        return true;
      }
    }
    return false;
  }
}
