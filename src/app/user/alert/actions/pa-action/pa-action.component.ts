import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';

@Component({
  selector: 'app-pa-action',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmSelect2Component],
  templateUrl: './pa-action.component.html',
  styleUrl: './pa-action.component.css'
})
export class PaActionComponent implements OnInit {
  form: any;
  isApiLoaded: boolean = false;
  audioSettings: any;
  junctionSettings: any;
  requestTypeSettings = {
    labelHeader: 'Request Type',
    formFieldClass: 'cm-square-input',
    placeholder: 'Request Type',
    appearance: 'outline',
    isDisabled: true
  };
  inputFields = {
    requestBodySettings: {
      labelHeader: 'Request Body',
      placeholder: 'Request Body(Request Type is Query String, placed values in comma separated.)',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    },
    responseBodySettings: {
      labelHeader: 'Response Body',
      placeholder: 'Response Body',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    }
  }
  constructor(private fb: FormBuilder) {
    this.audioSettings = {
      labelHeader: 'Select Audio',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: [],
    };

    this.junctionSettings = {
      labelHeader: 'Select Junction',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: [],
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      audioId: ['', Validators.required],
      junctionId: ['', Validators.required],
    })
  }
  onManagerSelected(evt: any) { }

  SubmitAction() { }
}