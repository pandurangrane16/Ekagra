import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { response } from 'express';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';

@Component({
  selector: 'app-api-action',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmSelect2Component, CmInputComponent,CmTextareaComponent],
  templateUrl: './api-action.component.html',
  styleUrl: './api-action.component.css',
  standalone: true
})
export class ApiActionComponent implements OnInit {
  form: any;
  isApiLoaded: boolean = false;
  apiSettings: any;
    requestTypeSettings = {
    labelHeader: 'Request Type',
    formFieldClass: 'cm-square-input',
    placeholder: 'Request Type',
    appearance: 'outline',
    isDisabled: true
  };
  inputFields = {requestBodySettings :  {
      labelHeader: 'Request Body',
      placeholder: 'Request Body(Request Type is Query String, placed values in comma separated.)',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    },
    responseBodySettings :  {
      labelHeader: 'Response Body',
      placeholder: 'Response Body',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    }
  }
  constructor(private fb: FormBuilder) {
  this.apiSettings = {
      labelHeader: 'Select API',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: [],
    };
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      apiId: ['', Validators.required],
      requestType: ['', Validators.required],
      requestBody: [''],
      responseBody: ['']
    })
  }
  onManagerSelected(evt: any) { }

  SubmitAction(){}
}
