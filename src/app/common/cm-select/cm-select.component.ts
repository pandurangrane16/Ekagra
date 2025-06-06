import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cm-select',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './cm-select.component.html',
  styleUrl: './cm-select.component.css'
})
export class CmSelectComponent implements OnInit {
  
  selectedVal:any;
  @Input() settings:any;
  @Input() labelHeader:string;
  @Output() returnObject = new EventEmitter<any>();
  ngOnInit(): void {
    console.log(this.settings);
  }

  ChangeSelection(event: any) {
    console.log(event);
    this.returnObject.emit(event.value);
    
  }

}
