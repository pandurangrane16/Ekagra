import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-aqi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aqi.component.html',
  styleUrl: './aqi.component.css'
})
export class AqiComponent {

  scale:number = 150;

}
