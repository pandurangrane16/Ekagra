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
import { ToastrService } from 'ngx-toastr';
import { consumemodel } from '../../models/admin/consume.model';
import { getErrorMsg } from '../../utils/utils';
import { projapirequestmodel } from '../../models/admin/projectapirequest.model';

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
      isTypeOptionsLoaded=false;
      isInputTypeOptionsLoaded=false;
      

      authRequiredFlag=false;
      UserDefined:any;
      SystemAuto:any;
      DateType:any;
      GuidType:any;
      responsebox =false;
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
           qsType= {
        //labelHeader: 'Api List',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
    };
            qsValue= {
        //labelHeader: 'Api List',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
    };
    qsInputType={
       //labelHeader: 'Api List',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
    };
    qsSelectedType={
        lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
    }
        
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
   createdId:any;
   apilist:any;
   additionalResponse:any;
   parsedResponse: any;
   selectedKey: string = '';  
   isStaticFlag: boolean = false;
  constructor(
    private fb: FormBuilder, private loader: LoaderService, private service:apiplaygroundservice,private apiService: ApiService,private toast :ToastrService,
  ) {
    this.form = this.fb.group({
      selectedProject: [null, Validators.required],
      selectedProjType: [null, Validators.required],
      method: ['', Validators.required],
      apiName: ['', Validators.required],
      apiUrl: ['', [Validators.required,Validators.pattern(/^(https?:\/\/)[^\s]+$/)]],
      apiseq: ['', Validators.required],
      isActive: [''],
      isrequireauth: [null, Validators.required],
      selectedapi:[''],
      queryStrings: this.fb.array([]),
      bodyType : [''],
      authType : [''],
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
    this.getType();
    this.getInputType();
    this.getUserDefinedType();
    this.GetSystemAutoValue();
    this.GetDateTypes();
    this.GetGuidType();

  this.form.get('isrequireauth')?.valueChanges.subscribe((value: boolean) => {
      const selectedApiControl = this.form.get('selectedapi');
  if (value === true) {
  this.getapilist();
  
    selectedApiControl?.setValidators(Validators.required);
    selectedApiControl?.updateValueAndValidity();
    
  } else {
    this.authRequiredFlag = false; 
        selectedApiControl?.clearValidators();
    selectedApiControl?.updateValueAndValidity();
  }
});

this.queryStringsFormArray.valueChanges.subscribe((qsArray) => {
 console.log("h1");
});





this.form.get('apiUrl')?.valueChanges.subscribe((url: string) => {
  if (url) {
    this.populateQueryParamsFromUrl(url);
  }
});

    this.form.get('selectedProject')?.valueChanges.subscribe((value:any) => {
    this.authRequiredFlag = false; 
    this.form.get('isrequireauth')?.setValue(null);
    this.form.get('isrequireauth')?.markAsUntouched();
    this.form.get('isrequireauth')?.markAsDirty();
    this.form.get('isrequireauth')?.updateValueAndValidity();

      if (value?.value) { 
    this.service.Apiseq(value.value).subscribe({
      next: (res: any) => {
        if (res?.success && res?.result != null) {
          this.form.get('apiseq')?.setValue(res.result);
          this.form.get('apiseq')?.disable();
        }
      },
      error: (err) => {
        console.error('Error fetching sequence:', err);
      }
    });
  }

    
  
});

this.form.get('selectedapi')?.valueChanges.subscribe((value: any) => {
    try {
      console.log("1234", value.response);
      if (typeof value.response === 'string') {
        this.parsedResponse = JSON.parse(value.response);
      } else {
        this.parsedResponse = value.response;
      }
      
    } catch (error) {
      console.error('Error parsing response:', error);
      this.parsedResponse = value.response;
    }
 });





  }

  selectedKeys: Set<string> = new Set(); 

isSelected(key: string): boolean {
  return this.selectedKeys.has(key);
}
 getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
      return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
    }

      get f() {
  return this.form.controls;
  }
onCheckboxChange(event: Event, key: string): void {
  const checked = (event.target as HTMLInputElement).checked;

  if (checked) {
    this.selectedKeys.add(key);
    console.log(this.selectedKeys)
    this.updateRequestParam(); 
  } else {
    this.selectedKeys.delete(key);
    console.log(this.selectedKeys)
    this.updateRequestParam(); 
  }
}
updateRequestParam(): void {
  const selectedApiId = this.form.controls['selectedapi'].value.value;
  if (!selectedApiId) {
    console.error('No API ID selected in the form');
    return;
  }

  const record = this.apilist.find((r: any) => r.id === selectedApiId);
  if (!record) {
    console.error(`Record not found with id ${selectedApiId}`);
    return;
  }

  const updatedRecord = { ...record };

 
  updatedRecord.requestParam = Array.from(this.selectedKeys).join(',');

  console.log('Final updatedRecord:', updatedRecord);

  this.service.UpdateProjectApi(updatedRecord).subscribe({
    next: res => console.log('API update success', res),
    error: err => console.error('API update failed', err)
  });
}



  objectKeys = Object.keys;

    

  getResponseKeys(): string[] {
  return this.additionalResponse ? Object.keys(this.additionalResponse) : [];
}
  get queryStringsFormArray(): FormArray<FormGroup> {
    return this.form.get('queryStrings') as FormArray<FormGroup>;
  }
//   updateUrlFromQueryStrings(qsArray: any[]): void {
//   const baseUrl = this.form.get('apiUrl')?.value?.split('?')[0] || '';

//   if (!baseUrl) return;

//   const queryParams = qsArray
//     .filter(q => q.qsKey && q.qsValue) // ensure key-value pairs exist
//     .map(q => `${encodeURIComponent(q.qsKey)}=${encodeURIComponent(q.qsValue)}`)
//     .join('&');

//   const newUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;

//   // To avoid loop: update URL only if it changed
//   if (this.form.get('apiUrl')?.value !== newUrl) {
//     this.form.get('apiUrl')?.setValue(newUrl, { emitEvent: false });
//   }
// }

populateQueryParamsFromUrl(url: string): void {
  this.queryStringsFormArray.clear();
  let index = 1;

  try {
    const parsedUrl = new URL(url);

    // 1. Add base URL (protocol + host + port)
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.port ? ':' + parsedUrl.port : ''}`;
    this.createQueryStrings({
      qsNo: index++,
      qsKey: baseUrl,
      qsValue: '',
      qsType: { name: 'URL', value: '6' },
      qsInputType: { name: 'Static', value: '3' },
      qsSelectedType: ''
    });

    // 2. Add each path segment
    const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment);
    pathSegments.forEach(segment => {
      this.createQueryStrings({
        qsNo: index++,
        qsKey: segment,
        qsValue: '',
        qsType: { name: 'URL', value: '6' },
        qsInputType: { name: 'Static', value: '3' },
        qsSelectedType: ''
      });
    });

    // 3. Add each query parameter
    const params = new URLSearchParams(parsedUrl.search);
    for (const key of params.keys()) {
      this.createQueryStrings({
        qsNo: index++,
        qsKey: key,
        qsValue: '',
        qsType: { name: 'URL', value: '6' },
        qsInputType: { name: 'Static', value: '3' },
        qsSelectedType: ''
      });
    }

  } catch (error) {
    console.error('Invalid URL format:', error);
  }
}



dropdown:any;
//   createQueryStrings() {
//     let len = this.form.controls['queryStrings'].length;
//     const group = this.fb.group({
//       qsNo: [{value : (len == undefined ? 1 : len+1),disabled: true}],
//       qsKey: ['', Validators.required],
//       qsValue: ['', Validators.required],
//       qsType:['', Validators.required],
//       qsInputType:['', Validators.required],
//       qsSelectedType:['', Validators.required]
//     });
//     this.queryStringsFormArray.push(group);
// group.get('qsInputType')?.valueChanges.subscribe(value => {
//  console.log("hello");

 
// });
//   }

  createQueryStrings(prefillData?: any) {
  const len = this.queryStringsFormArray.length;

  const group = this.fb.group({
    qsNo: [{ value: prefillData?.qsNo || len + 1, disabled: true }],
    qsKey: [{ value: prefillData?.qsKey || '', disabled: true }],
    qsValue: [prefillData?.qsValue || ''],
    qsType: [prefillData?.qsType || ''],
    qsInputType: [prefillData?.qsInputType || ''],
    qsSelectedType: [prefillData?.qsSelectedType || ''],
    isStaticFlag: [true],
    isUserDefined:[false],
    isSystemAuto: [false],
    isDate:[false],
    isGuid:[false],
    isinput:[true],
  });

  this.queryStringsFormArray.push(group);


group.get('qsInputType')?.valueChanges.subscribe((selectedOption: any) => {
  const selectedName = selectedOption?.name;

 

  if (selectedName === 'UserDefined') {
    this.qsValue.options=this.UserDefined;
    group.get('isUserDefined')?.setValue(true, { emitEvent: false });
    group.get('isStaticFlag')?.setValue(false, { emitEvent: false });
    group.get('isSystemAuto')?.setValue(false, { emitEvent: false });
  } else if (selectedName === 'SystemAUto') {
  
   this.qsValue.options=this.SystemAuto;
      group.get('isUserDefined')?.setValue(false, { emitEvent: false });
    group.get('isStaticFlag')?.setValue(false, { emitEvent: false });
    group.get('isSystemAuto')?.setValue(true, { emitEvent: false });
  } else {
      group.get('isUserDefined')?.setValue(false, { emitEvent: false });
    group.get('isStaticFlag')?.setValue(true, { emitEvent: false });
    group.get('isSystemAuto')?.setValue(false, { emitEvent: false });
  }

  console.log('Selected:', selectedName);
});

group.get('qsValue')?.valueChanges.subscribe((selectedOption: any) => {
  const selectedName = selectedOption?.name;

 

  if (selectedName === 'Guid') {
    this.qsSelectedType.options=this.GuidType;
    group.get('isGuid')?.setValue(true, { emitEvent: false });
    group.get('isDate')?.setValue(false, { emitEvent: false });
    group.get('isinput')?.setValue(false, { emitEvent: false });
  } 
  else if (selectedName === 'Date') {
  
   this.qsSelectedType.options=this.DateType;
      group.get('isGuid')?.setValue(false, { emitEvent: false });
    group.get('isDate')?.setValue(true, { emitEvent: false });
    group.get('isinput')?.setValue(false, { emitEvent: false });
  }
  else{
        group.get('isGuid')?.setValue(false, { emitEvent: false });
    group.get('isDate')?.setValue(false, { emitEvent: false });
    group.get('isinput')?.setValue(true, { emitEvent: false });
  }

  console.log('Selected:', selectedName);
});



}



  
  

  get bodyFormArray(): FormArray<FormGroup> {
    return this.form.get('body') as FormArray<FormGroup>;
  }
  createBody() {
    const group = this.fb.group({
      bodyValue: [''],
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

  getType() {
  this.service.GetType().subscribe(response => {
    const items = response?.result || [];
    const projectOptions = items.map((item: any) => ({
      name: item.prmidentifier,
      value: item.prmvalue
    }));
   this.qsType.options = projectOptions;
    this.isTypeOptionsLoaded = true;

  }, error => {
    console.error('Error fetching project list', error);
  });
}
  getInputType() {
  this.service.GetInputType().subscribe(response => {
    const items = response?.result || [];
    const projectOptions = items.map((item: any) => ({
      name: item.prmidentifier,
      value: item.prmvalue
    }));
   this.qsInputType.options = projectOptions;
    this.isInputTypeOptionsLoaded = true;
 
  }, error => {
    console.error('Error fetching project list', error);
  });
}
  getUserDefinedType() {
  this.service.GetUserDefinedValue().subscribe(response => {
    const items = response?.result || [];
    const projectOptions = items.map((item: any) => ({
      name: item.prmidentifier,
      value: item.prmvalue
    }));
   this.UserDefined = projectOptions;
  }, error => {
    console.error('Error fetching project list', error);
  });
}
  GetSystemAutoValue() {
  this.service.GetSystemAutoValue().subscribe(response => {
    const items = response?.result || [];
    const projectOptions = items.map((item: any) => ({
      name: item.prmidentifier,
      value: item.prmvalue
    }));
   this.SystemAuto = projectOptions;
    
  }, error => {
    console.error('Error fetching project list', error);
  });
}
  GetDateTypes() {
  this.service.GetDateTypes().subscribe(response => {
    const items = response?.result || [];
    const projectOptions = items.map((item: any) => ({
      name: item.prmidentifier,
      value: item.prmvalue
    }));
   this.DateType = projectOptions;
   console.log(this.DateType)
    
  }, error => {
    console.error('Error fetching project list', error);
  });
}
  GetGuidType() {
  this.service.GetGuidType().subscribe(response => {
    const items = response?.result || [];
    const projectOptions = items.map((item: any) => ({
      name: item.prmidentifier,
      value: item.prmvalue
    }));
   this.GuidType = projectOptions;
   console.log(this.GuidType)
    
  }, error => {
    console.error('Error fetching project list', error);
  });
}
  getapilist() {
  const selectedProjectId = this.form.controls['selectedProject'].value.value;
  console.log("hi",selectedProjectId);
  this.service.GetApiList(selectedProjectId).subscribe(response => {
    const items = response?.result || [];
    this.apilist =items;

    console.log("items",items)

    const projectOptions = items.map((item: any) => ({
      name: item.apiName,
      value: item.id,
      response:item.response
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
      headerKey: [''],
      headerValue: ['']
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
    
       qsInputType: {
      // labelHeader: 'Name',
      placeholder: 'Enter InputType',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    },
       qsSelectedType: {
      // labelHeader: 'Name',
      placeholder: 'Enter SelectedType',
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

// onSend() {

//  console.log(this.queryStringsFormArray)
//   const formValues = this.form.value;  

// const bodyObject = this.buildBodyObject();
// const bodyJsonString = encodeURIComponent(JSON.stringify(bodyObject));
// console.log("body",bodyJsonString,bodyObject),

//   this.service.Consume(

//     this.form.controls['selectedProject'].value.value,
//     this.form.controls['selectedProjType'].value.value,

//     formValues.apiName,
//     encodeURIComponent(formValues.apiUrl),
//     encodeURIComponent(formValues.apiUrl),
//      this.form.controls['method'].value.value,

//     formValues.requestParam,
//     formValues.header,
//     formValues.authReq,
//     formValues.authApiId,
//     formValues.authType,
//     formValues.apiseq,
//     formValues.authenticationHeader,
//     formValues.commType,
//     formValues.bodyType,
//     bodyJsonString,

//     null, // ResponseStatusCode
//     null, // Response
//     true, // IsActive
//     null,// projectName,
//     false, // IsDeleted
//     null, // DeleterUserId
//     null, // DeletionTime
//     null, // LastModificationTime
//     null, // LastModifierUserId
//     null, // CreationTime
//     null // CreatorUserId 
//   ).subscribe({
//   next: (res: any) => {
//   let parsedResult;

//   try {
//     parsedResult = typeof res?.result === 'string' ? JSON.parse(res.result) : res.result;
//   } catch (e) {
//     parsedResult = res.result; // fallback if JSON.parse fails
//   }

//   this.responseText = JSON.stringify(parsedResult, null, 2);
//   //this.form.get('responseText')?.setValue(responseText);
// }
//   });
// }

onSend() {

  const isAuthRequired = this.form.get('isrequireauth')?.value;
  const selectedProjType = this.form.get('selectedProjType')?.value.value;
  console.log(selectedProjType)
    if (selectedProjType === '4') {
    this.toast.error('Please select authorization type in Auth Tab');
    return;
  }

  else{
  if (isAuthRequired && this.selectedKeys.size === 0) {
    this.toast.error('At least one key must be selected for request parameter.');
    return; 
  }
  else{
  if (this.form.invalid) {

    this.toast.error('Please select all the values before Sending.');
    this.form.markAllAsTouched();
    return;
  }

  else{
const creationTime = new Date();
const formValues = this.form.value;
const bodyObject = this.buildBodyObject();
const bodyJsonString = JSON.stringify(bodyObject); 

const payload = {
    ProjectId: this.form.controls['selectedProject'].value?.value,
    Type: this.form.controls['selectedProjType'].value?.value,  
    APIName: formValues.apiName,
    BaseURL: formValues.apiUrl,
    RequestURL: formValues.apiUrl,
    HttpMethod: this.form.controls['method'].value?.value,
    RequestParam: "",
    Header: "",
    AuthReq: formValues.isrequireauth,
    AuthAPIId: this.form.controls['selectedapi'].value?.value, 
    AuthenticatioType: formValues.authType,
    APISeq: formValues.apiseq,
    AuthenticationHeader: "",
    CommType:0,
    BodyType: formValues.bodyType,
    Body: bodyJsonString,
    ResponseStatusCode: "",
    Response: "",
    IsActive: true,
    ProjectName: "",
    IsDeleted: false,
    DeleterUserId: "",
    DeletionTime: creationTime,
    LastModificationTime: creationTime,
    LastModifierUserId: "",
    CreationTime: creationTime,
    CreatorUserId: ""
  };

  this.service.Consume(payload).subscribe({
    next: (res: any) => {
      let parsedResult;
      this.responsebox=true;

      try {
        parsedResult = typeof res?.result === 'string' ? JSON.parse(res.result) : res.result;
      } catch (e) {
        parsedResult = res.result;
      }

      this.responseText = JSON.stringify(parsedResult, null, 2);
    }
  });
  }
  }

  }


}



RemoveHeader(index:any){
    const itemsArray = this.form.get('headers') as FormArray;
    itemsArray.removeAt(index);
  }
submit(): void {
  // if (this.form.invalid) {
  //   this.form.markAllAsTouched(); 
  //   return;
  // }

const bodyArray = this.form.get('body')?.value;
const bodyValue = bodyArray?.[0]?.bodyValue || null;
console.log("body2", bodyValue);
const creationTime = new Date();
console.log(creationTime);

  const formValues = this.form.value;
   if (
    !formValues.body ||
    formValues.body.length === 0 ||
    formValues.body.every((item: any) => !item.bodyValue?.trim())
  ) {
    formValues.body = null; 
  }
  console.log(formValues.body)
  console.log(formValues.apiseq)
  

  const model: projapimodel = {
    projectId:  this.form.controls['selectedProject'].value.value,
    type: this.form.controls['selectedProjType'].value.value,
    apiName: formValues.apiName,
    baseURL:   formValues.apiUrl,
    requestURL: formValues.apiUrl,
    httpMethod:  this.form.controls['method'].value.value,
    requestParam: null,
    header: formValues.header,
    authReq: formValues.isrequireauth,
    authAPIId: formValues.authAPIId,
    authenticatioType: formValues.authType,
    apiSeq:  formValues.apiseq - 1,
    authenticationHeader:null,
    commType: 0,
    bodyType: formValues.bodyType,
    body:bodyArray?.[0]?.bodyValue || null,
    responseStatusCode: 200,  
    response: this.responseText,            
    isActive: true,            
    projectName:  this.form.controls['selectedProject'].value.name,
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: creationTime,
    lastModificationTime: creationTime,
    lastModifierUserId: 0,
    creationTime: creationTime,
    creatorUserId: 0,
    id: 0
  };

  this.service.CreateProjectApi(model).subscribe({
    next: (res) => {
      this.createdId = res.result.id;
      this.toast.success('ProjectAPI saved successfully with ID:',this.createdId);
      console.log('API created successfully:', res);
      console.log(this.createdId);

      



const requestModels: projapirequestmodel[] = this.queryStringsFormArray.controls.map((group: FormGroup, index: number) => {
  return {
    apiId: this.createdId,
    type: this.form.controls['selectedProjType'].value.value,
    key: group.get('qsKey')?.value,
    inputType: group.get('qsInputType')?.value.value,
    inputSource: group.get('qsSelectedType')?.value.value,
    inputValue: group.get('qsValue')?.value.value,
    seq: group.get('qsNo')?.value -1,
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: creationTime,
    lastModificationTime: creationTime,
    lastModifierUserId: 0,
    creationTime: creationTime,
    creatorUserId: 0,
    id: 0
  };
});
const maxSeq = requestModels.reduce((max, item) => item.seq > max ? item.seq : max, 0);


const methodKeyModel: projapirequestmodel = {
  apiId: this.createdId,
  type: this.form.controls['selectedProjType'].value.value,
  key: this.form.controls['method'].value.value,
  inputType: 7,
  inputSource: null,
  inputValue: null,
  seq: maxSeq+1,
  isDeleted: false,
  deleterUserId: 0,
  deletionTime: creationTime,
  lastModificationTime: creationTime,
  lastModifierUserId: 0,
  creationTime: creationTime,
  creatorUserId: 0,
  id: 0
};

requestModels.push(methodKeyModel);  

console.log(requestModels);
requestModels.forEach(model => {
  this.service.CreateProjectApiRequest(model).subscribe({
   next: (res) => {
   this.toast.success('ProjectAPIRequest saved successfully.');
      
   },
    error: (err) => {
      console.error('Error creating API:', err);
    }
  });
})




    },

    error: (err) => {
      console.error('Error creating API:', err);
    }
  });
}


  close() {

  }
}
