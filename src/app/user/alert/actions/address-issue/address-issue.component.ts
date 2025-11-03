import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';

@Component({
  selector: 'app-address-issue',
  imports: [CommonModule, MaterialModule,CmTextareaComponent],
  templateUrl: './address-issue.component.html',
  styleUrl: './address-issue.component.css'
})
export class AddressIssueComponent implements OnInit {
  @Input() task: any;
  isTypeSelected: boolean = false;
  form: any;
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
  constructor(private fb: FormBuilder, private dialog: MatDialog) { }
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
  SubmitAction() {}
  CancelAction() {}
}
