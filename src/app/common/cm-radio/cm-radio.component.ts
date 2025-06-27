import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cm-radio',
  imports: [MaterialModule,CommonModule],
  templateUrl: './cm-radio.component.html',
  styleUrl: './cm-radio.component.css',
  standalone:true
})
export class CmRadioComponent {
  @Input() _inputData:any;
  value: string = '';
  type : string= "text";
  @Input() formGroup : any;
  @Input() controlName: any; 
}
