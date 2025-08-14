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
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import{ SiteSearchPipe} from './site-search.pipe';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/common/session.service';
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
  expanded?: boolean;
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
        MatButtonModule, MatExpansionModule, 
        CommonModule,VideoStreamPlayerComponent
      ,SiteSearchPipe,
    FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './surveilience-camera.component.html',
    styleUrl: './surveilience-camera.component.css',
     providers:[ToastrService]
})



export class SurveilienceCameraComponent {
  siteSearchText: string = '';
   session = inject(SessionService);
activeStreams: { siteId: number,siteName: string, streamUrl: SafeResourceUrl, cameraName: string }[] = [];

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

  // Collapse all dropdowns when search text changes
  onSearchTextChange(value: string): void {
    this.siteSearchText = value;
    this.camera.forEach(cam => cam.expanded = false);
    this.locations.forEach(loc => loc.expanded = true); // expand all locations
  }






sites: Site[] = []; 

  constructor(private surveillanceService: SurveillanceService,
    private PramglobalService: PramglobalService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private loaderService: LoaderService,
    private toast: ToastrService

  ) {}

  ngOnInit(): void {
    try{
    debugger;
    const projectId = this.session._getSessionValue("projectIdRoute");; 
    this.surveillanceService
      .GetSiteLocationCameraListForSurveillance(projectId)
      .pipe(withLoader(this.loaderService)).subscribe((res: any) => {
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

// const allSites = groupedLocations.flatMap((loc: any) => loc.sites);
// const firstFourSites = allSites.slice(0, 4);

// this.loadInitialStreamPreviews(firstFourSites.map(site => site.siteId));

console.log(groupedLocations);
      });

}
catch (error) {
    console.error('Caught error:', error);
  }


  } 

// async loadInitialStreamPreviews(siteIds: number[]) {
//   this.loading = true;
//   try {
//     const cameraPromises = siteIds.map(async (siteId, index) => {
//       // Get global values for site
//       const globalRes: any = await firstValueFrom(
//         this.PramglobalService.GetAllGlobalValues('Project', siteId.toString())
//       );

//       const embedUrl = globalRes.result[0]?.rfu1 || null;
//       const rfu2 = globalRes.result[0]?.rfu2 || '';

//       if (!embedUrl) return null;

//       const streamRes: any = await firstValueFrom(
//         this.surveillanceService.getLiveStreamUrl(siteId, embedUrl)
//       );

//       const fullStreamUrl = streamRes?.data?.embedurl + rfu2;

//       return {
//         // name: `Camera ${index + 1}`,
//          name: `Camera: ${rfu2}`,
//         img: `assets/img/cam${index + 1}.jpg`,
//         expanded: false,
//         siteId,
//         safeStreamUrl: this.sanitizer.bypassSecurityTrustResourceUrl(fullStreamUrl),
//       } as Section;
//     });

//     const cameraResults = await Promise.all(cameraPromises);

//     // Remove failed/null ones
//     this.camera = cameraResults.filter(cam => cam !== null) as Section[];
//     this.cd.detectChanges();
//   } catch (error) {
//     console.error('Error loading initial stream previews:', error);
//   } finally {
//     this.loading = false;
//     this.cd.detectChanges();
//   }
// }

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
  // this.loading = true;
  debugger;
this.loaderService.showLoader();
  try {
    const selectedCam = this.camera.find(cam => cam.siteId === siteId);
    const cameraName = selectedCam ? selectedCam.name : `Camera name :  ${siteId}`;

    // Prevent duplicate entries
    const alreadyAdded = this.activeStreams.find(stream => stream.siteId === siteId);
    if (alreadyAdded) {
      // this.loading = false;
      this.toast.error('Stream is already running for the selected camera.');
      this.loaderService.hideLoader();
      return;
    }

    const globalRes: any = await firstValueFrom(
      this.PramglobalService.GetAllGlobalValues('Project', siteId.toString())
    );

    const embedUrl = globalRes.result[0]?.rfu1 || null;
    const rfu2 = globalRes.result[0]?.rfu2 || null;

    if (embedUrl) {
      const streamRes: any = await firstValueFrom(
        this.surveillanceService.getLiveStreamUrl(siteId, embedUrl)
      );

      const finalUrl = streamRes?.data?.embedurl + rfu2;
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);

              let siteName = '';
        for (const loc of this.locations) {
          const site = loc.sites.find(s => s.siteId === siteId);
          if (site) {
            siteName = site.siteName;
            break;
          }
        }
      // Add to stream list
      this.activeStreams.push({
        siteId,
        siteName,
        streamUrl: safeUrl,
        cameraName,
      });

      this.cd.detectChanges();
    }
    else
    {
      this.toast.error(`No stream URL found for the selected site.${siteId} `);
      console.error('No stream URL found for site:', siteId);
      return;
    }

  } catch (err) {
    this.toast.error('Error fetching stream URL:', String(err));
    console.error('Error fetching stream URL:', err);
  } finally {
    // this.loading = false;
    this.loaderService.hideLoader();
    this.cd.detectChanges();
  }
}

onClosePreview(siteId: number): void {
  const index = this.activeStreams.findIndex(stream => stream.siteId === siteId);
  if (index !== -1) {
    this.surveillanceService.stopLiveStream(siteId).pipe(withLoader(this.loaderService)).subscribe({
      next: () =>{console.log(`Stopped stream for site ${siteId}`);
    this.toast.success(`Stopped stream for site ${siteId}`);
    } ,
      error: err => {
          console.error('Error stopping stream:', err);
          this.toast.error('Failed to stop stream for the selected site.', 'Stream Error');
        }
    });

    this.activeStreams.splice(index, 1);
    this.cd.detectChanges();
  }
}




}





