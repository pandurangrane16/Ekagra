import { Component, Input,OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressbookComponent } from "../addressbook/addressbook.component";
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';


@Component({
  selector: 'app-sms-action',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmInputComponent, CmTextareaComponent],
  templateUrl: './sms-action.component.html',
  styleUrl: './sms-action.component.css',
  standalone: true
})
export class SmsActionComponent implements OnInit {
    @Input() task : any;
    @Input() selectedAction!: string;
  form: any;
  contactNoSettings = {
    labelHeader: 'Contact Number\'s',
    formFieldClass: 'cm-square-input',
    placeholder: 'Contact Number',
    appearance: 'outline',
    isDisabled: false
  };

   inputFields = {
    msgText : {
      labelHeader: '',
      placeholder: 'Text',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    }
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      contactNo: ['', Validators.required],
      msgText: ['', Validators.required]
    })
  }


  openDialog() {
  const dialogRef = this.dialog.open(AddressbookComponent, {
    width: '800px',
    height: '700px',
    position: { top: '20px' },
    panelClass: 'custom-confirm-dialog',
    data: { task: this.task , selectedAction: this.selectedAction }
  });

  dialogRef.afterClosed().subscribe((result: string[]) => {
    console.log("Contacts received from dialog:", result);

    if (result && result.length > 0) {
      // this.task.contactNumbers = result; // Store into task or desired place
      // console.log("Updated Task:", this.task);
         this.form.patchValue({
      contactNo: result
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
