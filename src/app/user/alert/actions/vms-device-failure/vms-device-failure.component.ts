import { Component, Input, input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';
import { SmsActionComponent } from "../sms-action/sms-action.component";
import { EmailActionComponent } from "../email-action/email-action.component";
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';
import { MatDialog } from '@angular/material/dialog';
import { AddressbookComponent } from '../addressbook/addressbook.component';

@Component({
  selector: 'app-vms-device-failure',
  imports: [MaterialModule, CommonModule, CmSelect2Component, SmsActionComponent, EmailActionComponent, CmTextareaComponent],
  templateUrl: './vms-device-failure.component.html',
  styleUrl: './vms-device-failure.component.css',
  standalone:true
})
export class VmsDeviceFailureComponent implements OnInit {
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
    const dialogRef = this.dialog.open(AddressbookComponent, {
      width: '800px',
      height: '700px',
      //title : "Resolved By Iteself",
      position: { top: '20px' },
      panelClass: 'custom-confirm-dialog',
      data: {
        type: "vms"
      }
    })
  }
}
