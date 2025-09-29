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

@Component({
  selector: 'app-atcs-health',
  imports: [MaterialModule, CommonModule, CmSelect2Component, SmsActionComponent, EmailActionComponent, CmTextareaComponent],
  templateUrl: './atcs-health.component.html',
  styleUrl: './atcs-health.component.css',
  standalone : true
})
export class AtcsHealthComponent implements OnInit {
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
