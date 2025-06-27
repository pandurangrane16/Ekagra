import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../services/common/loader.service';
import { ApiService } from '../../services/common/api.service';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { CmRadioComponent } from "../../common/cm-radio/cm-radio.component";
import { CmTextareaComponent } from "../../common/cm-textarea/cm-textarea.component";

@Component({
  selector: 'app-api-playground',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmInputComponent, CmRadioComponent, CmTextareaComponent,CmTextareaComponent],
  templateUrl: './api-playground.component.html',
  styleUrl: './api-playground.component.css',
  standalone: true
})
export class ApiPlaygroundComponent implements OnInit {
   tabs = [
    { label: 'Params', content : "Test Param" },
    { label: 'Body', content : "Test Body" }
  ];

  radioInputData = {
    label : "",
    data : ['None', 'JSON', 'Form']
  }
  constructor(
    private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService
  ) {
    this.form = this.fb.group({
      apiName: ['', Validators.required],
      apiUrl: ['', Validators.required],
      queryStrings: this.fb.array([]),
      body: this.fb.array([]),
      auth: this.fb.array([]),
      headers : this.fb.array([]),
    });
  }
  ngOnInit(): void {

  }
  get queryStringsFormArray(): FormArray<FormGroup> {
    return this.form.get('queryStrings') as FormArray<FormGroup>;
  }
  createQueryStrings() {
    let len = this.form.controls['queryStrings'].length;
    const group = this.fb.group({
      qsNo: [(len == undefined ? 1 : len + 1), Validators.required],
      qsKey: ['', Validators.required],
      qsValue: ['', Validators.required]
    });
    this.queryStringsFormArray.push(group);
  }

  get bodyFormArray(): FormArray<FormGroup> {
    return this.form.get('body') as FormArray<FormGroup>;
  }
  createBody() {
    const group = this.fb.group({
      bodyType : ['', Validators.required],
      bodyValue: ['', Validators.required],
    });
    this.bodyFormArray.push(group);
  }

  get authFormArray(): FormArray<FormGroup> {
    return this.form.get('auth') as FormArray<FormGroup>;
  }
  createAuth() {
    const group = this.fb.group({
      authType : ['', Validators.required],
      authKey : [''],
      authValue : ['']
    });
    this.authFormArray.push(group);
  }

  get headersFormArray(): FormArray<FormGroup> {
    return this.form.get('headers') as FormArray<FormGroup>;
  }
  createHeader() {
    const group = this.fb.group({
      headerKey: ['', Validators.required],
      headerValue: ['', Validators.required]
    });
    this.headersFormArray.push(group);
  }

  onProjectSelected($event: Event) {

  }
  form!: any;

  inputFields = {
    apiName: {
      // labelHeader: 'Name',
      placeholder: 'Enter API Name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    apiUrl: {
      // labelHeader: 'Name',
      placeholder: 'Enter URL',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    bodyJson: {
      //labelHeader: 'JSON',
      placeholder: '{ "Key" : "Key" , "Value" : "Value"}',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
  };
  submit() {
    if (this.form.valid) {

    }
  }

  close() {

  }
}
