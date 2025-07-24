import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cm-checkbox-group',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './cm-checkbox-group.component.html',
  styleUrl: './cm-checkbox-group.component.css'
})
export class CmCheckboxGroupComponent {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() _inputData: {
    labelHeader?: string;
    placeholder?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    mode?: 'single' | 'multiple';
    options: { label: string; value: any }[];
  } = { options: [] };

  formArray!: FormArray;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const selected = this.formGroup.get(this.controlName)?.value ?? [];

    this.formArray = this.fb.array(
      this._inputData.options.map(opt =>
        new FormControl(
          {
            value:
              this._inputData.mode === 'single'
                ? selected === opt.value
                : (selected ?? []).includes(opt.value),
            disabled: this._inputData.isDisabled ?? false,
          },
          this._inputData.isRequired ? [Validators.required] : []
        )
      )
    );

    this.formGroup.setControl(this.controlName, this.formArray);

    this.formArray.valueChanges.subscribe(() => {
      const selectedValues = this.getSelectedValues();
      this.formGroup.get(this.controlName)?.setValue(selectedValues, { emitEvent: false });
    });
  }

  onCheckboxChange(index: number) {
    if (this._inputData.mode === 'single') {
      this.formArray.controls.forEach((ctrl, i) =>
        ctrl.setValue(i === index, { emitEvent: false })
      );
      const selected = this.getSelectedValues();
      this.formGroup.get(this.controlName)?.setValue(selected, { emitEvent: false });
    }
  }

  getSelectedValues() {
    const selected = this.formArray.value
      .map((checked: boolean, i: number) => (checked ? this._inputData.options[i].value : null))
      .filter((v: any) => v !== null);

    return this._inputData.mode === 'single' ? selected[0] ?? null : selected;
  }
}
