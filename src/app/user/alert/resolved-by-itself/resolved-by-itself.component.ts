import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmTextareaComponent } from '../../../common/cm-textarea/cm-textarea.component';
import { CmButtonComponent } from '../../../common/cm-button/cm-button.component';
import { Dialog } from '@angular/cdk/dialog';

export interface ResolvedByData {
  alertId?: string;
  policyName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'app-resolved-by-itself',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule,CmTextareaComponent, CmButtonComponent],
  templateUrl: './resolved-by-itself.component.html',
  styleUrl: './resolved-by-itself.component.css'
})
export class ResolvedByItselfComponent implements OnInit {

  form: FormGroup;
  inputFields = {
    remarks : {
      labelHeader: '',
      placeholder: 'Remarks',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    }
  }
  fileName: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ResolvedByData, private fb: FormBuilder,private dialog : Dialog) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      remarks: ['', Validators.required]
    });
  }
  close() {
    this.dialog.closeAll();
  }

  submitAction() {
    
  }
  cancelAction() {

  }
  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    this.fileName = file.name;
    this.form.patchValue({ document: file });
  }
}

}
