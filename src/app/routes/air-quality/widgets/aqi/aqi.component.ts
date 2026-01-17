import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-aqi',
    imports: [CommonModule],
    templateUrl: './aqi.component.html',
    styleUrl: './aqi.component.css'
})
export class AqiComponent {

  @Input() scale: number = 0;

}
