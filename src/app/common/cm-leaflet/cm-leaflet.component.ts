import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
//let L: any;
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
  private L: any;
  isBrowser = false;

  @Input() showMap: any;
  @Input() existingPolygon: string | null = null;
  @Output() polygonDrawn = new EventEmitter<any>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  async ngOnInit() {



    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // this.L = await import('leaflet');
      // await import('leaflet-draw');

      // const map = this.L.map('map').setView([51.505, -0.09], 13);
      // this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   maxZoom: 19,
      // }).addTo(map);

      // this.map = map;
      // this.addDrawControl();

      const leaflet = await import('leaflet');
      this.L = leaflet.default ?? leaflet;

      await import('leaflet-draw');

      const map = this.L.map('map').setView([51.505, -0.09], 13);
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      this.map = map;
      this.addDrawControl();
    }

    if (this.existingPolygon) {
      try {
        const coords = JSON.parse(this.existingPolygon);
        const latlngs = coords[0].map(([lng, lat]: [number, number]) => this.L.latLng(lat, lng));

        const polygon = this.L.polygon(latlngs, { color: 'blue' }).addTo(this.map);
        const drawnItems = new this.L.FeatureGroup();
        drawnItems.addLayer(polygon);
        this.map.fitBounds(polygon.getBounds());
      } catch (e) {
        console.error('Invalid polygon format:', e);
      }
    }

  }

  private addDrawControl(): void {
    if (!this.map) return;

    const drawnItems = new this.L.FeatureGroup();
    this.map.addLayer(drawnItems);

    const drawControl = new this.L.Control.Draw({
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
    //const drawEvent = (window as any).L?.Draw?.Event?.CREATED;
    const drawEvent = this.L?.Draw?.Event?.CREATED;

    if (drawEvent) {
      // 🟢 Handle polygon creation
      this.map.on(drawEvent, (event: any) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);

        const latlngs = layer.getLatLngs();
        const rawCoords = latlngs[0].map((latlng: any) => [latlng.lng, latlng.lat]);

        if (
          rawCoords.length > 0 &&
          (rawCoords[0][0] !== rawCoords[rawCoords.length - 1][0] ||
            rawCoords[0][1] !== rawCoords[rawCoords.length - 1][1])
        ) {
          rawCoords.push([...rawCoords[0]]);
        }

        const polygon = [rawCoords];
        console.log('Polygon Created:', polygon);
        this.polygonDrawn.emit(polygon);
      });
    } else {
      console.error('L.Draw.Event not found');
    }

    // 🟢 Handle polygon editing
    this.map.on('draw:edited', (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: any) => {
        const editedLatLngs = layer.getLatLngs()[0];
        const coords = editedLatLngs.map((latlng: any) => [latlng.lng, latlng.lat]);

        // Close polygon if needed
        if (
          coords.length > 0 &&
          (coords[0][0] !== coords.at(-1)[0] || coords[0][1] !== coords.at(-1)[1])
        ) {
          coords.push([...coords[0]]);
        }

        const updatedPolygon = [coords];
        console.log('Polygon Edited:', updatedPolygon);
        this.polygonDrawn.emit(updatedPolygon);
      });
    });
  }


}
