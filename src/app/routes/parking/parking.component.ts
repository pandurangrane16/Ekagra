import {ChangeDetectionStrategy, Component} from '@angular/core';
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
@Component({
    selector: 'app-parking',
    imports: [MapviewComponent, DailyComponent, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, VehicleParkingComponent, ParkingPlacesComponent, SensorsHealthComponent, TotalViolationComponent],
    templateUrl: './parking.component.html',
    styleUrl: './parking.component.css'
})
export class ParkingComponent {

}
