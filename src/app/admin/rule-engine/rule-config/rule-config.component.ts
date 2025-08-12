import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { RuleEngineService } from '../../../services/admin/rule-engine.service';
import { SignalRService } from '../../../services/common/signal-r.service';
import { CmButtonComponent } from "../../../common/cm-button/cm-button.component";
import { withLoader } from '../../../services/common/common';
import { LoaderService } from '../../../services/common/loader.service';
import { ToastrService } from 'ngx-toastr';
import { getErrorMsg } from '../../../utils/utils';
import { Policy } from '../../../models/admin/ruleengine.model';
import { CmCheckboxGroupComponent } from '../../../common/cm-checkbox-group/cm-checkbox-group.component';
import { CmSelectCheckComponent } from "../../../common/cm-select-check/cm-select-check.component";

@Component({
  selector: 'app-rule-config',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmInputComponent, CmSelect2Component,
    CmToggleComponent, CmButtonComponent, CmSelectCheckComponent],
  templateUrl: './rule-config.component.html',
  styleUrl: './rule-config.component.css'
})
export class RuleConfigComponent implements OnInit {

  loaderService = inject(LoaderService)
  private _formBuilder = inject(FormBuilder);
  signalRService = inject(SignalRService);
  ruleService = inject(RuleEngineService);
  isProjectOptionsLoaded: any;
  userOptionsLoaded: boolean = false;
  selectedProjectName: any;
  selectedProjectId: any;
  AndFlag: any;
  expOption: boolean = false;
  typeOperatorMap: Record<string, string[]> = {
    string: [
      'equal', 'not_equal', 'begins_with', 'not_begins_with',
      'contains', 'not_contains', 'ends_with', 'not_ends_with', 'is_empty',
      'is_not_empty', 'is_null', 'is_not_null'
    ],
    integer: [
      'equal', 'not_equal', 'less', 'less_or_equal', 'greater',
      'greater_or_equal', 'between', 'not_between'
    ],
    double: [
      'equal', 'not_equal', 'less', 'less_or_equal', 'greater',
      'greater_or_equal', 'between', 'not_between'
    ],
    boolean: ['equal'],
    array: ['contains', 'not_contains'],
    default: [
      'equal', 'not_equal', 'begins_with', 'not_begins_with',
      'contains', 'not_contains', 'ends_with', 'not_ends_with', 'is_empty',
      'is_not_empty', 'is_null', 'is_not_null'
    ]
  };

  userGroupSettings = {
    labelHeader: 'User Group*',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: []
  };

  projectSettings = {
    labelHeader: 'Project*',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [

    ]
  };
  inputFields = {
    policyName: {
      labelHeader: 'Policy Name*',
      placeholder: 'Policy Name*',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    intervalTime: {
      placeholder: 'Interval Time',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    tat: {
      placeholder: 'TAT',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    ticketabb: {
      placeholder: 'Ticket Abbreviation',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    fieldValue: {
      placeholder: 'Value',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
  }
  isActiveToggle = {

    name: 'isActive',
    formControlName: 'isActive',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
  isinternal = {

    name: 'isinternal',
    formControlName: 'isinternal',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
  categorySelectSettings = {
    labelHeader: 'Select Category*',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Low', value: '0' },
      { name: 'Medium', value: '1' },
      { name: 'High', value: '2' }
    ],

  };

  conditionSelectSettings = {
    labelHeader: 'Condition',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'AND', value: 'AND' },
      { name: 'OR', value: 'OR' },
    ],

  };
  fieldSettingsArr: any[] = [];
  fieldSettings = {
    labelHeader: 'Field Name',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [

    ],
  };

  // expressionSettings = {
  //   labelHeader: 'Expression',
  //   lableClass: 'form-label',
  //   formFieldClass: '',
  //   appearance: 'outline',
  //   options: [
  //   ]
  // }
  expressionSettings = {
    labelHeader: 'Expression',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [] as { name: string; value: string }[]
  };

  minuteSettings = {
    labelHeader: 'Minute (Numeric)',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Every Minute', value: '-' },
      ...Array.from({ length: 60 }, (_, i) => ({
        name: i.toString().padStart(2, '0'),
        value: i.toString()
      }))
    ]
  }

  hourSettings = {
    labelHeader: 'Hour (Numeric)',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Every Hour', value: '-' },
      ...Array.from({ length: 24 }, (_, i) => ({
        name: i.toString().padStart(2, '0'),
        value: i.toString()
      }))
    ]
  }


  dayMonthSettings = {
    labelHeader: 'Day Of Month',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Every Day', value: '-' },
      ...Array.from({ length: 31 }, (_, i) => ({
        name: Number(i + 1).toString().padStart(2, '0'),
        value: Number(i + 1).toString()
      }))
    ]
  }


  monthSettings = {
    labelHeader: 'Month',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Every Month', value: '00' },
      { name: 'January', value: '01' },
      { name: 'February', value: '02' },
      { name: 'March', value: '03' },
      { name: 'April', value: '04' },
      { name: 'May', value: '05' },
      { name: 'June', value: '06' },
      { name: 'July', value: '07' },
      { name: 'August', value: '08' },
      { name: 'September', value: '09' },
      { name: 'October', value: '10' },
      { name: 'November', value: '11' },
      { name: 'December', value: '12' },
    ]
  }


  dayWeekSettings = {
    labelHeader: 'Day Of Week',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Every Day Of Week', value: '00' },
      { name: 'Monday', value: '01' },
      { name: 'Tuesdat', value: '02' },
      { name: 'Wednesday', value: '03' },
      { name: 'Thursday', value: '04' },
      { name: 'Friday', value: '05' },
      { name: 'Saturday', value: '06' },
      { name: 'Sunday', value: '07' },
    ]
  }

  checkBoxSettings: any;
  firstFormGroup: any;
  thirdFormGroup: any;

  // firstFormGroup = this._formBuilder.group({
  //   policyName: ['', Validators.required],
  //   ticketabb:  ['', Validators.required],
  //   tat:['', [Validators.required, Validators.pattern('^[0-9]*$')]],
  //   selectedCategory: ['', Validators.required],
  //   selectedUserGroup: ['', Validators.required],
  //   intervalTime: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
  //   isActive: [false, Validators.required],
  //   isinternal: [false, Validators.required]
  // });
  secondFormGroup: any;


  isLinear = false;

  //currentStep = 0;

  // steps = [
  //   { icon: '🧾', title: 'Rule Details' },
  //   { icon: '✏️', title: 'Rule Design' },
  //   { icon: '⏰', title: 'Rule Schedule' },
  //   { icon: '✅', title: 'Confirm' }
  // ];
  ruleConditions: any;
  constructor(private toast: ToastrService) {
    this.ruleConditions = this.ruleService.getRuleConditions();
    if (this.ruleConditions == null) {
      this.ruleService.setRulesStorage();
      this.ruleConditions = this.ruleService.getRuleConditions();
    }
  }
  ngOnInit(): void {
    this.thirdFormGroup = this._formBuilder.group({
      minute: ['', Validators.required],
      hour: ['', Validators.required],
      dayOfMonth: ['', Validators.required],
      month: ['', Validators.required],
      dayOfWeek: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      selectedProject: [null, Validators.required],
      groups: this._formBuilder.array([]),
    });
    this.firstFormGroup = this._formBuilder.group({
      policyName: ['', Validators.required],
      ticketabb: ['', Validators.required],
      tat: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      selectedCategory: ['', Validators.required],
      selectedUserGroup: ['', Validators.required],
      intervalTime: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      isActive: [false, Validators.required],
      isinternal: [false, Validators.required]
    });
    this.getProjList();
    this.getRoles();
    //this.getfields();
    this.checkBoxSettings = {
      labelHeader: '',
      placeholder: 'Choose',
      isDisabled: true,
      isRequired: false,
      mode: 'single',
      options: [
        { label: 'AND', value: 'and' },
        { label: 'OR', value: 'or' }
      ]
    }


    //     this.secondFormGroup.get('selectedProject')?.valueChanges.subscribe((value:any) => {
    //     this.AndFlag = false; 


    //       if (value?.value) { 
    //         this.AndFlag = true; 
    //         //this.selectedProjectName = value.name
    //         console.log(value.value);   
    //   }  
    // });


  }
  get f() {
    return this.firstFormGroup.controls;
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.firstFormGroup, _controlName, _controlLable, _isPattern, _msg);
  }

  onFieldChange(selectedField: any) {
    this.expOption = false;
    const fieldType = selectedField?.type;

    if (fieldType) {
      const operators = this.typeOperatorMap[fieldType] || [];

      this.expressionSettings.options = operators.map(op => ({
        name: op,
        value: op
      }));
      setTimeout(() => {
        this.expOption = true;
      });
    }
  }



  getProjList() {
    this.ruleService.GetProjectList().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      const items = response?.result || [];

      const projectOptions = items.map((item: any) => ({
        name: item.name || item.shortCode,
        value: item.id
      }));


      // projectOptions.unshift({
      //   name: 'All',
      //   value: null
      // });

      this.projectSettings.options = projectOptions;
      // this.form.controls['selectedProject'].setValue({
      //   name: 'All',
      //   value: null
      // });
      console.log("h3", this.projectSettings.options);

      this.isProjectOptionsLoaded = true;
    }, error => {
      console.error('Error fetching project list', error);
    });
  }

  Submit() {


    // if (this.form.invalid) {

    //   this.toast.error('Please select all the values before Sending.');
    //   this.form.markAllAsTouched();
    //   return;
    // }



    // const isAuthRequired = this.form.get('isrequireauth')?.value;
    // const selectedProjType = this.form.get('selectedProjType')?.value.value;
    // const authType =this.form.get('authType')?.value;

    const creationTime = new Date();
    const firstFormValues = this.firstFormGroup.value;
    const secondFormValues = this.secondFormGroup.value;
    const thirdFormValues = this.thirdFormGroup.value;

    // const payload = {
    //     ProjectId: this.form.controls['selectedProject'].value?.value,
    //     Type: this.form.controls['selectedProjType'].value?.value,  
    //     APIName: formValues.apiName,
    //     BaseURL: formValues.apiUrl,
    //     RequestURL: formValues.apiUrl,
    //     HttpMethod: this.form.controls['method'].value?.value,
    //     RequestParam: "",
    //     Header: "",
    //     AuthReq: formValues.isrequireauth,
    //     AuthAPIId: this.form.controls['selectedapi'].value?.value, 
    //     AuthenticatioType: formValues.authType,
    //     APISeq: formValues.apiseq,
    //     AuthenticationHeader: "",
    //     CommType:0,
    //     BodyType: formValues.bodyType,
    //     Body: bodyJsonString,
    //     ResponseStatusCode: "",
    //     Response: "",
    //     IsActive: formValues.IsActive,
    //     ProjectName: "",
    //     IsDeleted: false,
    //     DeleterUserId: "",
    //     DeletionTime: creationTime,
    //     LastModificationTime: creationTime,
    //     LastModifierUserId: "",
    //     CreationTime: creationTime,
    //     CreatorUserId: ""
    //   };


    const policyData: Policy = {
      policyName: firstFormValues.policyName,
      ticketAbbrevation: firstFormValues.ticketabb,
      tat: firstFormValues.tat,
      policyRoles: this.firstFormGroup.controls['selectedUserGroup'].value?.value,
      priority: this.firstFormGroup.controls['selectedCategory'].value?.value,
      isActive: firstFormValues.isActive,
      intervalTime: firstFormValues.intervalTime,
      isInternal: firstFormValues.isinternal,
      apiName: null,
      apiId: null,
      ruleExpression: null,
      cron: null,
      isDeleted: false,
      deleterUserId: 0,
      deletionTime: creationTime,
      lastModificationTime: creationTime,
      lastModifierUserId: 0,
      creationTime: creationTime,
      creatorUserId: 0,
      id: 0,
      description: firstFormValues.policyName,
    };

    this.ruleService.CreateRuleEngine(policyData).pipe(withLoader(this.loaderService)).subscribe({
      next: (res: any) => {
        console.log(res);
      }
    });

  }

  fieldOption: any;

  onProjectChange(selectedProject: any, groupIndex: number) {
    this.getfields(selectedProject, groupIndex);
  }

  //    getfields(selectedProject:any) {
  //     console.log(selectedProject);
  //      this.fieldOption = false;
  //   this.ruleService.Getfields(selectedProject).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
  //     const items = response?.result || [];

  //     const projectOptions = items.map((item: any) => ({
  //       name: item.apiField,
  //       value: item.id,
  //       type:item.fieldType,
  //       project : selectedProject
  //     }));


  //     // projectOptions.unshift({
  //     //   name: 'All',
  //     //   value: null
  //     // });

  //    //this.fieldSettings.options = projectOptions;
  //    this.fieldSettingsArr.push(projectOptions);
  //    console.log(this.fieldSettingsArr);
  // // this.form.controls['selectedProject'].setValue({
  // //   name: 'All',
  // //   value: null
  // // });
  // console.log( "h3",this.projectSettings.options);

  //     this.fieldOption = true;
  //   }, error => {
  //     console.error('Error fetching project list', error);
  //   });
  // }

  getfields(selectedProject: any, groupIndex: number) {
    this.fieldOption = false;
    this.ruleService.Getfields(selectedProject)
      .pipe(withLoader(this.loaderService))
      .subscribe((response: any) => {
        const items = response?.result || [];

        const projectOptions = items.map((item: any) => ({
          id: item.id,
          name: item.apiField,
          value: item.apiField,
          type: item.fieldType,
          project: selectedProject
        }));
        const settings = {
          singleSelection: true,
          idField: 'id',
          textField: 'text',
          allowSearchFilter: true,
          labelHeader: 'User Group*',
          lableClass: 'form-label',
          formFieldClass: '',
          appearance: 'outline',
          options: projectOptions
        };

        // set fieldSettings for ALL expressions in that group
        const exprArray = this.getExpressionGroup(groupIndex);
        exprArray.controls[exprArray.controls.length-1].patchValue({ fieldSettings: settings })

        this.fieldOption = true;
      });
  }


  getRoles() {
    console.log(this.userOptionsLoaded)
    this.ruleService.GetRolesOnId().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      console.log(response.result)
      const items = response?.result || [];
      console.log(items);

      const itemArray = items.items;

      let projectOptions: any;
      if (Array.isArray(itemArray)) {
        projectOptions = itemArray.map(item => ({
          name: item.displayName,
          value: item.id
        }));
      }


      this.userGroupSettings.options = projectOptions;
      console.log("h4", this.userGroupSettings.options)



      this.userOptionsLoaded = true;
    }, error => {
      console.error('Error fetching project list', error);
    });
  }
  goNext() {

    console.log('Third form group value/status:', this.secondFormGroup);

    if (this.currentStep === 0 && this.firstFormGroup.invalid) {
      this.toast.error('Please select all the values.');
      this.firstFormGroup.markAllAsTouched();

      return;
    }
    else {
      if (this.currentStep === 1 && this.secondFormGroup.invalid) {
        this.toast.error('Please select all the values.');
        this.firstFormGroup.markAllAsTouched();

        return;
      }
      else {
        if (this.currentStep < this.steps.length - 1) {
          this.currentStep++;
        }
      }




    }

  }

  goBack() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goPrevious() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  steps = ['Rule Information', 'Rule Design', 'Rule Schedule'];
  currentStep = 0;

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  CheckConnection() {
    //this.signalRService.initializeSignalRConnection();
  }
  get groupsFormArray(): FormArray<FormGroup> {
    return this.secondFormGroup.get('groups') as FormArray<FormGroup>;
  }
  onAddGroup() {
    const selectedProject = this.secondFormGroup.controls['selectedProject'].value;
    //let name  = selectedProject?.name;




    console.log("hi", selectedProject)
    if (
      !selectedProject ||
      typeof selectedProject !== 'object' ||
      !('name' in selectedProject) ||
      !('value' in selectedProject)
    ) {
      this.toast.error('Please select a project before adding');
      return;
    }
    this.selectedProjectName = selectedProject.name;
    this.selectedProjectId = selectedProject.value;

    this.createGroup(selectedProject);


    //this.secondFormGroup.get('selectedProject')?.reset();
    let idx = this.groupsFormArray.length - 1;
    this.getfields(this.selectedProjectId, idx);
  }

  createGroup(selectedProject: any) {
    let len = this.secondFormGroup.controls['groups'].length;
    const group = this._formBuilder.group({
      seqNo: [{ value: (len == undefined ? 1 : len + 1), disabled: true }],
      projId: [selectedProject.value, Validators.required],
      projName: [selectedProject.name],
      selectedMainExpression: [''],
      condition: [{ value: '' }],
      arrayGroup: this._formBuilder.array([]),
    });

    this.groupsFormArray.push(group);
    const formArr = this.createFormArrayGroup();
    console.log(formArr);
    var expressionGroup = this.getExpression(len);
    expressionGroup.push(formArr);
    console.log(this.groupsFormArray);
  }
  getExpressionGroup(index: any): FormArray<FormGroup> {
    // Index is the position in the FormArray
    let i = index;
    if (i != 1)
      return this.groupsFormArray.at(i).get('arrayGroup') as FormArray<FormGroup>;
    else {
      //const formArr = this.createFormArrayGroup();
      //var expressionGroup = this.getExpression(i);
      //expressionGroup.push(formArr);
      return this.groupsFormArray.at(i).get('arrayGroup') as FormArray<FormGroup>;
    }
  }
  getExprGroupCreate(userIndex: number) {
    const expGroup = this.groupsFormArray.at(userIndex);
    const expArrGroup = expGroup.get('arrayGroup') as FormArray;
    var _len = expArrGroup.length;
    return (expArrGroup.at(_len) as FormArray);
  }
  getExpression(idx: number): FormArray {
    return (this.groupsFormArray.at(idx).get('arrayGroup') as FormArray);
  }
  removeGroup(i: number) {
    this.groupsFormArray.removeAt(i);
  }

  removeArray(i: number, j: number) {
    const arrayGroup = this.groupsFormArray.at(i).get('arrayGroup') as FormArray;
    arrayGroup.removeAt(j);
  }
  createFormArrayGroup() {
    return this._formBuilder.group({
      fieldName: ['', Validators.required],
      expression: [{ value: '' }, Validators.required],
      fieldValue: ['', Validators.required],
      fieldSettings: [null]
    });
  }

  addFormArrayGroup(len: number) {
    console.log(len);
    const formArr = this.createFormArrayGroup();
    var expressionGroup = this.getExpression(len);
    expressionGroup.push(formArr);
    this.getfields(this.selectedProjectId, len);
  }

  checkboxOptions = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' }
  ];

  onCheckboxChange(selected: any) {
    console.log('Selected:', selected);
  }

}
