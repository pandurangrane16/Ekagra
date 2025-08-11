import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';

@Component({
    selector: 'app-admin-dashboard',
    imports: [],
    standalone:true,
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private map: any;
  private L: any;
  private siteLocations = [
    {
      siteId: '101',
      siteName: 'London Site A',
      lat: '51.5074',   
      long: '-0.1278',  
      description: 'Near Big Ben'
    },
    {
      siteId: '102',
      siteName: 'London Site B',
      lat: '51.509',   
      long: '-0.087',   
      description: 'Near Tower Bridge'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const leaflet = await import('leaflet');
      this.L = leaflet;
      this.initMap();
      this.addMarkers(); 
    }
  }

  private initMap(): void {
    this.map = this.L.map('map', {
      center: [51.505, -0.09],
      zoom: 13
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }


  private addMarkers(): void {
    const brightIcon = this.L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    const vmdDivIcon = this.L.divIcon({
      html: '<div style="background:#e91e63; color:white; padding:6px 10px; border-radius:8px; font-weight:bold;">VMD</div>',
      className: '',  // removes default styles
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35]
    });
  
    this.siteLocations.forEach(site => {
      const lat = parseFloat(site.lat);
      const lng = parseFloat(site.long);
  
      const marker = this.L.marker([lat, lng], { icon: vmdDivIcon }).addTo(this.map);
  
      const popupContent = `
        <strong>${site.siteName}</strong><br/>
        Description: ${site.description}<br/>
        Hardcoded Info: ${JSON.stringify({ status: 'active', assigned: true })}
      `;
  
      marker.bindPopup(popupContent);
    });
  }
  
 



}
