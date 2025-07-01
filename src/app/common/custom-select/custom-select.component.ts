import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  standalone: true,   // <-- ADD THIS
  imports: [CommonModule, ReactiveFormsModule, FormsModule],  // If using ngFor, ngModel, etc
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class AppCustomSelectComponent {
 @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() label: string = '';
  @Input() options: any[] = [];

  @Output() selectionChange = new EventEmitter<any>();

  onSelectionChange(event: any) {
    const selectedValue = event.target.value;
    const selectedObject = this.options.find(opt => opt.value == selectedValue);
    this.selectionChange.emit(selectedObject);
  }
}
