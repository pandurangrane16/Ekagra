import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom, Subscription } from 'rxjs';
import { VideoStreamPlayerComponent } from '../../common/video-stream-player/video-stream-player.component';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { ToastrService } from 'ngx-toastr';
import { SiteSearchPipe } from './site-search.pipe';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/common/session.service';
import {
  CmConfirmationDialogComponent,
  ConfirmationDialogData
} from '../../common/cm-confirmation-dialog/cm-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SurveillanceService } from '../../services/atcs/surveillance.service';
import { PramglobalService } from '../../services/admin/pramglobal.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface Section {
  name: string;
  img: string;
  expanded: boolean;
  siteId: number;
  safeStreamUrl?: SafeResourceUrl;
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
  isSelected?: boolean;
}
interface Camera {
  cameraId: number;
  cameraName: string;
}

@Component({
  selector: 'app-surveilience-camera',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    VideoStreamPlayerComponent,
    SiteSearchPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './surveilience-camera.component.html',
  styleUrl: './surveilience-camera.component.css',
  // keep Toastr at root if possible; component-level provider creates new overlay per instance.
  // providers: [ToastrService]
})
export class SurveilienceCameraComponent implements OnInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private destroyed = false;

  siteSearchText: string = '';
  session = inject(SessionService);

  activeStreams: { siteId: number; siteName: string; streamUrl: SafeResourceUrl; cameraName: string }[] = [];
  private currentSiteId: number | null = null;

  loading: boolean = false;
  readonly panelOpenState = signal(false);

  locations: Location[] = [];
  sites: Site[] = [];

  camera: Section[] = [
    { name: 'Camera 1', img: 'assets/img/cam1.jpg', expanded: false, siteId: 0 },
    { name: 'Camera 2', img: 'assets/img/cam2.jpg', expanded: false, siteId: 1 },
    { name: 'Camera 3', img: 'assets/img/cam3.jpg', expanded: false, siteId: 2 },
    { name: 'Camera 4', img: 'assets/img/cam4.jpg', expanded: false, siteId: 3 },
  ];

  embedUrl: string | null = null;
  rfu2: string | null = null;
  activeEmbedUrl: SafeResourceUrl | null = null;
  selectedCameraName: string = '';

  // any subscriptions you create add to this
  private subs = new Subscription();

  constructor(
    private surveillanceService: SurveillanceService,
    private PramglobalService: PramglobalService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private loaderService: LoaderService,
    private toast: ToastrService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ---------- lifecycle ----------
  ngOnInit(): void {
    try {
      // Open confirmation dialog ONLY in browser (overlays need DOM)
      if (this.isBrowser) {
        const dialogRef = this.dialog.open<CmConfirmationDialogComponent, ConfirmationDialogData, boolean>(
          CmConfirmationDialogComponent,
          {
            width: '400px',
            position: { top: '20px' },
            panelClass: 'custom-confirm-dialog',
            data: {
              title: 'Confirm SSL',
              message: `Enable SSL on local machine (so that secure HTTPS connections can work properly). This is required for the camera streams to function correctly.`,
              type: 'info',
              confirmButtonText: 'Confirm'
            }
          }
        );
        
const projectCodesStr = this.session._getSessionValue("projectCodes");

if (!projectCodesStr) {
  console.error('⚠️ projectCodes not found in session');
  return;
}

const projectCodes = JSON.parse(projectCodesStr);
    const currentProject = "Surveilience"; // change dynamically later if needed

    const project = projectCodes.find(
      (p: any) => p.name.toLowerCase() === currentProject.toLowerCase()
    );

    if (!project) {
      console.error(`⚠️ Project "${currentProject}" not found in config.`);
      return;
    }

    const projectId = Number(project.value);

        const sub = dialogRef.afterClosed().subscribe((result: any) => {
          if (this.destroyed) return;
          if (result) {
            // const projectId = this.session._getSessionValue('projectIdRoute');
          
            this.surveillanceService
              .GetSiteLocationCameraListForSurveillance(projectId)
              .pipe(withLoader(this.loaderService))
              .subscribe({
                next: (res: any) => {
                  if (this.destroyed) return;
                  const flatData = res?.result || [];
                  const groupedLocations = Object.values(
                    flatData.reduce((acc: any, curr: any) => {
                      const { locationId, locationName, siteId, siteName, cameraId, cameraName } = curr;
                      if (!acc[locationId]) {
                        acc[locationId] = { locationId, locationName, sites: [] };
                      }
                      const location = acc[locationId];
                      let site = location.sites.find((s: any) => s.siteId === siteId);
                      if (!site) {
                        site = { siteId, siteName, cameras: [] };
                        location.sites.push(site);
                      }
                      site.cameras.push({ cameraId, cameraName });
                      return acc;
                    }, {})
                  );
                  this.locations = groupedLocations as Location[];
                  this.markForCheckSafe();
                },
                error: () => {
                  this.toastSafe('error', 'Failed to load locations.');
                }
              });
          } else {
            this.toastSafe('warning', 'SSL is required for camera streams. Action canceled.');
          }
        });
        this.subs.add(sub);

        // Load favorites only in browser
        const favoriteSites: { siteId: number; siteName: string }[] =
          JSON.parse(localStorage.getItem('favoriteSites') || '[]');

        if (favoriteSites.length > 0) {
          for (const fav of favoriteSites) {
            // Preload streams silently; guard duplicates inside onSiteClick
            this.onSiteClick(fav.siteId, false);
          }
        }
      }
    } catch (error) {
      console.error('Caught error:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.subs.unsubscribe();
  }

  // ---------- helpers ----------
  private markForCheckSafe(): void {
    if (this.destroyed) return;
    // Avoid detectChanges after destroy (NG0205)
    this.cd.detectChanges();
  }

  private toastSafe(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    title?: string
  ): void {
    if (!this.isBrowser) {
      // SSR: avoid overlays; log instead
      console.log(`[toast:${type}]`, title ? `${title}: ${message}` : message);
      return;
    }
    switch (type) {
      case 'success': this.toast.success(message, title); break;
      case 'error': this.toast.error(message, title); break;
      case 'info': this.toast.info(message, title); break;
      case 'warning': this.toast.warning(message, title); break;
    }
  }

  // ---------- UI actions ----------
  onSearchTextChange(value: string): void {
    this.siteSearchText = value;
    this.camera.forEach(cam => (cam.expanded = false));
    this.locations.forEach(loc => (loc.expanded = true));
  }

  onCameraSelect(siteId: number, locId: number, camId: number) {
    const location = this.locations.find(l => l.locationId === locId);
    const site = location?.sites.find(s => s.siteId === siteId);
    const camera = site?.cameras.find(c => c.cameraId === camId);
    if (camera) {
      console.log('Selected Camera:', camera);
    }
  }

  toggleExpand(cam: any): void {
    cam.expanded = !cam.expanded;
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.classList.toggle('fullscreenDiv');
    }
  }

  async onSiteClick(siteId: number, triggeredByUser: boolean = true): Promise<void> {
    if (this.destroyed) return;

    this.loaderService.showLoader();
    try {
      const selectedCam = this.camera.find(cam => cam.siteId === siteId);
      const cameraName = selectedCam ? selectedCam.name : `Camera name :  ${siteId}`;

      // Prevent duplicate entries
      const alreadyAdded = this.activeStreams.find(stream => stream.siteId === siteId);
      if (alreadyAdded) {
        this.toastSafe('error', 'Stream is already running for the selected camera.');
        return;
      }

      const globalRes: any = await firstValueFrom(
        this.PramglobalService.GetAllGlobalValues('Project', siteId.toString())
      );

      const embedUrl = globalRes?.result?.[0]?.rfu1 || null;
      const rfu2 = globalRes?.result?.[0]?.rfu2 || null;

      if (!embedUrl) {
        this.toastSafe('error', `No stream URL found for the selected site. ${siteId}`);
        // Uncheck the site if present
        for (const loc of this.locations) {
          const site = loc.sites.find(s => s.siteId === siteId);
          if (site) {
            site.isSelected = false;
            break;
          }
        }
        return;
      }

      const streamRes: any = await firstValueFrom(
        this.surveillanceService.getLiveStreamUrl(siteId, embedUrl)
      );
      const finalUrl = (streamRes?.data?.embedurl || '') + (rfu2 || '');
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);

      // Resolve site name from current locations
      let siteName = '';
      if (this.locations && this.locations.length > 0) {
        for (const loc of this.locations) {
          const site = loc.sites?.find(s => s.siteId === siteId);
          if (site) {
            siteName = site.siteName;
            break;
          }
        }
      }
      // Fallback from favorites
      if (!siteName && this.isBrowser) {
        const favorites = JSON.parse(localStorage.getItem('favoriteSites') || '[]');
        const favSite = favorites.find((s: any) => s.siteId === siteId);
        if (favSite) siteName = favSite.siteName;
      }

      this.activeStreams.push({
        siteId,
        siteName,
        streamUrl: safeUrl,
        cameraName
      });

      this.markForCheckSafe();
    } catch (err: any) {
      this.toastSafe('error', `Error fetching stream URL: ${String(err)}`);
      console.error('Error fetching stream URL:', err);
    } finally {
      this.loaderService.hideLoader();
      this.markForCheckSafe();
    }
  }

  onSiteToggle(site: Site): void {
    if (site.isSelected) {
      this.onSiteClick(site.siteId);
    } else {
      this.onClosePreview(site.siteId);
    }
  }

  onClosePreview(siteId: number): void {
    const index = this.activeStreams.findIndex(stream => stream.siteId === siteId);
    if (index === -1) return;

    this.surveillanceService
      .stopLiveStream(siteId)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: () => {
          if (this.destroyed) return;
          console.log(`Stopped stream for site ${siteId}`);
          this.toastSafe('success', `Stopped stream for site ${siteId}`);
        },
        error: err => {
          if (this.destroyed) return;
          console.error('Error stopping stream:', err);
          this.toastSafe('error', 'Failed to stop stream for the selected site.', 'Stream Error');
        }
      });

    this.activeStreams.splice(index, 1);

    // Uncheck checkbox in locations
    this.locations.forEach(loc => {
      const site = loc.sites.find(s => s.siteId === siteId);
      if (site) site.isSelected = false;
    });

    this.markForCheckSafe();
  }

  saveFavorites(): void {
    const favoriteSites = this.activeStreams.map(stream => ({
      siteId: stream.siteId,
      siteName: stream.siteName
    }));
    if (this.isBrowser) {
      localStorage.setItem('favoriteSites', JSON.stringify(favoriteSites));
    }
    this.toastSafe('success', 'Favorites saved successfully!');
  }

  clearFavorites(): void {
    if (this.isBrowser) {
      localStorage.removeItem('favoriteSites');
    }
    this.toastSafe('info', 'Favorites cleared!');
  }
}
