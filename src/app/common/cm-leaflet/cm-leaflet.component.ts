import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-cm-leaflet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cm-leaflet.component.html',
  styleUrls: ['./cm-leaflet.component.css']
})
export class CmLeafletComponent implements OnInit {
  private map: any;
  isBrowser = false;

  @Input() showMap: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const L = await import('leaflet');
      await import('leaflet-draw'); // must import after Leaflet is loaded

      const map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      this.map = map;

      this.addDrawControl(L);
    }
  }

  private addDrawControl(L: any): void {
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
