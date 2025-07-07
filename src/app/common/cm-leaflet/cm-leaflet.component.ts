import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
let L: any;
//import 'leaflet-draw';

@Component({
  selector: 'app-cm-leaflet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cm-leaflet.component.html',
  styleUrls: ['./cm-leaflet.component.css']
})
export class CmLeafletComponent implements OnInit {
  private map: any;
  L : any;
  isBrowser = false;

  @Input() showMap: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
  this.isBrowser = isPlatformBrowser(this.platformId);

  if (this.isBrowser) {
    L = await import('leaflet');
    await import('leaflet-draw');

    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    this.map = map;
    this.addDrawControl();
  }
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
          color: 'green',
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

  // ✅ Fix: Access L.Draw via window.L (browser global)
  const drawEvent = (window as any).L?.Draw?.Event?.CREATED;

  if (drawEvent) {
    this.map.on(drawEvent, (event: any) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      const coordinates = layer.getLatLngs();
      console.log('Polygon Coordinates:', coordinates);
    });
  } else {
    console.error('L.Draw.Event not found');
  }
}

}
