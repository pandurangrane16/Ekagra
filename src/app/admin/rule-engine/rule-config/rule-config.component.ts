import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidatorFn, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { CmCronComponent } from '../../../common/cm-cron/cm-cron.component';
import { CmCheckboxGroupComponent } from '../../../common/cm-checkbox-group/cm-checkbox-group.component';
import { CmSelectCheckComponent } from "../../../common/cm-select-check/cm-select-check.component";


@Component({
  selector: 'app-rule-config',
  imports: [MaterialModule, MatIconModule, MatButtonModule, MatTooltipModule, CommonModule, ReactiveFormsModule, CmInputComponent, CmSelect2Component,
    CmToggleComponent, CmButtonComponent, CmCronComponent],
  templateUrl: './rule-config.component.html',
  styleUrl: './rule-config.component.css',
})
export class RuleConfigComponent implements OnInit {
  state: any;
  router = inject(Router);
  loaderService = inject(LoaderService)
  private _formBuilder = inject(FormBuilder);
  signalRService = inject(SignalRService);
  ruleService = inject(RuleEngineService);
  isProjectOptionsLoaded: any;
  userOptionsLoaded: boolean = false;
  selectedProjectName: any;
  selectedProjectId: any;
  AndFlag: any;
 parentCron: string = '';
  expOption: boolean = false;
 typeOperatorMap: Record<string, { name: string; value: string }[]> = {
  string: [
    { name: 'equal', value: '$eq' },
    { name: 'not_equal', value: '$ne' },
    { name: 'begins_with', value: '$regex' },
    { name: 'not_begins_with', value: '$not' },
    { name: 'contains', value: '$regex' },
    { name: 'not_contains', value: '$not' },
    { name: 'ends_with', value: '$regex' },
    { name: 'not_ends_with', value: '$not' },
    { name: 'is_empty', value: '$eq' },
    { name: 'is_not_empty', value: '$ne' },
    { name: 'is_null', value: '$eq' },
    { name: 'is_not_null', value: '$ne' }
  ],
  integer: [
    { name: 'equal', value: '$eq' },
    { name: 'not_equal', value: '$ne' },
    { name: 'less', value: '$lt' },
    { name: 'less_or_equal', value: '$lte' },
    { name: 'greater', value: '$gt' },
    { name: 'greater_or_equal', value: '$gte' },
    { name: 'between', value: '$between' },
    { name: 'not_between', value: '$notBetween' }
  ],
  double: [
    { name: 'equal', value: '$eq' },
    { name: 'not_equal', value: '$ne' },
    { name: 'less', value: '$lt' },
    { name: 'less_or_equal', value: '$lte' },
    { name: 'greater', value: '$gt' },
    { name: 'greater_or_equal', value: '$gte' },
    { name: 'between', value: '$between' },
    { name: 'not_between', value: '$notBetween' }
  ],
  boolean: [
    { name: 'equal', value: '$eq' }
  ],
  array: [
    { name: 'contains', value: '$in' },
    { name: 'not_contains', value: '$nin' }
  ],
  default: [
    { name: 'equal', value: '$eq' },
    { name: 'not_equal', value: '$ne' },
    { name: 'begins_with', value: '$regex' },
    { name: 'not_begins_with', value: '$not' },
    { name: 'contains', value: '$regex' },
    { name: 'not_contains', value: '$not' },
    { name: 'ends_with', value: '$regex' },
    { name: 'not_ends_with', value: '$not' },
    { name: 'is_empty', value: '$eq' },
    { name: 'is_not_empty', value: '$ne' },
    { name: 'is_null', value: '$eq' },
    { name: 'is_not_null', value: '$ne' }
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
      labelHeader: 'Policy Name',
     
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
  apiSettingsArr: any[] = [];
  fieldSettings = {
    labelHeader: 'Field Name',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [

    ],
  };
  apiSettings = {
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
      { name: 'Every Minute', value: '*' },
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
      { name: 'Every Hour', value: '*' },
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
      { name: 'Every Day', value: '*' },
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
      { name: 'Every Month', value: '*' },
      { name: 'January', value: '1' },
      { name: 'February', value: '2' },
      { name: 'March', value: '3' },
      { name: 'April', value: '4' },
      { name: 'May', value: '5' },
      { name: 'June', value: '6' },
      { name: 'July', value: '7' },
      { name: 'August', value: '8' },
      { name: 'September', value: '9' },
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
      { name: 'Every Day Of Week', value: '*' },
      { name: 'Monday', value: '0' },
      { name: 'Tuesdat', value: '1' },
      { name: 'Wednesday', value: '2' },
      { name: 'Thursday', value: '3' },
      { name: 'Friday', value: '4' },
      { name: 'Saturday', value: '5' },
      { name: 'Sunday', value: '6' },
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
    this.state = history.state;
    this.thirdFormGroup = this._formBuilder.group({
      minute: [''],
      hour: [''],
      dayOfMonth: [''],
      month: [''],
      dayOfWeek: [''],
    });
    this.secondFormGroup = this._formBuilder.group({
      selectedProject: [null, Validators.required],
      groups: this._formBuilder.array([], [this.minFormArrayLength(1)]),
    });
    this.firstFormGroup = this._formBuilder.group({
  policyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
  ticketabb: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      tat: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      selectedCategory: ['', Validators.required],
      selectedUserGroup: ['', Validators.required],
      intervalTime: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      isActive: [true, Validators.required],
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


    this.firstFormGroup.controls['policyName'].valueChanges.subscribe((value: string) => {
      this.onPolicyNameChange(value);
    });
    // this.firstFormGroup.controls['policyName'].valueChanges.subscribe((value: string) => {
    //   this.onPolicyNameChange(value);
    // });

     // ---- Policy Name ----
        this.firstFormGroup.get('policyName')?.valueChanges.subscribe((val: string) => {
          if (val !== null && val !== undefined) {
            const trimmed = val.trim();
            if (trimmed !== val) {
              this.firstFormGroup.get('policyName')?.setValue(trimmed, { emitEvent: false });
            }

            // disallow anything except letters, numbers, space, underscore, hyphen
            const valid = /^[A-Za-z0-9 _-]*$/.test(trimmed);
            if (!valid) {
              this.firstFormGroup.get('policyName')?.setErrors({ invalidChars: true });
            } else {
              const ctrl = this.firstFormGroup.get('policyName');
              if (ctrl?.hasError('invalidChars')) {
                const e = { ...ctrl.errors };
                delete e['invalidChars'];
                ctrl.setErrors(Object.keys(e).length ? e : null);
              }
            }

            this.onPolicyNameChange(trimmed);
          }
        });

     // ---- Ticket Abbreviation ----
        this.firstFormGroup.get('ticketabb')?.valueChanges.subscribe((val: string) => {
          if (val !== null && val !== undefined) {
            const trimmed = val.trim();
            if (trimmed !== val) {
              this.firstFormGroup.get('ticketabb')?.setValue(trimmed, { emitEvent: false });
            }

            // disallow anything except letters, numbers, underscore, hyphen
            const valid = /^[A-Za-z0-9_-]*$/.test(trimmed);
            if (!valid) {
              this.firstFormGroup.get('ticketabb')?.setErrors({ invalidChars: true });
            } else {
              const ctrl = this.firstFormGroup.get('ticketabb');
              if (ctrl?.hasError('invalidChars')) {
                const e = { ...ctrl.errors };
                delete e['invalidChars'];
                ctrl.setErrors(Object.keys(e).length ? e : null);
              }
            }
          }
        });

      // ✅ TAT (trim + remove all spaces)
  this.firstFormGroup.get('tat')?.valueChanges.subscribe((val: string) => {
    if (val !== null && val !== undefined) {
      const sanitized = val.replace(/\s+/g, '');
      if (sanitized !== val) {
        this.firstFormGroup.get('tat')?.setValue(sanitized, { emitEvent: false });
      }
    }
  });

  // ✅ Interval Time (trim + remove all spaces)
  this.firstFormGroup.get('intervalTime')?.valueChanges.subscribe((val: string) => {
    if (val !== null && val !== undefined) {
      const sanitized = val.replace(/\s+/g, '');
      if (sanitized !== val) {
        this.firstFormGroup.get('intervalTime')?.setValue(sanitized, { emitEvent: false });
      }
    }
  });
  }
  get f() {
    return this.firstFormGroup.controls;
  }


  onCronUpdate(event: string | null) {
    console.log("event:",event)
  if (event === null) {
    this.parentCron = '❌ Invalid cron format';
  } else {
    this.parentCron = event;
  }
}

  minFormArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl) => {
      if (control instanceof FormArray) {
        return control.length >= min
          ? null
          : { minLengthArray: { requiredLength: min, actualLength: control.length } };
      }
      return null;
    };
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.firstFormGroup, _controlName, _controlLable, _isPattern, _msg);
  }

      close() {
    this.router.navigate(['/admin/ruleenginelist']);
  }

  onApiChange(selectedapi: any, parentIndex: number, rowIndex: number) {



    this.fieldOption = false;
    const value = selectedapi?.value;
    this.ruleService.Getfields(value).pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      const items = response?.result || [];
      if (items.length === 0) {

        this.toast.error('No mapped API fields found, please select some other API.');
        const rowGroup = (this.getExpressionGroup(parentIndex).at(rowIndex) as FormGroup);
        rowGroup.get('fieldOption')?.setValue(false);

        // // Reset the specific row's field settings
        // const rowGroup = (this.getExpressionGroup(parentIndex).at(rowIndex) as FormGroup);
        // rowGroup.get('fieldName')?.setValue(null);
        // rowGroup.get('fieldSettings')?.setValue(null);

        return;
      }

      else {
        const projectOptions = items.map((item: any) => ({
          id: item.id,
          name: item.apiField,
          value: item.apiField,
          type: item.fieldType,

        }));


        // Get the specific row's FormGroup
        const rowGroup = (this.getExpressionGroup(parentIndex).at(rowIndex) as FormGroup);


        // Reset the expression value
        rowGroup.get('fieldName')?.setValue(null);


        // Set options only for this row
        rowGroup.get('fieldSettings')?.setValue({
          options: projectOptions,
          singleSelection: true,
          idField: 'id',
          textField: 'text',
          allowSearchFilter: true,
          labelHeader: 'Field Name*',
          lableClass: 'form-label',
          formFieldClass: '',
          appearance: 'outline',

        });

        setTimeout(() => {

          rowGroup.get('fieldOption')?.setValue(true);

        });
      }

    }, error => {
      console.error('Error fetching fields', error);
    });



  }
  onFieldChange(selectedField: any, parentIndex: number, rowIndex: number) {
    this.expOption = false;
    const fieldType = selectedField?.type;

    if (fieldType) {
      const operators = this.typeOperatorMap[fieldType] || [];

      // Get the specific row's FormGroup
      const rowGroup = (this.getExpressionGroup(parentIndex).at(rowIndex) as FormGroup);


      // Reset the expression value
      rowGroup.get('expression')?.setValue(null);

 
  // Set options only for this row
    rowGroup.get('expressionSettings')?.setValue({
      options: operators,
      singleSelection: true,
          idField: 'id',
          textField: 'text',
          allowSearchFilter: true,
          labelHeader: 'Expression*',
          lableClass: 'form-label',
          formFieldClass: '',
          appearance: 'outline',

      });
      setTimeout(() => {
        rowGroup.get('expOption')?.setValue(true);
      });
    }
  }


  // buildProjectExpressions(formValue: any) {
  //   return formValue.groups.map((group: any) => {
  //     const conditionOp = "$" + (group.condition?.value?.toLowerCase() || "and");

  //     const expressions = group.arrayGroup.map((item: any) => {
  //       const field = item.fieldName?.value;
  //       const operator =
  //         typeof item.expression === "object"
  //           ? item.expression.value
  //           : item.expression;
  //       const value = item.fieldValue;

  //       return {
  //         [field]: {
  //           [operator]: isNaN(value) ? value : Number(value)
  //         }
  //       };
  //     });

  //     const ruleObj = { [conditionOp]: expressions };

  //     return {
  //       ProjectId: group.projId,
  //       ProjectName: group.projName,
  //       Rule: JSON.stringify(ruleObj)
  //     };
  //   });
  // }

//   buildProjectExpressions(formValue: any) {
//   return formValue.groups.map((group: any) => {
//     const conditionOp = "$" + (group.condition?.value?.toLowerCase());

//     // Build expressions per field (with APIID)
//     const expressionsWithApi = group.arrayGroup.map((item: any) => {
//       const field = item.fieldName?.value;
//       const operator =
//         typeof item.expression === "object"
//           ? item.expression.value
//           : item.expression;
//       const value = item.fieldValue;

//       const expressionObj = {
//         [conditionOp]: [
//           {
//             [field]: {
//               [operator]: isNaN(value) ? value : Number(value)
//             }
//           }
//         ]
//       };

//       return {
//         APIID: item.apiName.value,  
//         Expression: expressionObj
//       };
//     });

//     return {
//       ProjectId: group.projId,
//       ProjectName: group.projName,
//       Rule: expressionsWithApi
//     };
//   });
// }

buildProjectExpressions(formValue: any) {
  return formValue.groups.map((group: any, index: number) => {
    const conditionOp = "$" + (group.condition?.value?.toLowerCase());   // Rule-level
    // const conditionOp2 = "$" + (group.condition2?.value?.toLowerCase());
    
        const conditionOp2 = index === 0 
      ? "$and" 
      : "$" + (group.condition2?.value?.toLowerCase());

    // Build expressions per field (with APIID)
    const expressionsWithApi = group.arrayGroup.map((item: any) => {
      const field = item.fieldName?.value;
      const operator =
        typeof item.expression === "object"
          ? item.expression.value
          : item.expression;
      const value = item.fieldValue;

      return {
        APIID: item.apiName.value,
        DataSource: item.apiName.dataSource, 
        Expression: {
          [field]: {
            [operator]: isNaN(value) ? value : Number(value),
          },
        },
      };
    });

    // Wrap Rule with condition (condition = and/or)
    const ruleBlock = {
      [conditionOp]: expressionsWithApi,
    };

    // Project block with Rule
    const projectBlock = {
      ProjectId: group.projId,
      ProjectName: group.projName,
      Rule: [ruleBlock],
    };

    // Wrap project with condition2 (condition2 = and/or)
    return {
      [conditionOp2]: [projectBlock],
    };
  });
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
  createCronExpression(): string {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = this.thirdFormGroup.value;

    // Join them with spaces to form the cron
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }

  Submit() {
    const firstFormValues = this.firstFormGroup.value;
    const secondFormValues = this.secondFormGroup.value;
    const thirdFormValues = this.thirdFormGroup.value;
    console.log(thirdFormValues)
    if (this.thirdFormGroup.invalid) {
      this.toast.error('Please select all the values before Submitting.');
      this.thirdFormGroup.markAllAsTouched();
      return;
    }
    // Check if policy name exists before saving
    this.ruleService.CheckPolicyNameExist(firstFormValues.policyName, this.state?.record?.id)
      .pipe(withLoader(this.loaderService))
      .subscribe((response: any) => {
        if (response.result === true) {
          this.toast.error('Policy name is already exists.');
          this.firstFormGroup.setErrors({ duplicateName: true });
          return;
        } else {



  if (!this.parentCron || this.parentCron === '❌ Invalid cron format') {
  this.toast.error('Invalid Cron');
  this.firstFormGroup.setErrors({ cronEmpty: true });
  return;
}

else{
  
          const formValue = this.secondFormGroup.value;
          const creationTime = new Date();
          const result = this.buildProjectExpressions(formValue)
          const cron = this.createCronExpression();
          console.log('result', JSON.stringify(result));
          console.log('Generated Cron:', cron);
          console.log(JSON.stringify(result))
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
            ruleExpression: JSON.stringify(result),
            cron: this.parentCron,
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
          this.ruleService.CreateRuleEngine(policyData)
            .pipe(withLoader(this.loaderService))
            .subscribe({
              next: (res: any) => {
                console.log(res);
                this.toast.success('Rule Engine saved successfully.');
                this.router.navigate(['/admin/ruleenginelist']);
              },
              error: (err) => {
                console.error('Error creating rule engine:', err);
                this.toast.error('Failed to save Rule Engine. Please try again.');
              }
            });
}


        }
      });
  }

  fieldOption: any;
  apiOption: any;

  onProjectChange(selectedProject: any, groupIndex: number) {
    //this.getfields(selectedProject, groupIndex);
    this.getApi(selectedProject, groupIndex);

  }
  getApi(selectedProject: any, groupIndex: number) {
    this.apiOption = false;
    this.ruleService.GetApis(selectedProject)
      .pipe(withLoader(this.loaderService))
      .subscribe((response: any) => {
        const items = response?.result || [];

        const projectOptions = items.map((item: any) => ({
          name: item.apiName,
          value: item.id,
          projectid: item.projectId,
          dataSource:item.dataSource
        }));
        const settings = {
          singleSelection: true,
          idField: 'id',
          textField: 'text',
          allowSearchFilter: true,
          labelHeader: 'API Name*',
          lableClass: 'form-label',
          formFieldClass: '',
          appearance: 'outline',
          options: projectOptions
        };

        // set fieldSettings for ALL expressions in that group
        const exprArray = this.getExpressionGroup(groupIndex);
        exprArray.controls[exprArray.controls.length - 1].patchValue({ apiSettings: settings })

        this.apiOption = true;
      });
  }

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
          labelHeader: 'Field Name*',
          lableClass: 'form-label',
          formFieldClass: '',
          appearance: 'outline',
          options: projectOptions
        };

        // set fieldSettings for ALL expressions in that group
        const exprArray = this.getExpressionGroup(groupIndex);
        exprArray.controls[exprArray.controls.length - 1].patchValue({
          fieldSettings: settings,
          fieldOption: true
        })

        //this.fieldOption = true;
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

    console.log("2", this.secondFormGroup.value)
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
    //this.getfields(this.selectedProjectId, idx);
    this.getApi(this.selectedProjectId, idx);
  }

  createGroup(selectedProject: any) {
    let len = this.secondFormGroup.controls['groups'].length;
    const group = this._formBuilder.group({
      seqNo: [{ value: (len == undefined ? 1 : len + 1), disabled: true }],
      projId: [selectedProject.value, Validators.required],
      projName: [selectedProject.name],
      selectedMainExpression: [''],
      condition: [{ value: '' }],
      condition2: [{ value: '' }],

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
    console.log("remove", this.groupsFormArray)

  }

  removeArray(i: number, j: number) {
    const arrayGroup = this.groupsFormArray.at(i).get('arrayGroup') as FormArray;
    arrayGroup.removeAt(j);
  }
  createFormArrayGroup() {
    return this._formBuilder.group({
      fieldName: ['', Validators.required],
      apiName: ['', Validators.required],
      expression: [{ value: '' }, Validators.required],
      fieldValue: ['', Validators.required],
      apiSettings: [null],
      fieldSettings: [null],
      expressionSettings: this.expressionSettings,
      fieldOption: [false],
      expOption: [false],


    });
  }

  addFormArrayGroup(len: number) {
    console.log(len);
    const formArr = this.createFormArrayGroup();
    var expressionGroup = this.getExpression(len);
    expressionGroup.push(formArr);
    let proj = this.secondFormGroup.controls.groups.controls[len].controls.projId.value;
    //this.getfields(proj, len);
    this.getApi(proj, len);
  }

  checkboxOptions = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' }
  ];

  onCheckboxChange(selected: any) {
    console.log('Selected:', selected);
  }

  setThirdFormValues(evt: any, type: string) {
    console.log(evt);
    if (type == "min") {
      this.thirdFormGroup.patchValue({
        minute : evt
      })
    }
    else if (type == "hour") {
      this.thirdFormGroup.patchValue({
        hour : evt
      })
    }
    else if (type == "daymon") {
      this.thirdFormGroup.patchValue({
        dayOfMonth : evt
      })
    }
    else if (type == "mon") {
      this.thirdFormGroup.patchValue({
        month : evt
      })
    }
    else if (type == "day") {
      this.thirdFormGroup.patchValue({
        dayOfWeek : evt
      })
    }
  }

  policyNameExists = false;

  onPolicyNameChange(value: string) {
    if (!value || this.firstFormGroup.controls['policyName'].errors?.pattern) {
      this.policyNameExists = false;
      return;
    }
    this.ruleService.CheckPolicyNameExist(value, this.state?.record?.id)
      .pipe(withLoader(this.loaderService))
      .subscribe((response: any) => {
        this.policyNameExists = response.result === true;
        if (this.policyNameExists) {
          this.firstFormGroup.controls['policyName'].setErrors({ duplicateName: true });
        } else {
          // Remove duplicateName error if exists
          if (this.firstFormGroup.controls['policyName'].hasError('duplicateName')) {
            const errors = { ...this.firstFormGroup.controls['policyName'].errors };
            delete errors['duplicateName'];
            if (Object.keys(errors).length === 0) {
              this.firstFormGroup.controls['policyName'].setErrors(null);
            } else {
              this.firstFormGroup.controls['policyName'].setErrors(errors);
            }
          }
        }
      });
  }
}
