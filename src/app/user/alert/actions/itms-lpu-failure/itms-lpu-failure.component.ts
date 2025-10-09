import { Component, Input, OnInit } from '@angular/core';
import { AddressbookComponent } from '../addressbook/addressbook.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';
import { SmsActionComponent } from '../sms-action/sms-action.component';
import { EmailActionComponent } from '../email-action/email-action.component';
import { ApiStatusComponent } from '../api-status/api-status.component';
import { PaActionComponent } from '../pa-action/pa-action.component';
import { CmSelectCheckComponent } from '../../../../common/cm-select-check/cm-select-check.component';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';
import { VmsBroadcastingComponent } from "../vms-broadcasting/vms-broadcasting.component";
import { ApiActionComponent } from "../api-action/api-action.component";

@Component({
  selector: 'app-itms-lpu-failure',
  imports:  [MaterialModule, CommonModule, CmTextareaComponent, ApiActionComponent],
  templateUrl: './itms-lpu-failure.component.html',
  styleUrl: './itms-lpu-failure.component.css',
  standalone : true,
  host: { 'ngSkipHydration': '' } 
})
export class ItmsLpuFailureComponent implements OnInit {
  form: any;
  @Input() task: any;
  isEmail: boolean = false;
  isSMS: boolean = false;
  isTypeSelected: boolean = false;
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
  constructor(private fb: FormBuilder, private dialog : MatDialog) { }

  ngOnInit(): void {
    if (this.task != null && this.task != undefined) {
      this.isTypeSelected = true;
      this.form = this.fb.group({
        selectedAction: ['', Validators.required],
        selectedVmdAction :[],
        remarks: ['', Validators.required],
        isVerified: [false, Validators.required],
        selectedUnit : [],
        unitValue : []
      })
    }
  }

  onActionTypeSelected(evt: any) {
    if (evt.name == 'SMS') {
      this.isSMS = true;
      this.isEmail = false;
    } else if (evt.name == 'EMAIL') {
      this.isSMS = false;
      this.isEmail = true;
    }
  }
  SubmitAction() { }
  CancelAction() { }

  ViewOnMap(task: any) {
    const dialogRef = this.dialog.open(ApiStatusComponent, {
      width: '800px',
      height: '700px',
      //title : "Resolved By Iteself",
      position: { top: '20px' },
      panelClass: 'custom-confirm-dialog',
      data: {
        type: "atcs"
      }
    })
  }
}

