import { Component, Input, Type } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cm-tabs',
  imports: [MaterialModule,CommonModule,ReactiveFormsModule],
  templateUrl: './cm-tabs.component.html',
  styleUrl: './cm-tabs.component.css',
  standalone:true
})
export class CmTabsComponent {
  
  @Input() formGroup : any;
  @Input() tabs: { label: string; formArray: FormArray }[] = [];
}
