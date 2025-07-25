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
import { apiplaygroundservice } from '../../services/admin/apiplayground.service';
import { CmToggleComponent } from '../../common/cm-toggle/cm-toggle.component';
import { projapimodel } from '../../models/admin/projectapi.model';

@Component({
  selector: 'app-api-playground',
  imports: [MaterialModule,CmToggleComponent, CommonModule, ReactiveFormsModule, CmInputComponent, CmRadioComponent, CmTextareaComponent,CmTextareaComponent,CmSelect2Component],
  templateUrl: './api-playground.component.html',
  styleUrl: './api-playground.component.css',
  standalone: true
})
export class ApiPlaygroundComponent implements OnInit {
   tabs = [
    { label: 'Params', content : "Test Param" },
    { label: 'Body', content : "Test Body" }
  ];
apiTypeSettings = {
  labelHeader: 'Method',
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
      isProjectOptionsLoaded = false;
      isProjtypeOptionsLoaded = false;
      authRequiredFlag=false;
  radioInputData = {
    label : "",
    data : ['None', 'JSON', 'Form']
  }
  radioAuthInputData = {
    label : "",
    data : ['None', 'Bearer', 'Basic','Custom']
  }
       projectSelectSettings = {
          labelHeader: 'Select Project',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
         
    zonename: {
      // labelHeader: 'Name',
      placeholder: 'Enter API Seq',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      
      formFieldClass: "w-100"
    }
            projectTypeSettings = {
          labelHeader: 'Project Type',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
          Apitype_forauth = {
          labelHeader: 'Api List',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
          projectEnabled = {
   
    name: 'isActive',
   
     formControlName: 'isActive',
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
         isrequireauth = {
   
    name: 'isrequireauth',
   
     formControlName: 'isrequireauth',
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
  responseText: string = '';
   selectedProject: any;
  constructor(
    private fb: FormBuilder, private loader: LoaderService, private service:apiplaygroundservice,private apiService: ApiService
  ) {
    this.form = this.fb.group({
      selectedProject: [''],
      selectedProjType:[''],
      method:[''],
      apiName: ['', Validators.required],
      apiUrl: ['', Validators.required],
      apiseq:[''],
      isActive:[''],
      isrequireauth:[''],
      selectedapi:[''],



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

    console.log(this.authRequiredFlag)
    this.getProjList();
    this.GetProjectType();

        this.form.get('isrequireauth')?.valueChanges.subscribe((value: boolean) => {
  if (value === true) {
  this.getapilist();
    
  } else {
    this.authRequiredFlag = false; 
  }
});

this.queryStringsFormArray.valueChanges.subscribe((qsArray) => {
  this.updateUrlFromQueryStrings(qsArray);
});

this.form.get('apiUrl')?.valueChanges.subscribe((url: string) => {
  if (url) {
    this.populateQueryParamsFromUrl(url);
  }
});

        this.form.get('selectedProject')?.valueChanges.subscribe((value: boolean) => {
 
    this.authRequiredFlag = false; 
  
});





  }
  get queryStringsFormArray(): FormArray<FormGroup> {
    return this.form.get('queryStrings') as FormArray<FormGroup>;
  }
  updateUrlFromQueryStrings(qsArray: any[]): void {
  const baseUrl = this.form.get('apiUrl')?.value?.split('?')[0] || '';

  if (!baseUrl) return;

  const queryParams = qsArray
    .filter(q => q.qsKey && q.qsValue) // ensure key-value pairs exist
    .map(q => `${encodeURIComponent(q.qsKey)}=${encodeURIComponent(q.qsValue)}`)
    .join('&');

  const newUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

  // To avoid loop: update URL only if it changed
  if (this.form.get('apiUrl')?.value !== newUrl) {
    this.form.get('apiUrl')?.setValue(newUrl, { emitEvent: false });
  }
}

  populateQueryParamsFromUrl(url: string): void {
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) return;

  const queryString = url.substring(queryIndex + 1); // get the part after '?'
  const params = new URLSearchParams(queryString);

  // Clear all existing rows
  this.queryStringsFormArray.clear();

  let index = 1;

  params.forEach((value, key) => {
    const group = this.fb.group({
      qsNo: [{ value: index++, disabled: true }],
      qsKey: [key, Validators.required],
      qsValue: [value, Validators.required]
    });

    this.queryStringsFormArray.push(group);
  });
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
  getProjList() {
  this.service.GetProjectList().subscribe(response => {
    const items = response?.result || [];

    const projectOptions = items.map((item: any) => ({
      name: item.name || item.shortCode,
      value: item.id
    }));

  
    // projectOptions.unshift({
    //   name: 'All',
    //   value: null
    // });

   this.projectSelectSettings.options = projectOptions;
// this.form.controls['selectedProject'].setValue({
//   name: 'All',
//   value: null
// });


    this.isProjectOptionsLoaded = true;
  }, error => {
    console.error('Error fetching project list', error);
  });
}
  getapilist() {
  const selectedProjectId = this.form.controls['selectedProject'].value.value;
  console.log("hi",selectedProjectId);
  this.service.GetApiList(selectedProjectId).subscribe(response => {
    const items = response?.result || [];

    const projectOptions = items.map((item: any) => ({
      name: item.apiName,
      value: item.id
    }));

  

   this.Apitype_forauth.options = projectOptions;



    this.authRequiredFlag = true;
  }, error => {
    console.error('Error fetching api list', error);
  });
}
private buildBodyObject(): any {
  const bodyArray = this.form.get('body')?.value;

  if (!bodyArray || bodyArray.length === 0) return {};

  const rawJson = bodyArray[0]?.bodyValue;

  try {
    return JSON.parse(rawJson);
  } catch (error) {
    console.error('Invalid JSON in bodyValue:', error);
    return {}; 
  }
}
GetProjectType() {
  this.service.GetProjectType().subscribe(response => {
    const items = response?.result || [];

    const projectOptions = items.map((item: any) => ({
      name: item.prmvalue, 
      value: item.rfu1
    }));

  
    // projectOptions.unshift({
    //   name: 'All',
    //   value: null
    // });

  this.projectTypeSettings.options = projectOptions;
// this.form.controls['selectedProject'].setValue({
//   name: 'All',
//   value: null
// });

// this.form.controls['selectedProjType'].setValue({
//   name: 'All',
//   value: null
// });

this.isProjtypeOptionsLoaded=true;
  
  }, error => {
    console.error('Error fetching project list', error);
  });
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
      apiSeq: {
      // labelHeader: 'Name',
      placeholder: 'Enter API Seq.',
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

onSend() {

 console.log(this.queryStringsFormArray)
  const formValues = this.form.value;  

const bodyObject = this.buildBodyObject();
const bodyJsonString = encodeURIComponent(JSON.stringify(bodyObject));
console.log("body",bodyJsonString,bodyObject),

  this.service.Consume(
    this.form.controls['selectedProject'].value.value,
    this.form.controls['selectedProjType'].value.value,

    formValues.apiName,
    encodeURIComponent(formValues.apiUrl),
    encodeURIComponent(formValues.apiUrl),
     this.form.controls['method'].value.value,

    formValues.requestParam,
    formValues.header,
    formValues.authReq,
    formValues.authApiId,
    formValues.authenticationType,
    formValues.apiSeq,
    formValues.authenticationHeader,
    formValues.commType,
    formValues.bodyType,
 bodyJsonString,

    null, // ResponseStatusCode
    null, // Response
    true, // IsActive
    null,// projectName,
    false, // IsDeleted
    null, // DeleterUserId
    null, // DeletionTime
    null, // LastModificationTime
    null, // LastModifierUserId
    null, // CreationTime
    null // CreatorUserId (mock or fetched from auth)
  ).subscribe({
  next: (res: any) => {
  let parsedResult;

  try {
    parsedResult = typeof res?.result === 'string' ? JSON.parse(res.result) : res.result;
  } catch (e) {
    parsedResult = res.result; // fallback if JSON.parse fails
  }

  this.responseText = JSON.stringify(parsedResult, null, 2);
  //this.form.get('responseText')?.setValue(responseText);
}
  });
}


RemoveHeader(index:any){
    const itemsArray = this.form.get('headers') as FormArray;
    itemsArray.removeAt(index);
  }
submit(): void {
  if (this.form.invalid) {
    return;
  }

  const formValues = this.form.value;

  const model: projapimodel = {
    projectId:  this.form.controls['selectedProject'].value.value,
    type: this.form.controls['selectedProjType'].value.value,
    apiName: formValues.apiName,
    baseURL:   encodeURIComponent(formValues.apiUrl),
    requestURL:   encodeURIComponent(formValues.apiUrl),
    httpMethod:  this.form.controls['method'].value.value,
    requestParam: formValues.requestParam,
    header: formValues.header,
    authReq: formValues.authReq,
    authAPIId: formValues.authAPIId,
    authenticatioType: formValues.authenticatioType,
    apiSeq: formValues.apiSeq,
    authenticationHeader: formValues.authenticationHeader,
    commType: formValues.commType,
    bodyType: formValues.bodyType,
    body: formValues.body,
    responseStatusCode: null,  
    response: null,            
    isActive: true,            
    projectName: formValues.projectName,
    isDeleted: false,
    deleterUserId: null,
    deletionTime: null,
    lastModificationTime: null,
    lastModifierUserId: null,
    creationTime: new Date(),
    creatorUserId: 0,
    id: 0
  };

  this.service.CreateProjectApi(model).subscribe({
    next: (res) => {
      console.log('API created successfully:', res);
    
    },
    error: (err) => {
      console.error('Error creating API:', err);
    }
  });
}


  close() {

  }
}
