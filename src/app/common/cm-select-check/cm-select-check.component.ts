import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-cm-select-check',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cm-select-check.component.html',
  styleUrl: './cm-select-check.component.css'
})
export class CmSelectCheckComponent {
  @Input() settings: any;
  stateCtrl = new FormControl('');
  @Input() formGroup: FormGroup;
  selectedValue: string = "";
  @Input() controlName: any;
  @Output() returnObject = new EventEmitter<any>();
  searchCtrl = new FormControl('');
  options: string[] = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Pineapple'];
  filteredOptions: any[] = [];
  selectedValues: string[] = [];
  openAutocomplete: boolean = false;
  
  ngOnInit() {
    this.filteredOptions = this.options;

    this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      )
      .subscribe(filtered => {
        this.filteredOptions = filtered;
      });

      this.controlName = this.searchCtrl;
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    console.log(this.settings);
    return this.settings.options.filter((x: { name: string; value: string }) => x.name.includes(filterValue));

    //return this.options.filter(x=>x.name.includes(filterValue));
  }
  toggleSelection(option: any) {
    const index = this.selectedValues.indexOf(option);
    if (index >= 0) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(option);
    }

    // Reset search field
    this.searchCtrl.setValue('');
    this.returnObject.emit(this.selectedValues);
      this.emitSelected();
  }

  displayFn(): string {
    if (this.selectedValues == undefined)
      return "";
    else
      return this.selectedValues.join(', ');
  }

//   displayFn = (value: any): string => {
//   return this.selectedValues && this.selectedValues.length > 0 
//     ? this.selectedValues.join(', ') 
//     : '';
// }

  isAllSelected(): boolean {
    return this.filteredOptions.every(opt => this.selectedValues.includes(opt.value));
  }
  isIndeterminate(): boolean {
    const filteredValues = this.filteredOptions.map(o => o.value);
    const selectedFiltered = filteredValues.filter(val => this.selectedValues.includes(val));
    return selectedFiltered.length > 0 && selectedFiltered.length < filteredValues.length;
  }
  toggleSelectAll(checked: boolean) {
    const filteredValues = this.filteredOptions.map(o => o.value);

    if (checked) {
      this.selectedValues = Array.from(new Set([...this.selectedValues, ...filteredValues]));
    } else {
      this.selectedValues = this.selectedValues.filter(val => !filteredValues.includes(val));
    }

    this.emitSelected();
  }
  emitSelected() {
    //this.controlName = this.searchCtrl;
    this.formGroup.patchValue({
      [this.controlName] : this.selectedValues
    })
    this.returnObject.emit(
      this.selectedValues
    );
  }
}
