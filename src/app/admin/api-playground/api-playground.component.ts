import { Component, OnInit,inject } from '@angular/core';
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
import { Router } from '@angular/router';
import { withLoader } from '../../services/common/common';
import { projapirequestmodel } from '../../models/admin/projectapirequest.model';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-api-playground',
  imports: [MaterialModule,CmToggleComponent, CommonModule, ReactiveFormsModule, CmInputComponent, CmRadioComponent, CmTextareaComponent,CmTextareaComponent,CmSelect2Component],
  templateUrl: './api-playground.component.html',
  styleUrl: './api-playground.component.css',
  standalone: true
})
export class ApiPlaygroundComponent implements OnInit {
    state:any;
    isEditMode = false;
    router = inject(Router);
   loaderService = inject(LoaderService);
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
    data : ['None', 'BearerToken', 'Basic','Custom']
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
      isActive:  [true, Validators.required],
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
    
debugger;
console.log(this.authRequiredFlag)
    this.getProjList();
    this.GetProjectType();
    this.getType();
    this.getInputType();
    this.getUserDefinedType();
    this.GetSystemAutoValue();
    this.GetDateTypes();
    this.GetGuidType();
    // ================ Edit mode logic============
    debugger;
    this.state = history.state;
    const state = this.state;
    if (state?.mode === 'edit' && state?.record) {
      const Id = state.record.id;
      this.isEditMode = true; 
      console.log('Edit mode detected, record:', state.record);
      // Patch all fields except queryStrings
      this.form.patchValue({
        selectedProject: state.record.projectId,
        selectedProjType: state.record.type,
        method: state.record.httpMethod,
        apiName: state.record.apiName,
        apiUrl: state.record.baseURL,
        apiseq: state.record.apiSeq,
        isActive: state.record.isActive,
        isrequireauth: state.record.authReq,
        selectedapi: state.record.authAPIId,
        bodyType: state.record.bodyType,
        authType: state.record.authenticatioType,
      });
      // Wait for all dropdown options to be loaded before populating queryStrings
      const waitForOptions = () => {
        if (this.isTypeOptionsLoaded && this.isInputTypeOptionsLoaded && this.qsType.options.length && this.qsInputType.options.length) {
          // Clear existing queryStrings
          this.queryStringsFormArray.clear();
          // Fetch and bind queryStrings from API
          this.service.GetAllProjectAPIRequestbyAPIID(Id).pipe(withLoader(this.loaderService)).subscribe({
            next: (res: any) => {
              if (res?.result?.items && Array.isArray(res.result.items)) {
                res.result.items.forEach((item: any, idx: number) => {
                  debugger;
                  // Find matching option objects for dropdowns
                  const qsTypeOption = this.qsType.options.find((opt: any) => String(opt.value) === String(item.type)) || { name: 'URL', value: item.type };
                  const qsInputTypeOption = this.qsInputType.options.find((opt: any) => String(opt.value) === String(item.inputType)) || { name: '', value: item.inputType };
                  // For qsValue, if options exist, try to match, else use raw value
                  let qsValueOption = item.inputValue;
                  if (this.qsValue.options && Array.isArray(this.qsValue.options) && item.inputValue != null) {
                    qsValueOption = this.qsValue.options.find((opt: any) => String(opt.value) === String(item.inputValue)) || item.inputValue;
                  }
                  const qsSelectedTypeOption = this.qsSelectedType.options.find((opt: any) => String(opt.value) === String(item.inputSource)) || { name: '', value: item.inputSource };
                  //  const qsSelectedTypeOption = '';
                  this.createQueryStrings({
                    qsId: item.id,
                    qsNo: idx + 1,
                    qsKey: item.key,
                    qsValue: qsValueOption,
                    qsType: qsTypeOption,
                    qsInputType: qsInputTypeOption,
                    // qsInputType: [{ value: 3, disabled: this.isEditMode }],
                    qsSelectedType: qsSelectedTypeOption
                  });
                  
                });
              }
            },
            error: (err) => {
              console.error('Error fetching API request params:', err);
            }
          });
          console.log('Edit form data patched and queryStrings loaded:', state.record);
        } else {
          setTimeout(waitForOptions, 100);
        }
      };
      waitForOptions();

      

    }
  // ================= Edit mode logic======
else{


  //validation to check api name exists 

  this.form.get('apiName')?.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe((apiName: string) => {
      debugger;
      if (apiName && apiName.trim().length > 0) {
       const APIId = this.state?.record?.id ?? 0;
        this.service.CheckProjectAPINameExist(apiName, APIId).pipe(withLoader(this.loaderService)).subscribe({
          next: (res: any) => {
            if (res.result===true) { // Adjust according to your API response
              this.toast.error('API name already exists. Please choose another name.');
              this.form.get('apiName')?.setValue('');
            }
          },
          error: (err) => {
            console.error('Error checking API name:', err);
          }
        });
      }
    });
//validation to check api name exists 


    debugger;
    // console.log(this.authRequiredFlag)
    // this.getProjList();
    // this.GetProjectType();
    // this.getType();
    // this.getInputType();
    // this.getUserDefinedType();
    // this.GetSystemAutoValue();
    // this.GetDateTypes();
    // this.GetGuidType();

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
    this.service.Apiseq(value.value).pipe(withLoader(this.loaderService)).subscribe({
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


  }}
// ngoninit end




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
  addSelectedKeysToForm() {
  let index = this.queryStringsFormArray.length + 1; 
  
  this.selectedKeys.forEach((key) => {
    // Check if it's already added (avoid duplicates)
    const alreadyExists = this.queryStringsFormArray.controls.some(
      (control: any) => control.get('qsKey')?.value === key
    );

    if (!alreadyExists) {
      this.createQueryStrings({
        qsNo: index++,
        qsKey: key,
        qsValue: '',
        qsType: { name: 'AuthenticationInput', value: '3' },   
        qsInputType: { name: 'Static', value: '3' },
        qsSelectedType: ''
      });
    }
  });
}
removeKeyFromForm(key: string) {
  const index = this.queryStringsFormArray.controls.findIndex(
    (control: any) => control.get('qsKey')?.value === key
  );

  if (index !== -1) {
    this.queryStringsFormArray.removeAt(index);

  
  this.queryStringsFormArray.controls.forEach((control: any, idx: number) => {
  control.get('qsNo')?.setValue(idx + 1);
});
  }
}


onCheckboxChange(event: Event, key: string): void {
  const checked = (event.target as HTMLInputElement).checked;

  if (checked) {
    this.selectedKeys.add(key);
    console.log(this.selectedKeys)
    this.addSelectedKeysToForm();
    this.updateRequestParam(); 
  } else {
    this.selectedKeys.delete(key);
    console.log(this.selectedKeys)
    this.removeKeyFromForm(key);
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

  this.service.UpdateProjectApi(updatedRecord).pipe(withLoader(this.loaderService)).subscribe({
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
    qsId: [{ value: prefillData?.qsId || 0, disabled: true }],
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
debugger;
   // Auto-disable in edit mode
  if (this.isEditMode) {
    const inputTypeValue = prefillData.qsInputType?.value ?? prefillData.qsInputType; // works for both object and number
    if (inputTypeValue == 3) {
      group.get('qsInputType')?.disable();
      group.get('qsSelectedType')?.disable();
    }
    else
    {
       group.get('qsInputType')?.disable();
      group.get('qsSelectedType')?.disable();
      group.get('qsValue')?.disable();
    }
  }

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
      bodyValue: ['',this.jsonValidator()],
    });
    this.bodyFormArray.push(group);
  }
  jsonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const bodyType = this.form?.get('bodyType')?.value;
   

    if (bodyType === 'json') {
      try {
        JSON.parse(control.value);
        return null; 
      } catch (e) {
        return { invalidJson: true };
        
      }
    }

    return null; 
  };
}

  getProjList() {
  this.service.GetProjectList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
  this.service.GetType().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
  this.service.GetInputType().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
  this.service.GetUserDefinedValue().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
  this.service.GetSystemAutoValue().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
  this.service.GetDateTypes().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
  this.service.GetGuidType().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
  this.service.GetApiList(selectedProjectId).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
  this.service.GetProjectType().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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

   console.log(this.form.controls['apiseq'].value )
  //  const isAuthRequired = this.form.get('isrequireauth')?.value;
  //  const selectedProjType = this.form.get('selectedProjType')?.value.value;
  // console.log(selectedProjType)
  //   if (selectedProjType === '4') {
  //   this.toast.error('Please select authorization type in Auth Tab');
  //   return;
  // }

  
  // if (isAuthRequired && this.selectedKeys.size === 0) {
  //   this.toast.error('At least one key must be selected for request parameter.');
  //   return; 
  // }
  
  if (this.form.invalid) {

    this.toast.error('Please select all the values before Sending.');
    this.form.markAllAsTouched();
    return;
  }

  else{

       const isAuthRequired = this.form.get('isrequireauth')?.value;
   const selectedProjType = this.form.get('selectedProjType')?.value.value;
const authType =this.form.get('authType')?.value;
if (selectedProjType === '4' && !authType) {
  this.toast.error('Please select authorization type in Auth Tab');
  return;
}
  
   
else{

    if (isAuthRequired && this.selectedKeys.size === 0) {
    this.toast.error('At least one key must be selected for request parameter.');
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
    IsActive: formValues.IsActive,
    ProjectName: "",
    IsDeleted: false,
    DeleterUserId: "",
    DeletionTime: creationTime,
    LastModificationTime: creationTime,
    LastModifierUserId: "",
    CreationTime: creationTime,
    CreatorUserId: ""
  };

  this.service.Consume(payload).pipe(withLoader(this.loaderService)).subscribe({
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

async saveRequestsSequentially(requestModels2: any[]) {
  for (const model of requestModels2) {
    try {
      const res = await firstValueFrom(
        this.service.CreateProjectApiRequest(model)
          .pipe(withLoader(this.loaderService))
      );

      this.toast.success('ProjectAPIRequest saved successfully.');
    } catch (err) {
      console.error('Error creating API:', err);
      break; 
    }
  }

 
  this.router.navigate(['/admin/apilist']);
}



RemoveHeader(index:any){
    const itemsArray = this.form.get('headers') as FormArray;
    itemsArray.removeAt(index);
  }
submit(): void {
  
  console.log(this.form.controls['isActive'].value )



  //logic to update only proejct API request data on edit mode
debugger;
this.state = history.state;
const state = this.state;
if (state?.mode === 'edit' && state?.record) {
const Id = state.record.id;
const creationTimeAPIReq = new Date();


  // Only keep records where qsInputType.value === 3
  const requestModels: projapirequestmodel[] = this.queryStringsFormArray.controls
    .filter((group: FormGroup) => 
      Number(group.get('qsInputType')?.value?.value ?? 0) === 3
    )
    .map((group: FormGroup, index: number) => ({
    apiId: Id,
    type: group.get('qsType')?.value?.value ?? "0",
    key: group.get('qsKey')?.value ?? '',
    inputType: group.get('qsInputType')?.value?.value ?? "0",
   inputSource:
  (group.get('qsInputType')?.value?.value ?? "0") === "2"
  ? group.get('qsSelectedType')?.value?.value ?? ""
: group.get('qsSelectedType')?.value?.value ?? "",
    inputValue:
      (group.get('qsInputType')?.value?.value ?? "0") === "3"
        ? group.get('qsValue')?.value
        : group.get('qsValue')?.value?.value,
    seq: (group.get('qsNo')?.value ?? 1) - 1,
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: creationTimeAPIReq,
    lastModificationTime: creationTimeAPIReq,
    lastModifierUserId: 0,
    creationTime: creationTimeAPIReq,
    creatorUserId: 0,
    id:group.get('qsId')?.value ?? 0
    }));
const maxSeq = requestModels.reduce((max, item) => item.seq > max ? item.seq : max, 0);


const methodKeyModel: projapirequestmodel = 
    {
    apiId: Id,
    type: 7,
    key: this.form.controls['method'].value.value,
    inputType: null,
    inputSource: null,
    inputValue: null,
    seq: maxSeq+1,
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: creationTimeAPIReq,
    lastModificationTime: creationTimeAPIReq,
    lastModifierUserId: 0,
    creationTime: creationTimeAPIReq,
    creatorUserId: 0,
    id: 0
    };

requestModels.push(methodKeyModel);  

console.log(requestModels);
requestModels.forEach(model => {
  this.service.UpdateProjectApiRequest(model).pipe(withLoader(this.loaderService)).subscribe({
   next: (res) => {
   this.toast.success('ProjectAPIRequest updated successfully.');
    this.router.navigate(['/admin/apilist']);  
      
   },
    error: (err) => {
      console.error('Error updating API:', err);
    }
  });
})

    }
     //logic to update only proejct API request data on edit mode
    else
    {

    
 





  if (this.form.invalid) {
    this.toast.error('Please select all the values before Submit.');
    this.form.markAllAsTouched(); 
    return;
  }
else{
  console.log(this.form.controls['apiseq'].value )
 const apiseq=this.form.controls['apiseq'].value
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
    authAPIId: this.form.controls['selectedapi'].value?.value, 
    authenticatioType: formValues.authType,
    apiSeq:  apiseq,
    authenticationHeader:null,
    commType: 0,
    bodyType: formValues.bodyType,
    body:bodyArray?.[0]?.bodyValue || null,
    responseStatusCode: 200,  
    response: this.responseText,            
    isActive: formValues.isActive,            
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

  this.service.CreateProjectApi(model).pipe(withLoader(this.loaderService)).subscribe({
    next: (res:any) => {
      this.createdId = res.result.id;
      this.toast.success('ProjectAPI saved successfully with ID:',this.createdId);
      console.log('API created successfully:', res);
      console.log(this.createdId);


const requestModels5: projapirequestmodel[] = [];
const requestModels: projapirequestmodel[] = [];
const finalselect: projapirequestmodel[] = [];





if(formValues.isrequireauth)
  {const selectedKeysArray = Array.from(this.selectedKeys);

let seqCounter = 0;
const selectedKeyModels: projapirequestmodel[] = this.queryStringsFormArray.controls
  .filter((group: FormGroup) => 
    group.get('qsType')?.value?.value === '3' && 
    selectedKeysArray.includes(group.get('qsKey')?.value)
  )
  .map((group: FormGroup, index: number) => ({
    apiId: this.createdId,
    type: group.get('qsType')?.value?.value ?? "0",
    key: group.get('qsKey')?.value ?? "",
    inputType: group.get('qsInputType')?.value?.value ?? "0",
    inputSource: group.get('qsSelectedType')?.value?.value ?? "",
    inputValue: group.get('qsValue')?.value?.value ?? "",
    seq: seqCounter++, 
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: creationTime,
    lastModificationTime: creationTime,
    lastModifierUserId: 0,
    creationTime: creationTime,
    creatorUserId: 0,
    id: 0
  }));

  console.log("selectedKeyModels:",selectedKeyModels)
      finalselect.push(...selectedKeyModels);

const requestModel1: projapirequestmodel[] = this.queryStringsFormArray.controls
  .filter((group: FormGroup) =>
    !(group.get('qsType')?.value?.value === '3' && selectedKeysArray.includes(group.get('qsKey')?.value))
  )
  .map((group: FormGroup, index: number) => ({
    apiId: this.createdId,
    type: group.get('qsType')?.value?.value ?? "0",
    key: group.get('qsKey')?.value ?? "",
    inputType: group.get('qsInputType')?.value?.value ?? "0",
    inputSource: group.get('qsSelectedType')?.value?.value ?? "",
    inputValue: group.get('qsValue')?.value?.value ?? "",
    seq: group.get('qsNo')?.value -1,
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: creationTime,
    lastModificationTime: creationTime,
    lastModifierUserId: 0,
    creationTime: creationTime,
    creatorUserId: 0,
    id: 0
  }));

    console.log("requestModels:",requestModel1)
     requestModels5.push(...requestModel1);
  }






if(this.form.controls['isrequireauth'].value==false){
  const requestModel2: projapirequestmodel[] = this.queryStringsFormArray.controls.map((group: FormGroup, index: number) => {
  return {
    apiId: this.createdId,
    type: group.get('qsType')?.value?.value ?? "0",
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
  console.log("requestModels:",requestModel2)
     requestModels5.push(...requestModel2);


}



const maxSeq = requestModels5.reduce((max, item) => item.seq > max ? item.seq : max, 0);
const authType = this.form.controls['authType'].value;



const methodKeyModel: projapirequestmodel = {
  apiId: this.createdId,
  type: 7,
  key: this.form.controls['method'].value.value,
  inputType: null,
  inputSource: null,
  inputValue: null,
  seq: (authType !== null && authType !== '' && authType.trim() !== '')
  ? maxSeq + 2
  : maxSeq + 1,
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
requestModels.push(...requestModels5);


if (authType !== null && authType !== '')
{
  const AuthKeyModel: projapirequestmodel = {
  apiId: this.createdId,
  type: 4,
  key: this.form.controls['authType'].value,
  inputType: 3,
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
requestModels.push(AuthKeyModel);  
}


if (bodyValue && bodyValue.trim() !== '' && bodyValue.trim() !== '{}') {
const bodyValue = this.form.get('body')?.value?.[0]?.bodyValue;
const bodyObj = JSON.parse(bodyValue);

const bodyRequestModels: projapirequestmodel[] = Object.entries(bodyObj).map(
  ([k, v], index) => {
    return {
     apiId: this.createdId,
  type: 2,
  key:k,
  inputType: 3,
  inputSource: null,
  inputValue: v,
  seq: index,
  isDeleted: false,
  deleterUserId: 0,
  deletionTime: creationTime,
  lastModificationTime: creationTime,
  lastModifierUserId: 0,
  creationTime: creationTime,
  creatorUserId: 0,
  id: 0
    };
  }
);

requestModels.push(...bodyRequestModels);
}


requestModels.push(...finalselect);

console.log("requestModels:",requestModels)




 

// console.log("requestModels2:",requestModels2);
// requestModels2.forEach(model => {
//   this.service.CreateProjectApiRequest(model).pipe(withLoader(this.loaderService)).subscribe({
//    next: (res) => {
//    this.toast.success('ProjectAPIRequest saved successfully.');
//     this.router.navigate(['/admin/apilist']);  
      
//    },
//     error: (err) => {
//       console.error('Error creating API:', err);
//     }
//   });
// })



this.saveRequestsSequentially(requestModels);










    },

    error: (err) => {
      console.error('Error creating API:', err);
    }
  });
 }
}
}
  close() {
      this.router.navigate(['/admin/apilist']);   
  }


}
