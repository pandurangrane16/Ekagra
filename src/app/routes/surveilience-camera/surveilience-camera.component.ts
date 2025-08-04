import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { SurveillanceService } from '../../services/atcs/surveillance.service';
import { CUSTOM_ELEMENTS_SCHEMA ,NgModule } from '@angular/core';
import { PramglobalService } from '../../services/admin/pramglobal.service';
import { debug } from 'console';
import { ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


interface Section {
  name: string;
  img: string;
  expanded: boolean;
  siteId: number;
}
interface Location {
  locationId: number;
  locationName: string;
  sites: Site[];
}
interface Site {
  siteId: number;
  siteName: string;
  cameras: Camera[];
}
interface Camera {
  cameraId: number;
  cameraName: string;
}
@Component({
    selector: 'app-surveilience-camera',
    imports: [MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule, MatExpansionModule, CommonModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './surveilience-camera.component.html',
    styleUrl: './surveilience-camera.component.css'
})



export class SurveilienceCameraComponent {


loading: boolean = false;

  readonly panelOpenState = signal(false);
  locations: Location[] = [];
camera: Section[] = [
  {
    name: 'Camera 1',
    img: 'assets/img/cam1.jpg',
    expanded: false,
    siteId:0
  },
  {
    name: 'Camera 2',
    img: 'assets/img/cam2.jpg',
    expanded: false,
    siteId:1
  },
  {
    name: 'Camera 3',
    img: 'assets/img/cam3.jpg',
    expanded: false,
    siteId:2
  },
  {
    name: 'Camera 4',
    img: 'assets/img/cam4.jpg',
    expanded: false,
    siteId:3
  }
];





sites: Site[] = []; 

  constructor(private surveillanceService: SurveillanceService,
    private PramglobalService: PramglobalService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    try{
    debugger;
    const projectId = 1; // 🔁 Replace this with actual selected project id if needed
    this.surveillanceService
      .GetSiteLocationCameraListForSurveillance(projectId)
      .subscribe((res: any) => {
         const flatData = res?.result || [];
         console.log(flatData);
const groupedLocations = Object.values(
  flatData.reduce((acc: any, curr: any) => {
    const { locationId, locationName, siteId, siteName, cameraId, cameraName } = curr;

    if (!acc[locationId]) {
      acc[locationId] = {
        locationId,
        locationName,
        sites: []
      };
    }

    const location = acc[locationId];
    let site = location.sites.find((s: any) => s.siteId === siteId);
    if (!site) {
      site = {
        siteId,
        siteName,
        cameras: []
      };
      location.sites.push(site);
    }

    site.cameras.push({ cameraId, cameraName });
    return acc;
  }, {})
);

this.locations = groupedLocations as Location[];

const allSites = groupedLocations.flatMap((loc: any) => loc.sites);
const firstFourSites = allSites.slice(0, 4);

this.camera = firstFourSites.map((site: Site, index: number) => ({
  name: site.siteName,
  img: `assets/img/cam${index + 1}.jpg`,
  expanded: false,
  siteId: site.siteId
}));

console.log(groupedLocations);
      });

}
catch (error) {
    console.error('Caught error:', error);
  }


  } 



onCameraSelect(siteId: number, locId: number, camId: number) {
  debugger;
  const location = this.locations.find(l => l.locationId === locId);
  const site = location?.sites.find(s => s.siteId === siteId);
  const camera = site?.cameras.find(c => c.cameraId === camId);

  if (camera) {
    console.log('Selected Camera:', camera);
    // You can display details, open a modal, or fetch API data here
  }
}
 
 
  toggleExpand(cam: any): void {
    cam.expanded = !cam.expanded;  // Toggle the 'expanded' state of the clicked camera
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    document.body.classList.toggle('fullscreenDiv');
  }


embedUrl:string| null=null;
rfu2:string| null=null;
activeEmbedUrl: SafeResourceUrl | null = null;
async onSiteClick(siteId: number): Promise<void> {
  debugger;
    this.loading = true; // 🔄 Show loader

  try {
    const globalRes: any = await firstValueFrom(
      this.PramglobalService.GetAllGlobalValues('Project', siteId.toString())
    );

    this.embedUrl = globalRes.result[0]?.rfu1 || null;
    this.rfu2 = globalRes.result[0]?.rfu2 || null;

    if (this.embedUrl) {
      const streamRes: any = await firstValueFrom(
        this.surveillanceService.getLiveStreamUrl(siteId, this.embedUrl)
      );

      const embedUrl = streamRes.data?.embedurl + this.rfu2;
      this.activeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      console.log('activeEmbedUrl:', this.activeEmbedUrl);
    } else {
      this.activeEmbedUrl = null;
    }
  } catch (err) {
    console.error('Error fetching stream URL:', err);
    this.activeEmbedUrl = null;
  }finally {
    this.loading = false; // ✅ Hide loader when done
    this.cd.detectChanges();
  }
}
}





