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
@Component({
    selector: 'app-parking',
    imports: [MapviewComponent, DailyComponent, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, VehicleParkingComponent, ParkingPlacesComponent, SensorsHealthComponent, TotalViolationComponent],
    templateUrl: './parking.component.html',
    styleUrl: './parking.component.css'
})
export class ParkingComponent {
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

