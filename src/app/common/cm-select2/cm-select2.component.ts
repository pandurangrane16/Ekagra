import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-cm-select2',
  standalone: true,
  imports: [MaterialModule,CommonModule, MatAutocompleteModule, MatFormFieldModule],
  templateUrl: './cm-select2.component.html',
  styleUrl: './cm-select2.component.css'
})
export class CmSelect2Component implements OnChanges {

  myControl = new FormControl<string | any>('');
  selectedItem: any;
  value: string = '';
  @Input() settings: any;
  stateCtrl = new FormControl('');
  @Input() formGroup: FormGroup;
  selectedValue: string = "";
  @Input() controlName: any;
  @Output() returnObject = new EventEmitter<any>();
  filteredOptions: Observable<any[]>;

  constructor(private cdRef: ChangeDetectorRef) {
    if(this.settings != undefined){
this.filteredOptions = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.settings.options.slice())),
    );
    }
  }
 private _filterStates(value: string): any[] {
  if (!this.settings || !Array.isArray(this.settings.options)) {
    return [];
  }

  const filterValue = (value || '').toString().toLowerCase();

  return this.settings.options.filter((state: any) => {
    const name = (state?.name || '').toString().toLowerCase();
    return name.includes(filterValue);
  });
}

//   ngOnInit(): void {
//     console.log(this.settings);
//     if (!this.settings || !this.settings.options) {
//       console.error('Settings or options not provided');
//       return;
//     }
//     // this.filteredOptions = this.stateCtrl.valueChanges.pipe(
//     //   startWith(''),
//     //   map(state => (typeof state === 'string' ? this._filterStates(state) : this.settings.options.slice())),
//     // );
//     this.filteredOptions = this.stateCtrl.valueChanges.pipe(
//   startWith(''),
//   map(state => (typeof state === 'string' ? this._filterStates(state) : this.settings.options.slice()))
// );

// //  const control = this.formGroup.get(this.controlName);
// //   if (control) {
// //     if (this.settings?.isDisabled) {
// //       control.disable();
// //     } else {
// //       control.enable();
// //     }
// //   }
//   }

ngOnChanges(): void {
  if (this.settings && Array.isArray(this.settings.options)) {
    this.filteredOptions = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => 
        typeof state === 'string'
          ? this._filterStates(state)
          : this.settings.options.slice()
      )
    );
  }
}
  displayFn(option: any): string {
    return option && option.name ? option.name : '';
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.settings.options.filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }

  ChangeSelection(event: any) {
    this.returnObject.emit(event.option.value);
  }

  displayWith(state: any): string {
    return state ? state.name : '';  // Ensure it displays the 'name' property
  }

  // Function to call when the value changes
  onChange: any = () => { };

  // Function to call when the input is touched
  onTouched: any = () => { };

  // Write value from the form model into the view
  writeValue(value: string): void {
    this.value = value || '';
  }


  toggleDisable() {
    this.settings.isDisabled = !this.settings.isDisabled;
    this.cdRef.detectChanges();  // Manually trigger change detection if necessary
  }

   @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  isPanelOpen = false;

  ngAfterViewInit(): void {
    this.autocompleteTrigger.panelClosingActions.subscribe(() => {
      this.isPanelOpen = false;
      this.cdRef.detectChanges();  // To update icon
    });
  }

  onInputClick(): void {
    this.isPanelOpen = true;
  }

  
}
