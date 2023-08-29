import { Component, OnInit } from '@angular/core';
import { WeatherReport } from 'src/app/models/weather';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'selector-name',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  weatherReport: WeatherReport | any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          this.getCurrentWeather(latitude, longitude);
        },
        (error) => {
          console.log(`Error: ${error.message}`);
          this.weatherReport = null;
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      this.weatherReport = null;
    }
  }

  private getCurrentWeather(latitude: number, longitude: number) {
    this.weatherService
      .getCurrentWeatherByLocation(latitude, longitude)
      .subscribe((res) => {
        this.weatherReport = res.result;
        const label: any = [];
        const data: any = [];

        this.weatherReport?.forecast.forecastday[0].hour.forEach((ele: any) => {
          label.push(
            `${new Date(ele.time)
              .getHours()
              .toString()
              .padStart(2, '0')}:${new Date(ele.time)
              .getMinutes()
              .toString()
              .padStart(2, '0')}`
          );
          data.push(ele.temp_c);
        });
      });
  }
}
