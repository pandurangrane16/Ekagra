import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, input, PLATFORM_ID } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';

@Component({
  selector: 'app-cm-leaflet',
  imports: [],
  templateUrl: './cm-leaflet.component.html',
  styleUrl: './cm-leaflet.component.css'
})
export class CmLeafletComponent {
  private map: L.Map | undefined;
  @Input() showMap: any;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
      this.initMap();
      this.addDrawControl();
    }, 1000);
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [19.0760, 72.8777], // Mumbai
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private addDrawControl(): void {
    if (!this.map) return;

    const drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: 'red',
          },
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });

    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      const coordinates = layer.getLatLngs();
      console.log('Polygon Coordinates:', coordinates);
    });
  }
}
