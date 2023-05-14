import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { WeatherReport } from 'src/app/models/weather';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'selector-name',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  chartOptions: ApexCharts.ApexOptions;
  chartInstance: ApexCharts;

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

        this.chartOptions = {
          title: {
            text: `${this.weatherReport?.location.name} (${this.weatherReport?.current.feelslike_c} ℃)`,
            align: 'center',
            style: {
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#CBD5E1',
            },
          },
          chart: {
            type: 'area',
            animations: {
              speed: 400,
              animateGradually: {
                enabled: true,
              },
            },
            toolbar: {
              show: false,
            },
            fontFamily: 'inherit',
            foreColor: 'inherit',
            width: '100%',
            height: '100%',
            zoom: {
              enabled: false,
            },
          },
          colors: ['#818CF8'],
          dataLabels: {
            enabled: false,
          },
          fill: {
            colors: ['#818CF8'],
          },
          series: [
            {
              name: 'temp',
              data: data,
            },
          ],
          xaxis: {
            crosshairs: {
              stroke: {
                color: '#475569',
                dashArray: 0,
                width: 2,
              },
            },
            categories: label,
            labels: {
              style: {
                colors: '#CBD5E1',
              },
            },
            tickAmount: 20,
            tooltip: {
              enabled: false,
            },
          },
          yaxis: {
            labels: {
              show: true,
              style: { colors: '#CBD5E1' },
            },
          },
          stroke: {
            width: 2,
          },
          tooltip: {
            followCursor: true,
            theme: 'dark',
          },
          grid: {
            borderColor: '#334155',
            xaxis: {
              lines: {
                show: true,
              },
            },
          },
          noData: {
            text: 'Loading...',
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
              color: '#000000',
              fontSize: '14px',
              fontFamily: 'Helvetica',
            },
          },
        };

        this.chartInstance = new ApexCharts(
          document.querySelector('#chart'),
          this.chartOptions
        );
        this.chartInstance.render();
      });
  }
}
