import { Component,Inject, PLATFORM_ID,AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// import Map from 'ol/Map';
// import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { isPlatformBrowser } from '@angular/common';
import { OSM } from 'ol/source';
import { Map, View } from 'ol';
import FullScreen from 'ol/control/FullScreen';
import { useGeographic } from 'ol/proj'; // Import useGeographic


@Component({
    selector: 'app-mapview',
    imports: [],
    templateUrl: './mapview.component.html',
    styleUrl: './mapview.component.css'
})
export class MapviewComponent implements AfterViewInit {

  private map: any;
  private lat: any;
  private lng: any;

  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
 
  // Set the coordinate system to geographic (longitude, latitude)

  ngAfterViewInit(): void {

       this.lng = 35.7439626787339;
    this.lat = 51.3820966622855;
    if (typeof window !== 'undefined') {
      // Set the coordinate system to geographic (longitude, latitude)
      useGeographic();
      new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: this.mapElement.nativeElement, // Targeting the map element from the ViewChild
        view: new View({
          projection: 'EPSG:4326', // Ensure it's using the geographic projection (longitude, latitude)
          center: [this.lat, this.lng],
          zoom: 6,
        }),
      });

      // this.map.addControl(new FullScreen());
    }
   
  }

}
