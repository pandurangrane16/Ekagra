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
  @Input() labelList: any[] = [];
  @Input() siteData: any[] = [];
  @Output() polygonDrawn = new EventEmitter<any>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  async ngOnInit() {

 console.log("received data2",this.siteData)
  console.log("received data3",this.labelList)

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
      //await import('leaflet.markercluster');

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
    if (this.siteData?.length > 0) {
      console.log("received data",this.siteData)
  this.plotSitesOnMap(this.siteData);
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
private plotSitesOnMap(sites: any[]): void {
  if (!this.map || !this.L) return;

  const bounds = this.L.latLngBounds([]);

  let plottedCount = 0;

  for (const site of sites) {
    const lat = parseFloat(site.lat);
    const lng = parseFloat(site.long);

    if (isNaN(lat) || isNaN(lng)) continue;

    const latlng = this.L.latLng(lat, lng);
    bounds.extend(latlng);

    const icon = this.L.icon({
      iconUrl: site.mapIconUrl,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
      className: 'custom-map-icon'
    });

    const marker = this.L.marker(latlng, { icon });

// const mapLabelsHtml = this.labelList
//   .filter(label => label.mapLabel) 
//   .map(label => `<div>${label.mapLabel}</div>`)
//   .join('');

// marker.bindPopup(`
//   <strong>${site.siteName}</strong><br>
 
//   Lat: ${lat}<br>Lng: ${lng}<br>
//   ${mapLabelsHtml}
// `);
const mapLabelsHtml = this.labelList
  .filter(label => label.mapLabel)
  .map(label => `<li>${label.mapLabel}</li>`)
  .join('');

const popupHtml = `
  <div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.2; max-width: 180px;">
    <strong style="font-size: 12px;">${site.siteName}</strong>
    <p style="margin: 2px 0;"><strong>Coords:</strong> ${lat}, ${lng}</p>
    <div style="margin-top: 2px;">
      <strong>Labels:</strong>
      <ul style="padding-left: 14px; margin: 2px 0;">
        ${mapLabelsHtml}
      </ul>
    </div>
  </div>
`;

marker.bindPopup(popupHtml);


    marker.addTo(this.map); 
    plottedCount++;
  }

  console.log(`✅ Total sites plotted on map: ${plottedCount}`);

  if (bounds.isValid()) {
    this.map.fitBounds(bounds, { padding: [30, 30] });
  }
}








}
