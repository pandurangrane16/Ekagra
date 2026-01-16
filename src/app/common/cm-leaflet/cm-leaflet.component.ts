// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { Component, Inject, Input, OnInit, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
// //let L: any;
// //import 'leaflet-draw';

// @Component({
//   selector: 'app-cm-leaflet',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './cm-leaflet.component.html',
//   styleUrls: ['./cm-leaflet.component.css']
// })
// export class CmLeafletComponent implements OnInit {
//   private map: any;
//   private L: any;
//   isBrowser = false;

//   @Input() showMap: any;
//   @Input() projectName: string = '';
//   @Input() enableDraw: boolean = true;
//   @Input() existingPolygon: string | null = null;
//   @Input() labelList: any[] = [];
//   @Input() siteData: any[] = [];
//   @Output() polygonDrawn = new EventEmitter<any>();
//   @Output() markerClicked = new EventEmitter<string>();
//   @Input() popupData: { [siteId: string]: any } = {};
//  sites: any[] = []; 
// markerMap: Map<string, any> = new Map(); 

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

//   async ngOnInit() {

//  console.log("received data2",this.siteData)
//   console.log("received data3",this.labelList)

//     this.isBrowser = isPlatformBrowser(this.platformId);
// debugger;
//     if (this.isBrowser) {
//       debugger;
//       // this.L = await import('leaflet');

//       // await import('leaflet-draw');

//       // const map = this.L.map('map').setView([51.505, -0.09], 13);
//       // this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       //   maxZoom: 19,
//       // }).addTo(map);

//       // this.map = map;
//       // this.addDrawControl();

//       const leaflet = await import('leaflet');
//       this.L = leaflet.default ?? leaflet;

//       await import('leaflet-draw');
//       //await import('leaflet.markercluster');

//       const map = this.L.map('map').setView([51.505, -0.09], 13);
//       this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//       }).addTo(map);

//       this.map = map;
//      if (this.enableDraw) {
//   this.addDrawControl();
// }
//     }

//     if (this.existingPolygon) {
//       try {
//         const coords = JSON.parse(this.existingPolygon);
//         const latlngs = coords[0].map(([lng, lat]: [number, number]) => this.L.latLng(lat, lng));

//         const polygon = this.L.polygon(latlngs, { color: 'blue' }).addTo(this.map);
//         const drawnItems = new this.L.FeatureGroup();
//         drawnItems.addLayer(polygon);
//         this.map.fitBounds(polygon.getBounds());
//       } catch (e) {
//         console.error('Invalid polygon format:', e);
//       }
//     }
//     if (this.siteData?.length > 0) {
//       debugger;
//       console.log("received data",this.siteData)
//  if (this.projectName?.toLowerCase() === 'pa') {
//         this.plotSitesForPA(this.siteData);
//     } else {
//         // Default plotting method for all other projects
//         this.plotSitesOnMap(this.siteData);
//     }
// }

//   }

//   private addDrawControl(): void {
//     if (!this.map) return;

//     const drawnItems = new this.L.FeatureGroup();
//     this.map.addLayer(drawnItems);

//     const drawControl = new this.L.Control.Draw({
//       edit: {
//         featureGroup: drawnItems,
//       },
//       draw: {
//         polygon: {
//           allowIntersection: false,
//           shapeOptions: {
//             color: 'green',
//           },
//         },
//         polyline: false,
//         rectangle: false,
//         circle: false,
//         marker: false,
//         circlemarker: false,
//       },
//     });

//     this.map.addControl(drawControl);

//     // ✅ Fix: Access L.Draw via window.L (browser global)
//     //const drawEvent = (window as any).L?.Draw?.Event?.CREATED;
//     const drawEvent = this.L?.Draw?.Event?.CREATED;

//     if (drawEvent) {
//       // 🟢 Handle polygon creation
//       this.map.on(drawEvent, (event: any) => {
//         const layer = event.layer;
//         drawnItems.addLayer(layer);

//         const latlngs = layer.getLatLngs();
//         const rawCoords = latlngs[0].map((latlng: any) => [latlng.lng, latlng.lat]);

//         if (
//           rawCoords.length > 0 &&
//           (rawCoords[0][0] !== rawCoords[rawCoords.length - 1][0] ||
//             rawCoords[0][1] !== rawCoords[rawCoords.length - 1][1])
//         ) {
//           rawCoords.push([...rawCoords[0]]);
//         }

//         const polygon = [rawCoords];
//         console.log('Polygon Created:', polygon);
//         this.polygonDrawn.emit(polygon);
//       });
//     } else {
//       console.error('L.Draw.Event not found');
//     }

//     // 🟢 Handle polygon editing
//     this.map.on('draw:edited', (event: any) => {
//       const layers = event.layers;
//       layers.eachLayer((layer: any) => {
//         const editedLatLngs = layer.getLatLngs()[0];
//         const coords = editedLatLngs.map((latlng: any) => [latlng.lng, latlng.lat]);

//         // Close polygon if needed
//         if (
//           coords.length > 0 &&
//           (coords[0][0] !== coords.at(-1)[0] || coords[0][1] !== coords.at(-1)[1])
//         ) {
//           coords.push([...coords[0]]);
//         }

//         const updatedPolygon = [coords];
//         console.log('Polygon Edited:', updatedPolygon);
//         this.polygonDrawn.emit(updatedPolygon);
//       });
//     });
//   }


// private plotSitesOnMap(sites: any[]): void {
//   debugger;
//   if (!this.map || !this.L) return;

//   const bounds = this.L.latLngBounds([]);
//   let plottedCount = 0;

//   this.sites = sites; 

//   for (const site of sites) {
//     const lat = parseFloat(site.lat);
//     const lng = parseFloat(site.long);

//     if (isNaN(lat) || isNaN(lng)) continue;

//     const latlng = this.L.latLng(lat, lng);
//     bounds.extend(latlng);

//     const icon = this.L.icon({
//       iconUrl: site.mapIconUrl,
//       iconSize: [30, 30],
//       iconAnchor: [15, 30],
//       popupAnchor: [0, -30],
//       className: 'custom-map-icon'
//     });

//     const marker = this.L.marker(latlng, { icon });

//     // Store marker reference by siteId so we can bind popup later
//     if (!this.markerMap) this.markerMap = new Map<string, any>();
//     this.markerMap.set(site.siteId, marker);

// // Define a cleaner layout with Site Name as a header and Site ID as sub-text
// const tooltipHtml = `
//   <div style="
//     padding: 4px; 
//     line-height: 1.4; 
//     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//   ">
//     <div style="font-weight: bold; font-size: 13px; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 4px; padding-bottom: 2px;">
//       ${site.siteName}
//     </div>
//     <div style="font-size: 11px; color: #bdc3c7;">
//       ID: <span style="color: #3498db; font-weight: bold;">${site.siteId}</span>
//     </div>
//   </div>
// `;

// marker.bindTooltip(tooltipHtml, {
//   direction: 'top',
//   offset: [0, -20],
//   sticky: true,
//   opacity: 0.95,
//   className: 'custom-tooltip' // We will style the container in CSS below
// });

//     marker.on('click', () => {
//       this.markerClicked.emit(site.siteId); 
//       this.waitAndBindPopup(site.siteId, marker);
//     });

//     marker.addTo(this.map);
//     plottedCount++;
//   }

//   console.log(`✅ Total sites plotted on map: ${plottedCount}`);

//   if (bounds.isValid()) {
//     this.map.fitBounds(bounds, { padding: [30, 30] });
//   }
// }

// private plotSitesForPA(sites: any[]): void {
//   debugger;
//   if (!this.map || !this.L) return;

//   const bounds = this.L.latLngBounds([]);
//   let plottedCount = 0;

//   this.sites = sites; 

//   for (const site of sites) {
//     const lat = parseFloat(site.lat);
//     const lng = parseFloat(site.lon);

//     if (isNaN(lat) || isNaN(lng)) continue;

//     const latlng = this.L.latLng(lat, lng);
//     bounds.extend(latlng);
// const placeholderIcon = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
//     const icon = this.L.icon({
//       iconUrl: placeholderIcon,
//       iconSize: [30, 30],
//       iconAnchor: [15, 30],
//       popupAnchor: [0, -30],
//       className: 'custom-map-icon'
//     });

//     const marker = this.L.marker(latlng, { icon });

//     // Store marker reference by siteId so we can bind popup later
//     if (!this.markerMap) this.markerMap = new Map<string, any>();
//     this.markerMap.set(site.name, marker);

// // Define a cleaner layout with Site Name as a header and Site ID as sub-text
// const tooltipHtml = `
//   <div style="
//     padding: 4px; 
//     line-height: 1.4; 
//     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//   ">
//     <div style="font-weight: bold; font-size: 13px; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 4px; padding-bottom: 2px;">
//       ${site.name}
//     </div>

//   </div>
// `;

// marker.bindTooltip(tooltipHtml, {
//   direction: 'top',
//   offset: [0, -20],
//   sticky: true,
//   opacity: 0.95,
//   className: 'custom-tooltip' // We will style the container in CSS below
// });

// marker.on('click', () => {

//     const popupHtml = this.generatePaSitePopup(site);
//     marker.bindPopup(popupHtml).openPopup();

// });

//     marker.addTo(this.map);
//     plottedCount++;
//   }

//   console.log(`✅ Total sites plotted on map: ${plottedCount}`);

//   if (bounds.isValid()) {
//     this.map.fitBounds(bounds, { padding: [30, 30] });
//   }
// }
// // private waitAndBindPopup(siteId: string, marker: any): void {
// //   const maxAttempts = 10;
// //   let attempts = 0;

// //   const checkAndBind = () => {
// //     const siteData = this.popupData?.[siteId];

// //     if (siteData) {
// //       const popupHtml = this.generatePopupHtml(siteId, this.popupData);
// //       marker.bindPopup(popupHtml).openPopup();
// //            marker.on('popupclose', () => {
// //         delete this.popupData[siteId];
// //       });
// //     } else if (attempts < maxAttempts) {
// //       attempts++;
// //       setTimeout(checkAndBind, 200); 
// //     } else {
// //       console.warn(`Popup data not available after waiting for siteId: ${siteId}`);
// //     }
// //   };

// //   checkAndBind();
// // }

// private waitAndBindPopup(siteId: string, marker: any): void {
//   const maxAttempts = 10;
//   let attempts = 0;

//   const checkAndBind = () => {
//     const rawData = this.popupData?.[siteId];
// debugger;
//     if (rawData) {
//       let isError = false;

//       // 1. Check if the response is the error string you provided
//       // We look for "status":500 inside the result string
//       // if (typeof rawData === 'string' && rawData.includes('"status":500')) {
//       //   isError = true;
//       // }

//       // 2. Pass the error flag to the generator
//       var popupHtml = this.generatePopupHtml(siteId, this.popupData, isError);
//       marker.bindPopup(popupHtml).openPopup();

//       // marker.on('popupclose', () => {
//       //   console.log('Popup closed for siteId:', siteId);
//       //   debugger;
//       //   delete this.popupData[siteId];
//       // });

//     } else if (attempts < maxAttempts) {
//       attempts++;
//       setTimeout(checkAndBind, 200); 
//     } else {
//       // 3. Timeout fallback: Show unavailable message
//       const popupHtml = this.generatePopupHtml(siteId, null, true);
//       marker.bindPopup(popupHtml).openPopup();
//       console.warn(`Popup data timeout for siteId: ${siteId}`);
//     }
//   };

//   checkAndBind();
// }

// private generatePaSitePopup(site: any): string {
//   const statusColor = site.isReachable ? '#27ae60' : '#e74c3c';

//   return `
//     <div style="font-family: 'Segoe UI', Tahoma, sans-serif; padding: 5px; min-width: 220px;">
//       <h3 style="margin: 0 0 10px 0; color: #2c3e50; border-bottom: 2px solid ${statusColor}; padding-bottom: 5px;">
//         ${site.name || 'Unknown Site'}
//       </h3>
//       <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
//         ${this.createPopupRow('Status', site.Status, statusColor, true)}
//         ${this.createPopupRow('Site ID', site.id)}
//         ${this.createPopupRow('SIP Name', site.sipName)}
//         ${this.createPopupRow('Extension', site.extension)}
//         ${this.createPopupRow('Zone', site.zoneNames || 'None')}
//         ${this.createPopupRow('Groups', site.groupNames || 'None')}
//         ${this.createPopupRow('Lat', site.lat)}
//         ${this.createPopupRow('Long', site.lon)}
//         ${this.createPopupRow('Reachable', site.isReachable ? 'Yes' : 'No')}
//       </table>
//     </div>
//   `;
// }

// // Helper to keep the code clean
// private createPopupRow(label: string, value: any, color: string = '#2c3e50', isBold: boolean = false): string {
//   return `
//     <tr style="border-bottom: 1px solid #f1f1f1;">
//       <td style="padding: 6px 0; color: #7f8c8d; font-weight: 500;">${label}</td>
//       <td style="padding: 6px 0; text-align: right; color: ${color}; font-weight: ${isBold ? 'bold' : 'normal'};">
//         ${value ?? '-'}
//       </td>
//     </tr>
//   `;
// }

// // private generatePopupHtml(siteId: string, statusData: any): string {
// //   const site = this.sites.find(s => s.siteId === siteId);
// //   const lat = site?.lat ?? '';
// //   const lng = site?.long ?? '';

// //   const controllerData =statusData?.[siteId]?.controller ?? {};
// //   const controllerKeys = Object.keys(controllerData);

// //   const mapLabelsHtml = this.labelList
// //     .filter(label => label.mapLabel)
// //     .map(label => {
// //       const labelKey = label.mapLabel;
// //       let value;

// //       if (controllerData.hasOwnProperty(labelKey)) {
// //         value = controllerData[labelKey];
// //       } else {
// //         const randomKey = controllerKeys[Math.floor(Math.random() * controllerKeys.length)];
// //         value = controllerData[randomKey];
// //       }

// //       // Format value for display
// //       if (Array.isArray(value)) {
// //         value = value.join(', ');
// //       } else if (value === null || value === undefined) {
// //         value = '—';
// //       }

// //       return `<li><strong>${labelKey}:</strong> ${value}</li>`;
// //     })
// //     .join('');

// //   return `
// //     <div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.2; max-width: 200px;">
// //       <strong style="font-size: 12px;">${site?.siteName ?? 'Unknown Site'}</strong>
// //       <p style="margin: 2px 0;"><strong>Coords:</strong> ${lat}, ${lng}</p>
// //       <div style="margin-top: 4px;">
// //         <strong>Status Info:</strong>
// //         <ul style="padding-left: 14px; margin: 2px 0;">
// //           ${mapLabelsHtml}
// //         </ul>
// //       </div>
// //     </div>
// //   `;
// // }


//   getMode(input: number): string {
//     switch (input) {
//       case 3: return "Adaptive Mode";
//       case 4: return "Cableless Mode";
//       case 5: return "Auxiliary Mode";
//       case 6: return "VA Mode";
//       case 7: return "Manual Mode";
//       case 8: return "Hurry Call Mode";
//       default: return "";
//     }
//   }

//   getHealth(input: number): string {
//     switch (input) {
//       case 2: return "Boot up Success";
//       case 3: return "Startup Flash";
//       case 4: return "Startup Red";
//       case 5: return "Plan running";
//       case 6: return "Plan Stopped";
//       case 7: return "POPA Flash";
//       case 8: return "POPA Lamp Off";
//       case 9: return "POPA All Red";
//       case 10: return "POPA Manual";
//       case 11: return "POPA S1";
//       case 12: return "POPA Hurry Call";
//       case 13: return "POPA Step";
//       case 14: return "POPA Panel test";
//       case 15: return "POPA VA";
//       case 16: return "Intra Conflict";
//       case 17: return "Inter Conflict";
//       case 18: return "Voltage Fail";
//       case 19: return "Frequency Fails";
//       case 20: return "Overload";
//       case 21: return "Phase reversal";
//       case 22: return "Lamp Fail";
//       case 23: return "Traffic Error";
//       case 24: return "Jn Recovered";
//       case 25: return "Jn Flash Mode";
//       case 30: return "Siteid error";
//       case 31: return "LMS Error";
//       case 32: return "RTC Error";
//       case 33: return "Traffic Error";
//       case 34: return "POPA S2";
//       case 35: return "SENSETXFORMER";
//       default: return "";
//     }
//   }


// // private generatePopupHtml(siteId: string, statusData: any): string {
// //   const site = this.sites.find(s => s.siteId === siteId);
// //   const lat = site?.lat ?? '';
// //   const lng = site?.long ?? '';

// //   const controllerData = statusData?.[siteId]?.controller ?? {};

// //   const mapLabelsHtml = this.labelList.map(label => {
// //     let value: any;

// //     switch (label.key) {
// //       case 'sl':
// //         // special case: nested in jnAdaptiveInfo
// //         value = (controllerData.jnAdaptiveInfo?.CoordPhaseSaturationLevel ?? 0) * 100;
// //         break;

// //       case 'm':
// //         // call your getMode method
// //         value = this.getMode(controllerData[label.key]);
// //         break;

// //       case 'h':
// //         // call your getHealth method
// //         value = this.getHealth(controllerData[label.key]);
// //         break;

// //       default:
// //         // default: take value directly
// //         value = controllerData[label.key];
// //         break;
// //     }

// //     // handle null/undefined nicely
// //     if (value === null || value === undefined || value === '') {
// //       value = '—';
// //     }

// //     return `<li><strong>${label.label}:</strong> ${value}</li>`;
// //   }).join('');

// //   return `
// //     <div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.2; max-width: 200px;">
// //       <strong style="font-size: 12px;">${site?.siteName ?? 'Unknown Site'}</strong>
// //       <p style="margin: 2px 0;"><strong>Coords:</strong> ${lat}, ${lng}</p>
// //       <div style="margin-top: 4px;">
// //         <strong>Status Info:</strong>
// //         <ul style="padding-left: 14px; margin: 2px 0;">
// //           ${mapLabelsHtml}
// //         </ul>
// //       </div>
// //     </div>
// //   `;
// // }


// // private generatePopupHtml(siteId: string, statusData: any): string {
// //   const site = this.sites.find(s => s.siteId === siteId);
// //   const lat = site?.lat ?? '';
// //   const lng = site?.long ?? '';

// //   const controllerData = statusData?.[siteId]?.controller ?? {};

// //   const rowsHtml = this.labelList.map(label => {
// //     let value: any;

// //     switch (label.key) {
// //       case 'sl':
// //         value = (controllerData.jnAdaptiveInfo?.CoordPhaseSaturationLevel ?? 0) * 100;
// //         break;
// //       case 'm':
// //         value = this.getMode(controllerData[label.key]);
// //         break;
// //       case 'h':
// //         value = this.getHealth(controllerData[label.key]);
// //         break;
// //       default:
// //         value = controllerData[label.key];
// //         break;
// //     }

// //     if (value === null || value === undefined || value === '') {
// //       value = '—';
// //     }

// //     return `
// //       <tr>
// //         <td style="padding: 4px 8px; font-weight: bold; color: #333;">${label.label}</td>
// //         <td style="padding: 4px 8px; color: #555;">${value}</td>
// //       </tr>
// //     `;
// //   }).join('');

// //   return `
// //     <div style="font-family: Arial, sans-serif; font-size: 12px; max-width: 280px;">
// //       <div style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 6px; color: #2c3e50;">
// //         ${site?.siteName ?? 'Unknown Site'}
// //       </div>

// //       <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; border-radius: 4px; overflow: hidden;">
// //         <tbody>
// //           ${rowsHtml}
// //         </tbody>
// //       </table>
// //     </div>
// //   `;
// // }


// private generatePopupHtml(siteId: string, statusData: any, isError: boolean = false): string {
//   debugger;
//   const site = this.sites.find(s => s.siteId === siteId);
//   const siteName = site?.siteName ?? 'Unknown Site';

//   // Header template used for both success and error states
//   const headerHtml = `
//     <div style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px;">
//       ${siteName}
//     </div>
//   `;

//   // 1. Check for Error State or Missing Data
//   if (isError || !statusData || !statusData[siteId]) {
//     return `
//       <div style="font-family: Arial, sans-serif; font-size: 12px; width: 220px; padding: 5px;">
//         ${headerHtml}
//         <div style="background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 12px; border-radius: 4px; text-align: center; margin-top: 5px;">
//           <div style="font-size: 18px; margin-bottom: 4px;">⚠️</div>
//           <strong style="display: block; margin-bottom: 2px;">Data Unavailable</strong>
//           <span style="font-size: 10px; opacity: 0.8;">The server encountered an error for this site (500).</span>
//         </div>
//       </div>
//     `;
//   }

//   // 2. Normal Data Processing
// else{
//     const controllerData = statusData[siteId]?.controller ?? {};

//   const rowsHtml = this.labelList.map(label => {
//     let value: any;

//     switch (label.key) {
//       case 'sl':
//         value = (controllerData.jnAdaptiveInfo?.CoordPhaseSaturationLevel ?? 0) * 100;
//         if (!isNaN(value)) value = value.toFixed(1) + '%';
//         break;
//       case 'm':
//         value = this.getMode(controllerData[label.key]);
//         break;
//       case 'h':
//         value = this.getHealth(controllerData[label.key]);
//         break;
//       default:
//         value = controllerData[label.key];
//         break;
//     }

//     if (value === null || value === undefined || value === '') {
//       value = '—';
//     }

//     return `
//       <tr>
//         <td style="padding: 6px 8px; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">${label.label}</td>
//         <td style="padding: 6px 8px; color: #555; border-bottom: 1px solid #eee;">${value}</td>
//       </tr>
//     `;
//   }).join('');

//   return `
//     <div style="font-family: Arial, sans-serif; font-size: 12px; min-width: 240px; max-width: 280px;">
//       ${headerHtml}
//       <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; border-radius: 4px; overflow: hidden; border: 1px solid #eee;">
//         <tbody>
//           ${rowsHtml}
//         </tbody>
//       </table>
//     </div>
//   `;
// }
// }













// }







import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SessionService } from '../../services/common/session.service';

import { Component, Inject, Input, Output, EventEmitter, OnInit, PLATFORM_ID } from '@angular/core';

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
  private drawnItems: any;
  private markerCluster: any;

  isBrowser = false;

  @Input() showMap = true;
  @Input() projectName: string = '';
  @Input() enableDraw: boolean = true;
  @Input() existingPolygon: string | null = null;
  @Input() labelList: any[] = [];
  @Input() siteData: any[] = [];
  @Input() popupData: { [siteId: string]: any } = {};
  @Input() useMarkerCluster: boolean = false;

  @Output() polygonDrawn = new EventEmitter<any>();
  @Output() markerClicked = new EventEmitter<string>();

  sites: any[] = [];
  markerMap: Map<string, any> = new Map();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  async ngOnInit() {

    debugger;
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    // 1️⃣ Dynamic Leaflet import
    const leaflet = await import('leaflet');
    this.L = leaflet.default ?? leaflet;
    await import('leaflet-draw');
    if (this.useMarkerCluster) await import('leaflet.markercluster');

    

    // 2️⃣ Initialize Map
    this.map = this.L.map('map').setView([51.505, -0.09], 13);
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.map);

    // 3️⃣ Enable drawing if configured
    if (this.enableDraw) this.addDrawControl();
  debugger;
    // 4️⃣ Render existing polygon
    if (this.existingPolygon) this.renderExistingPolygon(this.existingPolygon);

    // 5️⃣ Plot markers
    // if (this.siteData?.length) this.plotSites();


      if (this.siteData?.length > 0) {
       debugger;
       console.log("received data",this.siteData)
  if (this.projectName?.toLowerCase() === 'pa') {
         this.plotSitesForPA(this.siteData);
     } else {
         // Default plotting method for all other projects
         this.plotSites();
     }
}
  }


  private generatePaSitePopup(site: any): string {
  const statusColor = site.isReachable ? '#27ae60' : '#e74c3c';

  return `
    <div style="padding: 5px; min-width: 220px;">
      <h6 style="margin: 0 0 10px 0; color: #2c3e50; border-bottom: 2px solid ${statusColor}; padding-bottom: 5px; text-transform:capitalize">
        ${site.name || 'Unknown Site'}
      </h3>
      <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
        ${this.createPopupRow('Status', site.Status, statusColor, true)}
        ${this.createPopupRow('Site ID', site.id)}
        ${this.createPopupRow('SIP Name', site.sipName)}
        ${this.createPopupRow('Extension', site.extension)}
        ${this.createPopupRow('Zone', site.zoneNames || 'None')}
        ${this.createPopupRow('Groups', site.groupNames || 'None')}
        ${this.createPopupRow('Lat', site.lat)}
        ${this.createPopupRow('Long', site.lon)}
        ${this.createPopupRow('Reachable', site.isReachable ? 'Yes' : 'No')}
      </table>
    </div>
  `;
}

// Helper to keep the code clean
private createPopupRow(label: string, value: any, color: string = '#2c3e50', isBold: boolean = false): string {
  return `
    <tr style="border-bottom: 1px solid #f1f1f1;">
      <td style="padding: 6px 0; color: #7f8c8d; font-weight: 500; text-transform:capitalize">${label}</td>
      <td style="padding: 6px 0; text-align: right; color: ${color}; font-weight: ${isBold ? 'bold' : 'normal'};">
        ${value ?? '-'}
      </td>
    </tr>
  `;
}

private getStatusIcon(status: string): string {
  const iconPath = 'assets/img/';
  const s = status?.toLowerCase().trim();

  // 1. Ongoing Category
  if (s === 'ongoing') {
    return `${iconPath}pa_green.png`;
  }

  // 2. Registered / Online Category (Blue Icon)
  // Including your new cases: hangup, transferred, hold, etc.
  const registeredCases = [
    'registered', 'up', 'ring', 'ringing', 
    'hangup', 'transferred', 'hold', 'unreachable', 'reachable', 
    'lagged', 'down', 'rsrvd', 'offhook', 'dialing', 'busy', 
    'dialing offhook', 'pre-ring'
  ];

  if (registeredCases.includes(s)) {
    return `${iconPath}pa_blue.png`;
  }

  // 3. Unregistered / Offline Category (Grey Icon)
  const offlineCases = [
    'unregistered', 'offline', 'device not configured', 'rejected','not configured'
  ];

  if (offlineCases.includes(s)) {
    return `${iconPath}pa_grey.png`;
  }

  // Default fallback
  return `${iconPath}pa_grey.png`;
}


  private plotSitesForPA(sites: any[]): void {
  debugger;
  if (!this.map || !this.L) return;

  const bounds = this.L.latLngBounds([]);
  let plottedCount = 0;

  this.sites = sites; 

  for (const site of sites) {
    const lat = parseFloat(site.lat);
    const lng = parseFloat(site.lon);

    if (isNaN(lat) || isNaN(lng)) continue;

  

    const latlng = this.L.latLng(lat, lng);
    bounds.extend(latlng);
const placeholderIcon = this.getStatusIcon(site.Status);
    const icon = this.L.icon({
      iconUrl: placeholderIcon,
  iconSize: [25, 25],     // Adjusted for typical PA icons
    iconAnchor: [12, 25],   // Anchor at the bottom center
    popupAnchor: [0, -25],
      className: 'custom-map-icon'
    });

    const marker = this.L.marker(latlng, { icon });

    // Store marker reference by siteId so we can bind popup later
    if (!this.markerMap) this.markerMap = new Map<string, any>();
    this.markerMap.set(site.name, marker);

// Define a cleaner layout with Site Name as a header and Site ID as sub-text
const tooltipHtml = `
  <div style="
    padding: 4px; 
    line-height: 1.4; 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  ">
    <div style="font-weight: bold; font-size: 13px; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 4px; padding-bottom: 2px;">
      ${site.name}
    </div>

    <div style="font-size: 11px; color: rgba(255,255,255,0.85); display: flex; align-items: center;">
      <span style="margin-right: 4px;">Status:</span>
      <span style="font-weight: 600; color: #fff;">${site.status || site.Status || 'N/A'}</span>
    </div>
  </div>
`;

marker.bindTooltip(tooltipHtml, {
  direction: 'top',
  offset: [0, -20],
  sticky: true,
  opacity: 0.95,
  className: 'custom-tooltip' // We will style the container in CSS below
});

// marker.on('click', () => {

//     const popupHtml = this.generatePaSitePopup(site);
//     marker.bindPopup(popupHtml).openPopup();

// });

marker.on('click', () => {
  const siteId = site.name; // PA uses name as ID

  marker.unbindPopup(); // 🔥 important
  const popupHtml = this.generatePaSitePopup(site);
  marker.bindPopup(popupHtml, { autoClose: true, closeOnClick: true }).openPopup();
});




    marker.addTo(this.map);
    plottedCount++;
  }

  console.log(`✅ Total sites plotted on map: ${plottedCount}`);

  if (bounds.isValid()) {
    this.map.fitBounds(bounds, { padding: [30, 30] });
  }
}

  

  private addDrawControl(): void {
    this.drawnItems = new this.L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    const drawControl = new this.L.Control.Draw({
      edit: { featureGroup: this.drawnItems },
      draw: { polygon: { allowIntersection: false, shapeOptions: { color: 'green' } }, polyline: false, rectangle: false, circle: false, marker: false, circlemarker: false }
    });

    this.map.addControl(drawControl);

    const drawEvent = this.L?.Draw?.Event?.CREATED;
    if (!drawEvent) return;

    this.map.on(drawEvent, (e: any) => {
      const layer = e.layer;
      this.drawnItems.addLayer(layer);
      const latlngs = layer.getLatLngs()[0];
      const coords = latlngs.map((p: any) => [p.lng, p.lat]);
      if (coords.length && (coords[0][0] !== coords.at(-1)[0] || coords[0][1] !== coords.at(-1)[1])) coords.push([...coords[0]]);
      this.polygonDrawn.emit([coords]);
    });

    this.map.on('draw:edited', (e: any) => {
      e.layers.eachLayer((layer: any) => {
        const latlngs = layer.getLatLngs()[0];
        const coords = latlngs.map((p: any) => [p.lng, p.lat]);
        if (coords.length && (coords[0][0] !== coords.at(-1)[0] || coords[0][1] !== coords.at(-1)[1])) coords.push([...coords[0]]);
        this.polygonDrawn.emit([coords]);
      });
    });
  }

  // private renderExistingPolygon(polygonStr: string) {
  //   try {
  //     const coords = JSON.parse(polygonStr);
  //     const latlngs = coords[0].map(([lng, lat]: [number, number]) => this.L.latLng(lat, lng));
  //     const polygon = this.L.polygon(latlngs, { color: 'blue' }).addTo(this.map);
  //     this.drawnItems = new this.L.FeatureGroup();
  //     this.drawnItems.addLayer(polygon);
  //     this.map.fitBounds(polygon.getBounds());
  //   } catch (e) {
  //     console.error('Invalid polygon format:', e);
  //   }
  // }

  private renderExistingPolygon(polygonStr: string) {
    debugger;
  try {
    // 1. Parse the string into an array of polygons
    const allPolygonCoords = JSON.parse(polygonStr); 

    // 2. Initialize the FeatureGroup once (before the loop)
    // This allows all polygons to be part of the same editable group
    if (!this.drawnItems) {
      this.drawnItems = new this.L.FeatureGroup();
      this.map.addLayer(this.drawnItems);
    }

    // 3. Loop through the array of polygons
    allPolygonCoords.forEach((singlePolyCoords: any) => {
      // Check if it's nested (GeoJSON style usually has coords in the first index)
      const ring = Array.isArray(singlePolyCoords[0][0]) ? singlePolyCoords[0] : singlePolyCoords;

      const latlngs = ring.map(([lng, lat]: [number, number]) => this.L.latLng(lat, lng));
      
      const polygon = this.L.polygon(latlngs, { color: 'green' });
      
      // Add each polygon to the map and the FeatureGroup
      polygon.addTo(this.map);
      this.drawnItems.addLayer(polygon);
    });

    // 4. Zoom the map to fit ALL drawn polygons
    if (this.drawnItems.getLayers().length > 0) {
      this.map.fitBounds(this.drawnItems.getBounds(), { padding: [20, 20] });
    }

  } catch (e) {
    console.error('Invalid polygon format:', e);
  }
}






  private plotSites(): void {
    this.sites = this.siteData;
    const bounds = this.L.latLngBounds([]);
    let markersLayer: any = this.useMarkerCluster ? new this.L.MarkerClusterGroup() : null;

    for (const site of this.sites) {
      const lat = parseFloat(site.lat ?? site.latitude);
      const lng = parseFloat(site.long ?? site.lon ?? site.longitude);
      if (isNaN(lat) || isNaN(lng)) continue;

      const latlng = this.L.latLng(lat, lng);
      bounds.extend(latlng);

      const icon = this.L.icon({
        iconUrl: site.mapIconUrl ?? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      const marker = this.L.marker(latlng, { icon });
      this.markerMap.set(site.siteId ?? site.name, marker);

      marker.bindTooltip(`
        <div class="custom-tooltip">
          <div class="tooltip-title" style="text-transform:capitalize">${site.siteName ?? site.name}</div>
          <div>ID: ${site.siteId ?? site.name}</div>
        </div>
      `, { direction: 'top', offset: [0, -20], sticky: true, opacity: 0.95 });

      marker.on('click', () => {
        this.markerClicked.emit(site.siteId ?? site.name);
        this.waitAndBindPopup(site.siteId ?? site.name, marker);
      });

      if (this.useMarkerCluster) markersLayer.addLayer(marker);
      else marker.addTo(this.map);
    }

    if (this.useMarkerCluster && markersLayer) this.map.addLayer(markersLayer);
    if (bounds.isValid()) this.map.fitBounds(bounds, { padding: [30, 30] });
  }

  private waitAndBindPopup(siteId: string, marker: any): void {
    let attempts = 0;
    const maxAttempts = 10;

    const checkAndBind = () => {
      const data = this.popupData?.[siteId];
      const popupHtml = data ? this.generatePopupHtml(siteId, this.popupData) : (attempts >= maxAttempts ? this.generatePopupHtml(siteId, null, true) : null);

      if (popupHtml) {
        marker.unbindPopup();
        marker.bindPopup(popupHtml).openPopup();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkAndBind, 200);
      }
    };

    checkAndBind();
  }

  // private generatePopupHtml(siteId: string, statusData: any, isError = false): string {
  //   const site = this.sites.find(s => s.siteId === siteId) ?? { siteName: 'Unknown' };
  //   const header = `<div class="popup-header">${site.siteName}</div>`;

  //   if (isError || !statusData || !statusData[siteId]) {
  //     return `
  //       <div class="popup-container">
  //         ${header}
  //         <div class="popup-error">
  //           <div>⚠️</div>
  //           <strong>Data Unavailable</strong>
  //           <span>Server error (500)</span>
  //         </div>
  //       </div>
  //     `;
  //   }

  //   const controller = statusData[siteId]?.controller ?? {};
  //   const rowsHtml = this.labelList.map(label => {
  //     let value: any = controller[label.key];
  //     switch (label.key) {
  //       case 'sl':
  //         value = (controller.jnAdaptiveInfo?.CoordPhaseSaturationLevel ?? 0) * 100;
  //         if (!isNaN(value)) value = value.toFixed(1) + '%';
  //         break;
  //       case 'm': value = this.getMode(controller[label.key]); break;
  //       case 'h': value = this.getHealth(controller[label.key]); break;
  //     }
  //     if (value === null || value === undefined || value === '') value = '—';
  //     return `<tr><td>${label.label}</td><td>${value}</td></tr>`;
  //   }).join('');

  //   return `
  //     <div class="popup-container">
  //       ${header}
  //       <table class="popup-table">${rowsHtml}</table>
  //     </div>
  //   `;
  // }


  private generatePopupHtml(siteId: string, statusData: any, isError: boolean = false): string {
    debugger;
    const site = this.sites.find(s => s.siteId === siteId);
    const siteName = site?.siteName ?? 'Unknown Site';

    // Header template used for both success and error states
    const headerHtml = `
    <div style="text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; text-transform: capitalize;">
      ${siteName} 
    </div>
  `;

    // 1. Check for Error State or Missing Data
    if (isError || !statusData || !statusData[siteId]) {
      return `
      <div style="font-family: Arial, sans-serif; font-size: 12px; width: 220px; padding: 5px;">
        ${headerHtml}
        <div style="background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 12px; border-radius: 4px; text-align: center; margin-top: 5px;">
          <div style="font-size: 18px; margin-bottom: 4px;">⚠️</div>
          <strong style="display: block; margin-bottom: 2px;">Data Unavailable</strong>
          <span style="font-size: 10px; opacity: 0.8;">The server encountered an error for this site (500).</span>
        </div>
      </div>
    `;
    }

    // 2. Normal Data Processing
    else {
      const controllerData = statusData[siteId]?.controller ?? {};

      const rowsHtml = this.labelList.map(label => {
        let value: any;

        switch (label.key) {
          case 'sl':
            value = (controllerData.jnAdaptiveInfo?.CoordPhaseSaturationLevel ?? 0) * 100;
            if (!isNaN(value)) value = value.toFixed(1) + '%';
            break;
          case 'm':
            value = this.getMode(controllerData[label.key]);
            break;
          case 'h':
            value = this.getHealth(controllerData[label.key]);
            break;
          default:
            value = controllerData[label.key];
            break;
        }

        if (value === null || value === undefined || value === '') {
          value = '—';
        }

        return `
      <tr>
        <td style="padding: 6px 8px; font-weight: bold; color: #333; border-bottom: 1px solid #eee;">${label.label}</td>
        <td style="padding: 6px 8px; color: #555; border-bottom: 1px solid #eee;">${value}</td>
      </tr>
    `;
      }).join('');

      return `
    <div style="font-family: Arial, sans-serif; font-size: 12px; min-width: 240px; max-width: 280px;">
      ${headerHtml}
      <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; border-radius: 4px; overflow: hidden; border: 1px solid #eee;">
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
    }
  }

  getMode(input: number): string {
    const modes: Record<number, string> = { 3: "Adaptive Mode", 4: "Cableless Mode", 5: "Auxiliary Mode", 6: "VA Mode", 7: "Manual Mode", 8: "Hurry Call Mode" };
    return modes[input] ?? '';
  }

  getHealth(input: number): string {
    const health: Record<number, string> = {
      2: "Boot up Success", 3: "Startup Flash", 4: "Startup Red", 5: "Plan running", 6: "Plan Stopped",
      7: "POPA Flash", 8: "POPA Lamp Off", 9: "POPA All Red", 10: "POPA Manual", 11: "POPA S1",
      12: "POPA Hurry Call", 13: "POPA Step", 14: "POPA Panel test", 15: "POPA VA", 16: "Intra Conflict",
      17: "Inter Conflict", 18: "Voltage Fail", 19: "Frequency Fails", 20: "Overload", 21: "Phase reversal",
      22: "Lamp Fail", 23: "Traffic Error", 24: "Jn Recovered", 25: "Jn Flash Mode", 30: "Siteid error",
      31: "LMS Error", 32: "RTC Error", 33: "Traffic Error", 34: "POPA S2", 35: "SENSETXFORMER"
    };
    return health[input] ?? '';
  }
}
