import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../services/common/loader.service';
import { ApiService } from '../../services/common/api.service';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { CmRadioComponent } from "../../common/cm-radio/cm-radio.component";
import { CmTextareaComponent } from "../../common/cm-textarea/cm-textarea.component";
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { CmLeafletComponent } from '../../common/cm-leaflet/cm-leaflet.component';

@Component({
  selector: 'app-api-playground',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmInputComponent, 
    CmRadioComponent, CmTextareaComponent,CmTextareaComponent,CmSelect2Component],
  templateUrl: './api-playground.component.html',
  styleUrl: './api-playground.component.css',
  standalone: true
})
export class ApiPlaygroundComponent implements OnInit {
  isMap : boolean = false;
   tabs = [
    { label: 'Params', content : "Test Param" },
    { label: 'Body', content : "Test Body" }
  ];
apiTypeSettings = {
  labelHeader: 'Select Type',
  lableClass: 'form-label',
  formFieldClass: '', 
  appearance: 'outline',
  options: [
    { name: 'GET', value: 'get' },
    { name: 'POST', value: 'post' },
    { name: 'PUT', value: 'put' },
    { name: 'DELETE', value: 'delete' }
  ]
};
  radioInputData = {
    label : "",
    data : ['None', 'JSON', 'Form']
  }
  radioAuthInputData = {
    label : "",
    data : ['None', 'Bearer', 'Basic','Custom']
  }
  constructor(
    private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService,
  ) {
    this.form = this.fb.group({
      apiName: ['', Validators.required],
      apiUrl: ['', Validators.required],
      apiType:['', Validators.required],
      queryStrings: this.fb.array([]),
      bodyType : ['', Validators.required],
      authType : ['', Validators.required],
      body: this.fb.array([]),
      auth: this.fb.array([]),
      headers : this.fb.array([]),
    });

    this.createBody();
    this.createAuth();
    //this.();
  }
  ngOnInit(): void {

  }
  get queryStringsFormArray(): FormArray<FormGroup> {
    return this.form.get('queryStrings') as FormArray<FormGroup>;
  }
  createQueryStrings() {
    let len = this.form.controls['queryStrings'].length;
    const group = this.fb.group({
      qsNo: [{value : (len == undefined ? 1 : len+1),disabled: true}],
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
      bodyValue: ['', Validators.required],
    });
    this.bodyFormArray.push(group);
  }

  get authFormArray(): FormArray<FormGroup> {
    return this.form.get('auth') as FormArray<FormGroup>;
  }
  createAuth() {
    const group = this.fb.group({
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
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    },
    qsKey: {
      // labelHeader: 'Name',
      placeholder: 'Enter Key',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    },
    qsValue: {
      // labelHeader: 'Name',
      placeholder: 'Enter Value',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    },
    bodyJson: {
      //labelHeader: 'JSON',
      placeholder: '{ "Key" : "Value" }',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    bodyForm: {
      //labelHeader: 'JSON',
      placeholder: 'key1=value1\nkey2=value2',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    bearerToken : {
      labelHeader: 'Bearer Token',
      placeholder: '<Bearer> <Token>',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    basicAuthUsername : {
      labelHeader: 'Username',
      placeholder: 'Username',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    basicAuthPassword : {
      labelHeader: 'Password',
      placeholder: 'Password',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
  };

  RemoveQS(index:any){
    const itemsArray = this.form.get('queryStrings') as FormArray;
    itemsArray.removeAt(index);
     this.resequenceQsNo(itemsArray);
  }

  resequenceQsNo(formArray: FormArray) {
  formArray.controls.forEach((group, i) => {
    const qsNoControl = group.get('qsNo');
    qsNoControl?.setValue(i + 1);
  });
}

RemoveHeader(index:any){
    const itemsArray = this.form.get('headers') as FormArray;
    itemsArray.removeAt(index);
  }
  submit() {
    setTimeout(() => {
      this.isMap = true;
    }, 2000);
    console.log(this.form.controls);
    if (this.form.valid) {
      
    }
  }

  close() {

  }
}
