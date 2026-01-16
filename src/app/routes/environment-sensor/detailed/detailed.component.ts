import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../Material.module';
import { AqiComponent } from '../../air-quality/widgets/aqi/aqi.component';

@Component({
  selector: 'app-detailed',
  imports: [MaterialModule,AqiComponent],
  templateUrl: './detailed.component.html',
  styleUrl: './detailed.component.css'
})
export class DetailedComponent implements OnInit {
  sensorId!: number;
items = [
  {  id: 1, location: 'Bhandup', aqi: 283, status: 'Poor' },
  {  id: 2, location: 'Andheri', aqi: 190, status: 'Moderate' },
  {  id: 3, location: 'Borivali', aqi: 120, status: 'Good' },
  {  id: 4, location: 'Dadar', aqi: 310, status: 'Very Poor' }
];
 constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.sensorId = Number(this.route.snapshot.paramMap.get('id'));
  }

  goBack() {
    this.router.navigate(['/sensor']);
  }
}
