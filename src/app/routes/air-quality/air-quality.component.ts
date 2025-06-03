import {  ChangeDetectionStrategy, Component } from '@angular/core';
import { MapviewComponent } from "../dashboard/widgets/mapview/mapview.component";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DailyComponent } from "../parking/widgets/daily/daily.component";
import { ForecastComponent } from "./widgets/forecast/forecast.component";
import { AqiComponent } from "./widgets/aqi/aqi.component";
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { HistoricComponent } from "./widgets/historic/historic.component";
import { SeverityComponent } from "../alerts-page/widgets/severity/severity.component";
import { PollutantsComponent } from "./widgets/pollutants/pollutants.component";
import { MetroCitiesComponent } from "./widgets/metro-cities/metro-cities.component";
import { MumbaiAirComponent } from "./widgets/mumbai-air/mumbai-air.component";

@Component({
  selector: 'app-air-quality',
  standalone: true,
  imports: [MapviewComponent, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ForecastComponent, AqiComponent, MatDatepickerModule, MatSelectModule, HistoricComponent, PollutantsComponent, MetroCitiesComponent, MumbaiAirComponent],
  providers: [provideNativeDateAdapter()],
 // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './air-quality.component.html',
  styleUrl: './air-quality.component.css'
})
export class AirQualityComponent {

}
