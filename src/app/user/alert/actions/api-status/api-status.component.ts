import { Component, Inject, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-status',
  imports: [MaterialModule,CmSelect2Component,CommonModule],
  templateUrl: './api-status.component.html',
  styleUrl: './api-status.component.css'
})
export class ApiStatusComponent implements OnInit {
  form: any;
  isTypeSelected : boolean =true;
  vmsSettings = {
    labelHeader: 'Select VMS',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: [
      { name: 'VMS001', value: 0 },
      { name: 'VMS002', value: 1 },
    ]
  };

  constructor(private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any) {}
  
  ngOnInit(): void {
    console.log(this.data);
    this.form = this.fb.group({
      selectedVms : ['',Validators.required],
    })
  }
  onActionTypeSelected(evt:any) {

  }

  SubmitAction() {}
  CancelAction() {}
}
