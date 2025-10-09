import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';
import { MatDialog } from '@angular/material/dialog';
import { AddressbookComponent } from '../addressbook/addressbook.component';

@Component({
  selector: 'app-email-action',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmInputComponent, CmTextareaComponent],
  templateUrl: './email-action.component.html',
  styleUrl: './email-action.component.css'
})
export class EmailActionComponent implements OnInit {
form: any;
  contactNoSettings = {
    labelHeader: 'Email ID',
    formFieldClass: 'cm-square-input',
    placeholder: 'Email Address',
    appearance: 'outline',
    isDisabled: false
  };

   subjectSettings = {
    labelHeader: 'Email Subject',
    formFieldClass: 'cm-square-input',
    placeholder: 'Email Subject',
    appearance: 'outline',
    isDisabled: false
  };  

   inputFields = {
    msgText : {
      labelHeader: '',
      placeholder: 'Email Body(Text/HTML)',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    }
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      emailId: ['', Validators.required],
      subject : ['',Validators.required],
      mailBody: ['', Validators.required],
      isHtml : [false,Validators.required]
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddressbookComponent, {
      width: '800px',
      height: '700px',
      //title : "Resolved By Iteself",
      position: { top: '20px' },
      panelClass: 'custom-confirm-dialog',
      data: {
        policyName: "Policy 001"
      }
    })
  }
  close() {

  }
  SubmitAction() {

  }
  CancelAction() {
    
  }
}
