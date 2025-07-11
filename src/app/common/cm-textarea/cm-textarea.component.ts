import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cm-textarea',
  imports: [MaterialModule,CommonModule,ReactiveFormsModule],
  templateUrl: './cm-textarea.component.html',
  styleUrl: './cm-textarea.component.css'
})
export class CmTextareaComponent {
 @Input() _inputData:any;
  value: string = '';
  type : string= "text";
  @Input() formGroup : any;
  @Input() controlName: any; 
  constructor(private cdRef: ChangeDetectorRef){
    
  }
  ngOnInit(): void {
    if(this._inputData.type != undefined)
      this.type = this._inputData.type;
  }
 // Function to call when the value changes
 onChange: any = () => {};

 // Function to call when the input is touched
 onTouched: any = () => {};

 // Write value from the form model into the view
 writeValue(value: string): void {
   this.value = value || '';
 }

 // Register a callback function to notify Angular when the value changes
 registerOnChange(fn: any): void {
   this.onChange = fn;
 }

 // Register a callback function to notify Angular when the input is touched
 registerOnTouched(fn: any): void {
   this.onTouched = fn;
 }

 // Handle input changes
 onInput(event: Event): void {
   const value = (event.target as HTMLInputElement).value;
   this.value = value;
   this.onChange(value); // Notify Angular of the change
 }

 // Handle blur event
 onBlur(): void {
   this.onTouched(); // Notify Angular that the input was touched
 }

 toggleDisable() {
  this._inputData.isDisabled = !this._inputData.isDisabled;
  this.cdRef.detectChanges();  // Manually trigger change detection if necessary
}
}
