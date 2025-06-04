import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface Section {
  name: string;
  img:string;
  dec:string;
}

@Component({
    selector: 'app-forecast',
    imports: [MatListModule, MatIconModule, MatButtonModule],
    templateUrl: './forecast.component.html',
    styleUrl: './forecast.component.css'
})
export class ForecastComponent {
 forecast: Section[] = [
      {
        name: 'Temperature',
        img:'assets/img/Thermometer.png',
        dec:'Lorem Ipsum is simply dummy text'
      },
      {
        name: 'Rain Fall',
         img:'assets/img/Rain-Cloud.png',
        dec:'Lorem Ipsum is simply dummy text'
      },
      {
        name: 'Wind Speed',
         img:'assets/img/Wind-Flow.png',
        dec:'Lorem Ipsum is simply dummy text'
      },
      {
        name: 'Humidity',
         img:'assets/img/Humidity.png',
        dec:'Lorem Ipsum is simply dummy text'
      },
      {
        name: 'Location 5',
         img:'assets/img/Location.png',
        dec:'Lorem Ipsum is simply dummy text'
      },
    ];
}
