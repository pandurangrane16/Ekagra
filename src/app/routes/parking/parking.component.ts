import {ChangeDetectionStrategy,inject, Component} from '@angular/core';
import { MapviewComponent } from "../dashboard/widgets/mapview/mapview.component";
import { DailyComponent } from "./widgets/daily/daily.component";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { VehicleParkingComponent } from "./widgets/vehicle-parking/vehicle-parking.component";
import { ParkingPlacesComponent } from "./widgets/parking-places/parking-places.component";
import { SensorsComponent } from "./widgets/sensors/sensors.component";
import { ViolationComponent } from "./widgets/violation/violation.component";
import { SensorsHealthComponent } from "./widgets/sensors-health/sensors-health.component";
import { TotalViolationComponent } from "./widgets/total-violation/total-violation.component";
import { withLoader } from '../../services/common/common';
import { LoaderService } from '../../services/common/loader.service';
import { SessionService } from '../../services/common/session.service';
import { vmsdashboardService } from '../../services/dashboard/vmsDashboard.service';
import { CmBreadcrumbComponent } from "../../common/cm-breadcrumb/cm-breadcrumb.component";
@Component({
    selector: 'app-parking',
    imports: [MapviewComponent, DailyComponent, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, VehicleParkingComponent, ParkingPlacesComponent, SensorsHealthComponent, TotalViolationComponent, CmBreadcrumbComponent],
    templateUrl: './parking.component.html',
    styleUrl: './parking.component.css'
})
export class ParkingComponent {

     // Zone Properties
 isZoneOptionsLoaded: boolean = false;
 ZoneOptions: any[] = [];
 selectedZones: any[] = [];
 selectedZoneIds: any[] = [];
 ZoneSelectSettings = {
    labelHeader: 'Select Zone',
    lableClass: 'form-label',
    multiple: false,
    formFieldClass: '', 
    appearance: 'fill',
    options: []
 };
 onActionSelectionChange(event: any) {
        const selectedValues = event.value || [];
        const allOption = this.ZoneOptions.find((x: any) => x.text.toLowerCase() === 'all');

        if (!allOption) return;

        const isAllSelected = selectedValues.some((x: any) => x.id === allOption.id);

        if (isAllSelected) {
            const allExceptAll = this.ZoneOptions.filter((x: any) => x.id !== allOption.id);
            this.selectedZones = [...allExceptAll];
        } else {
            this.selectedZones = selectedValues.filter((x: any) => x.id !== allOption.id);
        }

        this.selectedZoneIds = this.selectedZones.map(zone => zone.id);
        // Trigger any updates based on zone selection if needed
    }
    clearActions() {
        this.selectedZones = [];
        this.selectedZoneIds = [];
        // Clear logic
    }
     getZoneList() {
        this.service.GetAllZones().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
            const items = response?.result || [];

            const projectOptions = items.map((item: any) => ({
                text: (item.zoneName || '').trim() || 'Unknown',
                id: item.id
            }));

            // 1. Set selectedZones to everything except the "All" option (id: 0)
            this.selectedZones = [...projectOptions];
            
            // 2. Map the IDs to your array that goes to the Child component
            this.selectedZoneIds = this.selectedZones.map(zone => zone.id);

            projectOptions.unshift({
                text: 'All',
                id: 0
            });
            this.ZoneSelectSettings.options = projectOptions;
            this.ZoneOptions=projectOptions
            this.isZoneOptionsLoaded = true;
        }, error => {
            console.error('Error fetching Zone list', error);
        });
    }

    loaderService = inject(LoaderService);
    constructor(private service:vmsdashboardService,private session: SessionService ) {}
    totalAmountCollected: number = 0;

    ngOnInit() {
      this.loadTotalAmountCollected();
    }

    loadTotalAmountCollected() {
  this.service
    .GetTotalCollectionAmount(
      'CMS Office Bhandup',
      '2025-12-11',
      '2025-12-19'
    )
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (response: any) => {
        if (response?.success && response?.result) {
          this.totalAmountCollected = response.result.totalAmountCollected ?? 0;
        }
      },
      error: () => {
        this.totalAmountCollected = 0;
      }
    });
}
 

}

