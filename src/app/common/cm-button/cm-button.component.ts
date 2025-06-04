import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cm-button',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './cm-button.component.html',
  styleUrl: './cm-button.component.css'
})
export class CmButtonComponent {
  @Input() color: any;
  @Input() class: any;
  @Input() type: any;

  @Output() buttonClicked = new EventEmitter<string>();

  onButtonClicked() {
    this.buttonClicked.emit('This Is Clicked');
  }
}