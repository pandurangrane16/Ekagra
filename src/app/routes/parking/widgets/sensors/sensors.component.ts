
import { Component,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sensors',
  standalone: true,
  templateUrl: './sensors.component.html',
  imports: [CommonModule, CanvasJSAngularChartsModule,MatButtonModule, MatIconModule,],
  styleUrls: ['./sensors.component.css'],
})
export class SensorsComponent implements AfterViewInit{


  ngAfterViewInit() {
    this.createGauge(this.chart);
   
  }
  chart: any;

  options = {
    title: {
      text: '',
    },
  };

  gauge = {
    title: { text: '' },
    data: { y: 30, color: '#FFAD5C' }, //gauge value change it
    maximum: 100,
    unoccupied: {},
    valueText: {},
    innerRadius: '95%', // Use percentage values to control thickness
    outerRadius: '100%', // Use percentage values to control thickness
    borderRadius:'10px',
    imageURL: 'assets/img/smile.png', // URL for the image you want to place
    
  };

  createGauge = (chart: any) => {
    //Caluculation of remaining parameters to render gauge with the help of doughnut
    this.gauge.unoccupied = {
      y: this.gauge.maximum - this.gauge.data.y,
      color: '#DEDEDE',
      toolTipContent: null,
      highlightEnabled: false,
  
    };
    if (!this.gauge.data.color) this.gauge.data.color = '#FFAD5C';
    this.gauge.valueText = {
      text: this.gauge.data.y.toString(),
      verticalAlign: 'center',
    };

    var data = {
      type: 'doughnut',
      innerRadius: this.gauge.innerRadius || '75%', // Set inner radius (this controls the thickness)
      outerRadius: this.gauge.outerRadius || '100%', // Set outer radius (this controls the thickness)
      dataPoints: [
        {
          y: this.gauge.maximum,
          color: 'transparent',
          toolTipContent: null,
        },
        this.gauge.data,
        this.gauge.unoccupied,
      ],
      dataLabels: [
        {
          // Position the image in the center of the gauge
          x: 0, // Horizontally center the image
          y: 0, // Vertically center the image
          image: this.gauge.imageURL, // Image URL
          width: 50, // Width of the image (adjust as needed)
          height: 50, // Height of the image (adjust as needed)
          verticalAlign: 'middle', // Align the image vertically to the center
          horizontalAlign: 'center', // Align the image horizontally to the center
          borderRadius: this.gauge.borderRadius || '10px', // Set outer radius (this controls the thickness)
        }
      ]
    };

    if (!this.chart.options.data) this.chart.options.data = [];
    this.chart.options.data.push(data);

    if (this.gauge.title) {
      this.chart.options.title = this.gauge.title;
    }

    //For showing value
    if (!this.chart.options.subtitles) this.chart.options.subtitles = [];
    this.chart.options.subtitles.push(this.gauge.valueText);

    this.chart.render();
  };

  getChartInstance = (chart: any) => {
    this.chart = chart;
  };
}



