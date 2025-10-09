import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';
import { CmSelectCheckComponent } from '../../../../common/cm-select-check/cm-select-check.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-vms-broadcasting',
  imports: [MaterialModule,CommonModule,CmInputComponent,CmSelect2Component,CmSelectCheckComponent],
  templateUrl: './vms-broadcasting.component.html',
  styleUrl: './vms-broadcasting.component.css'
})
export class VmsBroadcastingComponent implements OnInit {

  form:any;
  isTypeSelected : boolean = false;
  actionTypeSettings = {
    labelHeader: 'Select Type',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: [
      { name: 'SMS', value: 0 },
      { name: 'EMAIL', value: 1 },
    ]
  };
  inputFields = {
    remarks: {
      labelHeader: '',
      placeholder: 'Remarks',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    unitValue : {
      labelHeader: 'Unit Value',
      placeholder: 'Unit Value',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    }
  }
  vmdTypeSettings = {
    labelHeader: 'Select VMD(Controller)',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: [
      { name: 'SMS', value: 0 },
      { name: 'EMAIL', value: 1 },
    ]
  };
  unitSettings = {
    labelHeader: 'Select Unit',
      lableClass: 'form-label',
      formFieldClass: 'w-100',
      appearance: 'fill',
      options: [
        { name: 'Seconds', value: 0 },
        { name: 'Minutes', value: 1 },
      ]
  }
  isVmdSelected : boolean = true;
constructor(private fb : FormBuilder){}
  ngOnInit(): void {
    this.form = this.fb.group({
      selectedAction: ['', Validators.required],
        selectedVmdAction :[],
        remarks: ['', Validators.required],
        isVerified: [false, Validators.required],
        selectedUnit : [],
        unitValue : []
    })
  }
  onActionTypeSelected(evt: any) {
  }
  SubmitAction() {}
  CancelAction() {}
}
