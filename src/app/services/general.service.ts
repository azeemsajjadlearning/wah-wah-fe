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

  public getAge(dateString: any) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  public async getMaxColor(imageUrl: string): Promise<string> {
    const colorPercentage = await this.getColorPercentage(imageUrl);
    let maxColor = '';
    let maxPercentage = 0;

    for (let color in colorPercentage) {
      if (colorPercentage[color] > maxPercentage) {
        maxColor = color;
        maxPercentage = colorPercentage[color];
      }
    }

    return maxColor;
  }

  private async getColorPercentage(
    imageUrl: string
  ): Promise<{ [key: string]: number }> {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        resolve();
      };
      img.onerror = (error) => {
        reject(error);
      };
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not create canvas context.');
    }

    context.drawImage(img, 0, 0);

    const pixelData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;
    const colorMap: { [key: string]: number } = {};

    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];
      const a = pixelData[i + 3];

      if (a !== 0) {
        const color = `rgb(${r}, ${g}, ${b})`;
        if (color in colorMap) {
          colorMap[color]++;
        } else {
          colorMap[color] = 1;
        }
      }
    }

    const totalCount = Object.values(colorMap).reduce((a, b) => a + b, 0);

    const colorPercentage: { [key: string]: number } = {};

    for (let color in colorMap) {
      const percentage = (colorMap[color] / totalCount) * 100;
      colorPercentage[color] = percentage;
    }

    return colorPercentage;
  }
}
