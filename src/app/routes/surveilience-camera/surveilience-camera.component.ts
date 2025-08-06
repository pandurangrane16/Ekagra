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
import { VideoStreamPlayerComponent } from '../../common/video-stream-player/video-stream-player.component';

interface Section {
  name: string;
  img: string;
  expanded: boolean;
  siteId: number;
  safeStreamUrl?: SafeResourceUrl; // <-- Add this line
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
        MatButtonModule, MatExpansionModule, CommonModule,VideoStreamPlayerComponent ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './surveilience-camera.component.html',
    styleUrl: './surveilience-camera.component.css'
})



export class SurveilienceCameraComponent {

  autoStreamQueue: number[] = [];
autoStreamIndex: number = 0;

private currentSiteId: number | null = null;

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

// this.camera = firstFourSites.map((site: Site, index: number) => ({
//   name: site.siteName,
//   img: `assets/img/cam${index + 1}.jpg`,
//   expanded: false,
//   siteId: site.siteId
// }));


this.autoStreamQueue = firstFourSites.map(site => site.siteId);
// this.startAutoStreaming(); // Start playing streams one by one

this.loadInitialStreamPreviews(firstFourSites.map(site => site.siteId));



console.log(groupedLocations);
      });

}
catch (error) {
    console.error('Caught error:', error);
  }


  } 

async loadInitialStreamPreviews(siteIds: number[]) {
  this.loading = true;
  try {
    const cameraPromises = siteIds.map(async (siteId, index) => {
      // Get global values for site
      const globalRes: any = await firstValueFrom(
        this.PramglobalService.GetAllGlobalValues('Project', siteId.toString())
      );

      const embedUrl = globalRes.result[0]?.rfu1 || null;
      const rfu2 = globalRes.result[0]?.rfu2 || '';

      if (!embedUrl) return null;

      const streamRes: any = await firstValueFrom(
        this.surveillanceService.getLiveStreamUrl(siteId, embedUrl)
      );

      const fullStreamUrl = streamRes?.data?.embedurl + rfu2;

      return {
        // name: `Camera ${index + 1}`,
         name: `Camera: ${rfu2}`,
        img: `assets/img/cam${index + 1}.jpg`,
        expanded: false,
        siteId,
        safeStreamUrl: this.sanitizer.bypassSecurityTrustResourceUrl(fullStreamUrl),
      } as Section;
    });

    const cameraResults = await Promise.all(cameraPromises);

    // Remove failed/null ones
    this.camera = cameraResults.filter(cam => cam !== null) as Section[];
    this.cd.detectChanges();
  } catch (error) {
    console.error('Error loading initial stream previews:', error);
  } finally {
    this.loading = false;
    this.cd.detectChanges();
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

selectedCameraName: string = '';
async onSiteClick(siteId: number, triggeredByUser: boolean = true): Promise<void> {
  this.loading = true;

  try {
     const selectedCam = this.camera.find(cam => cam.siteId === siteId);
  if (selectedCam) {

    this.selectedCameraName = selectedCam.name;
  }

    // Only stop if triggered manually and the siteId is changing
    if (triggeredByUser && this.currentSiteId && this.currentSiteId !== siteId) {
      await firstValueFrom(this.surveillanceService.stopLiveStream(this.currentSiteId));
      console.log(`Stopped stream for site ${this.currentSiteId}`);
      this.currentSiteId = 0;
    }

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

      setTimeout(() => {
        this.activeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        this.cd.detectChanges();
      }, 100);
    } else {
      this.activeEmbedUrl = null;
    }

    this.currentSiteId = siteId;

  } catch (err) {
    console.error('Error fetching stream URL:', err);
    this.activeEmbedUrl = null;
  } finally {
    this.loading = false;
    this.cd.detectChanges();
  }
}




onClosePreview(): void {
  debugger;
  this.loading = true;

  if (!this.embedUrl || !this.rfu2 || !this.currentSiteId) {
    this.activeEmbedUrl = null;
    this.embedUrl = null;
    this.rfu2 = null;
    this.loading = false;
    this.cd.detectChanges(); // ensure loader is hidden
    return;
  }

  this.surveillanceService.stopLiveStream(this.currentSiteId).subscribe({
    next: () => {
      console.log('Streaming stopped.');
    },
    error: (err) => {
      console.error('Error stopping stream:', err);
    },
    complete: () => {
      this.activeEmbedUrl = null;
      this.embedUrl = null;
      this.rfu2 = null;
      this.loading = false;
      this.cd.detectChanges(); // ensure UI updates after stream stops
    }
  });
    this.selectedCameraName = '';
}


async startAutoStreaming() {
  if (this.autoStreamQueue.length === 0) return;

  const siteId = this.autoStreamQueue[this.autoStreamIndex];

  await this.onSiteClick(siteId, false); // Don't stop during auto stream


  this.autoStreamIndex = (this.autoStreamIndex + 1) % this.autoStreamQueue.length;

  setTimeout(() => {
    this.startAutoStreaming();
  }, 10000); // Change stream every 10 seconds
}

}





