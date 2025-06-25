import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cm-toggle',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './cm-toggle.component.html',
  styleUrl: './cm-toggle.component.css'
})
export class CmToggleComponent {
  @Input() settings:any;
  
  @Output() returnObject = new EventEmitter<any>();

   ChangeSelection(event: any) {
    this.returnObject.emit(event.value);
  }
}
