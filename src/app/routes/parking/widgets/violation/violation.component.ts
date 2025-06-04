
import { Component,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { text } from 'node:stream/consumers';

@Component({
    selector: 'app-violation',
    templateUrl: './violation.component.html',
    imports: [CommonModule, CanvasJSAngularChartsModule, MatButtonModule, MatIconModule,],
    styleUrls: ['./violation.component.css']
})
export class ViolationComponent implements AfterViewInit{

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
    title: { },
    data: { y: 355, color: '#1C2D7B' }, //gauge value change it
    maximum: 800,
    unoccupied: {},
    valueText: {},
    innerRadius: '80%', // Use percentage values to control thickness
    outerRadius: '100%', // Use percentage values to control thickness
    borderRadius:'10px',
    imageURL: 'assets/img/smile.png', // URL for the image you want to place
    
  };

  createGauge = (chart: any) => {
    //Caluculation of remaining parameters to render gauge with the help of doughnut
    this.gauge.unoccupied = {
      y: this.gauge.maximum - this.gauge.data.y,
      color: '#DEDEDE',
      toolTipContent: 'null',
      highlightEnabled: false,
  
    };
    if (!this.gauge.data.color) this.gauge.data.color = '#1C2D7B';
    this.gauge.valueText = {
     // text: this.gauge.data.y.toString(),
      text: null,
      verticalAlign: 'center',
    }as any;

    var data = {
      type: 'doughnut',
      startAngle: 65, 
      borderRadius:25,
      innerRadius: this.gauge.innerRadius || '75%', // Set inner radius (this controls the thickness)
      outerRadius: this.gauge.outerRadius || '100%', // Set outer radius (this controls the thickness)
      dataPoints: [
       
        {
          y: 150,
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
    waitForChartReady(retries: number = 10) {
      if (this.chart?.chartArea) {
        this.drawDot(); // it's ready, draw the circle!
      } else if (retries > 0) {
        setTimeout(() => this.waitForChartReady(retries - 1), 50);
      } else {
        console.warn('Chart area still not ready after retries.');
      }
    }
    drawDot() {
      if (!this.chart || !this.chart.chartArea) {
        console.warn('Chart or chartArea not ready.');
        return;
      }
  
      const ctx = this.chart._ctx; // internal CanvasJS context
      const { x1, y1, width, height } = this.chart.chartArea;
  
      const centerX = x1 + width / 2;
      const centerY = y1 + height / 2;
  
      const radius = (Math.min(width, height) * 0.5 * 0.875); // outer edge of arc
  
      const angleDeg = 270 + (this.gauge.data.y / 100) * 360;
      const angleRad = (angleDeg * Math.PI) / 180;
  
      const dotX = centerX + radius * Math.cos(angleRad);
      const dotY = centerY + radius * Math.sin(angleRad);
  
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#1C2D7B';
      ctx.fill();
    }
  getChartInstance = (chart: any) => {
    this.chart = chart;
    this.waitForChartReady();
  };
}



