import { Component, Input, OnInit } from '@angular/core';
import { AddressbookComponent } from '../addressbook/addressbook.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';
import { EmailActionComponent } from '../email-action/email-action.component';
import { SmsActionComponent } from '../sms-action/sms-action.component';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { CmInputComponent } from "../../../../common/cm-input/cm-input.component";
import { CmSelectCheckComponent } from '../../../../common/cm-select-check/cm-select-check.component';
import { ApiStatusComponent } from '../api-status/api-status.component';

@Component({
  selector: 'app-vms-emergency-play',
  imports: [MaterialModule, CommonModule, CmSelect2Component,CmSelectCheckComponent,CmInputComponent],
  templateUrl: './vms-emergency-play.component.html',
  styleUrl: './vms-emergency-play.component.css',
  standalone:true
})
export class VmsEmergencyPlayComponent implements OnInit {
  form: any;
  @Input() task: any;
  isEmail: boolean = false;
  isSMS: boolean = false;
  isTypeSelected: boolean = false;
  isVmdSelected : boolean = true;
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
  constructor(private fb: FormBuilder, private dialog : MatDialog) { }

  ngOnInit(): void {
    if (this.task != null && this.task != undefined) {
      this.isTypeSelected = true;
      this.form = this.fb.group({
        selectedAction: ['', Validators.required],
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
      height: 'auto',
      //title : "Resolved By Iteself",
      position: { top: '20px' },
      panelClass: 'custom-confirm-dialog',
      data: {
        type: "vms"
      }
    })
  }
}
