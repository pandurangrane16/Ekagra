import { Component,Input, OnInit } from '@angular/core';
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
    @Input() task : any;
    @Input() selectedAction!: string;
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
  maxHeight: '90vh', // prevents overflow
  panelClass: 'custom-confirm-dialog',
    data: { task: this.task , selectedAction: this.selectedAction }
  });

  dialogRef.afterClosed().subscribe((result: string[]) => {
    console.log("Contacts received from dialog:", result);

    if (result && result.length > 0) {
      // this.task.contactNumbers = result; // Store into task or desired place
      // console.log("Updated Task:", this.task);
         this.form.patchValue({
      emailId: result
    });
    }
  });
}
  close() {

  }
  SubmitAction() {

  }
  CancelAction() {
    
  }
}
