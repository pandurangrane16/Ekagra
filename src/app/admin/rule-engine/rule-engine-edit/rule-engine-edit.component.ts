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
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { CmCronComponent } from '../../../common/cm-cron/cm-cron.component';

import { CmCheckboxGroupComponent } from '../../../common/cm-checkbox-group/cm-checkbox-group.component';
import { CmSelectCheckComponent } from "../../../common/cm-select-check/cm-select-check.component";
import { CmCronExpressionComponent } from "../../../common/cm-cron-expression/cm-cron-expression.component";

@Component({
 
  imports: [MaterialModule, MatIconModule, MatButtonModule, MatTooltipModule, CommonModule, ReactiveFormsModule, CmInputComponent, CmSelect2Component,
    CmToggleComponent, CmButtonComponent, CmCronExpressionComponent],

    selector: 'app-rule-engine-edit',

  templateUrl: './rule-engine-edit.component.html',
  styleUrl: './rule-engine-edit.component.css'
})
export class RuleEngineEditComponent implements OnInit {
    firstFormGroup!: FormGroup;
    thirdFormGroup!: FormGroup;
  editCronExpression: string | null = null;
  router = inject(Router);
state: any;
  loaderService = inject(LoaderService)
  private _formBuilder = inject(FormBuilder);
  signalRService = inject(SignalRService);
  ruleService = inject(RuleEngineService);
  isProjectOptionsLoaded: any;
  userOptionsLoaded: boolean = false;
  selectedProjectName: any;
  selectedProjectId: any;
  AndFlag: any;
  id:any;
  parentCron: string = '';
  parent_true :boolean = false;
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
// firstFormGroup!: FormGroup;
// thirdFormGroup!: FormGroup;
ruleData: any;
  

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
  constructor(private toast: ToastrService,    private route: ActivatedRoute,
      private fb: FormBuilder, // 👈 add this
   ) {
    this.ruleConditions = this.ruleService.getRuleConditions();
    if (this.ruleConditions == null) {
      this.ruleService.setRulesStorage();
      this.ruleConditions = this.ruleService.getRuleConditions();
    }
    
  }

//   ngOnInit(): void {

//     this.id = this.route.snapshot.paramMap.get('id');
//     console.log('Extracted ID:', this.id);


//      this.ruleService.GetDataById(this.id).pipe(withLoader(this.loaderService)).subscribe((response: any) => {
     
//             this.ruleData = response?.result;
//             console.log('Stored Rule Data:', this.ruleData);
//             this.buildForms();

//         // ✅ Trim + Special character validation for Policy Name
//       this.firstFormGroup.get('policyName')?.valueChanges.subscribe((val: string) => {
//         if (val !== null && val !== undefined) {
//           const trimmed = val.trim();
//           if (trimmed !== val) {
//             this.firstFormGroup.get('policyName')?.setValue(trimmed, { emitEvent: false });
//           }

//           // Allow only letters, numbers, space, underscore, and hyphen
//           const valid = /^[A-Za-z0-9 _-]*$/.test(trimmed);
//           if (!valid) {
//             this.firstFormGroup.get('policyName')?.setErrors({ invalidChars: true });
//           } else {
//             const errors = this.firstFormGroup.get('policyName')?.errors;
//             if (errors && errors['invalidChars']) {
//               delete errors['invalidChars'];
//               if (Object.keys(errors).length === 0) {
//                 this.firstFormGroup.get('policyName')?.setErrors(null);
//               } else {
//                 this.firstFormGroup.get('policyName')?.setErrors(errors);
//               }
//             }
//           }

//           // Call duplicate name check if needed
//           this.onPolicyNameChange(trimmed);
//         }
//       });

//       // ✅ Trim + Special character validation for Ticket Abbreviation
//       this.firstFormGroup.get('ticketabb')?.valueChanges.subscribe((val: string) => {
//         if (val !== null && val !== undefined) {
//           const trimmed = val.trim();
//           if (trimmed !== val) {
//             this.firstFormGroup.get('ticketabb')?.setValue(trimmed, { emitEvent: false });
//           }

//           // Allow only letters, numbers, underscore, and hyphen
//           const valid = /^[A-Za-z0-9_-]*$/.test(trimmed);
//           if (!valid) {
//             this.firstFormGroup.get('ticketabb')?.setErrors({ invalidChars: true });
//           } else {
//             const errors = this.firstFormGroup.get('ticketabb')?.errors;
//             if (errors && errors['invalidChars']) {
//               delete errors['invalidChars'];
//               if (Object.keys(errors).length === 0) {
//                 this.firstFormGroup.get('ticketabb')?.setErrors(null);
//               } else {
//                 this.firstFormGroup.get('ticketabb')?.setErrors(errors);
//               }
//             }
//           }
//         }
//       });
//     },
//     (error) => {
//       console.error('Error fetching fields', error);
//       this.buildForms();
//     }
//   );

//     this.getProjList();
//    setTimeout(() => {
//   this.getRoles();
//   this.patchCronForEdit(this.ruleData.cron);
//   //this.patchCron(this.thirdFormGroup, this.ruleData.cron);
// }, 1000); 
//     //this.getfields();
//     this.checkBoxSettings = {
//       labelHeader: '',
//       placeholder: 'Choose',
//       isDisabled: true,
//       isRequired: false,
//       mode: 'single',
//       options: [
//         { label: 'AND', value: 'and' },
//         { label: 'OR', value: 'or' }
//       ]
//     }

//   // this.firstFormGroup.controls['policyName'].valueChanges.subscribe((value: string) => {
//   //     this.onPolicyNameChange(value);
//   //   });

//   }
//   get f() {
//     return this.firstFormGroup.controls;
//   }

//   patchCron(form: FormGroup, cron: string) {
//   if (!cron) return;

//   // cron string: "minute hour dayOfMonth month dayOfWeek"
//   const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(" ");

//   // mapping form controls -> option lists
//   const mapping: { [key: string]: any[] } = {
//     minute: this.minuteSettings.options,
//     hour: this.hourSettings.options,
//     dayOfMonth: this.dayMonthSettings.options,
//     month: this.monthSettings.options,
//     dayOfWeek: this.dayWeekSettings.options
//   };

//   // prepare object to patch
//   const patchObj: any = {};

//   Object.entries({ minute, hour, dayOfMonth, month, dayOfWeek }).forEach(
//     ([key, value]) => {
//       if (!value) return;

//       // handle multiple selections like "3,2"
//       if (value.includes(",")) {
//         const values = value.split(",");
//         patchObj[key] = mapping[key].filter(opt =>
//           values.includes(String(opt.value))
//         );
//       } else {
//         // single selection
//         const selected = mapping[key].find(
//           opt => String(opt.value) === String(value)
//         );
//         if (selected) {
//           patchObj[key] = selected;
//         }
//       }
//     }
//   );

//   // ✅ patch all at once
//   form.patchValue(patchObj);
// }
// patchCronForEdit(cronString: string) {
//   if (!cronString) return;

//   const [minute, hour, dayOfMonth, month, dayOfWeek] = cronString.split(" ");

//   const patchObj: any = {};

//   // patch single selections
//   const singleMapping: { [key: string]: any[] } = {
//     minute: this.minuteSettings.options,
//     hour: this.hourSettings.options,
//     dayOfMonth: this.dayMonthSettings.options,
//     month: this.monthSettings.options
//   };

//   Object.entries({ minute, hour, dayOfMonth, month }).forEach(([key, value]) => {
//     const selected = singleMapping[key].find(opt => String(opt.value) === String(value));
//     if (selected) patchObj[key] = selected.value;  // patch only value
//   });

//   // patch multiple selection for dayOfWeek
//   const dayValues = dayOfWeek.split(",");
//   patchObj['dayOfWeek'] = this.dayWeekSettings.options
//     .filter(opt => dayValues.includes(String(opt.value)))
//     .map(opt => opt.value);

//   this.thirdFormGroup.patchValue(patchObj);
// }

ngOnInit(): void {
debugger;
  this.id = this.route.snapshot.paramMap.get('id');
  console.log('Extracted ID:', this.id);
 this.firstFormGroup = this.fb.group({
    policyName: [''],
    ticketabb: [''],
    tat: [''],
    selectedCategory: [null],
    selectedUserGroup: [null],
    intervalTime: [''],
    isActive: [false],
    isinternal: [false]
  });

  this.thirdFormGroup = this.fb.group({
    minute: ['*'],
    hour: ['*'],
    dayOfMonth: ['*'],
    month: ['*'],
    dayOfWeek: ['*']
  });

  this.ruleService.GetDataById(this.id)
    .pipe(withLoader(this.loaderService))
    .subscribe(
      (response: any) => {
        this.ruleData = response?.result;
        console.log('Stored Rule Data:', this.ruleData);
        this.buildForms();

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

  this.thirdFormGroup.get('cronExpression')?.valueChanges.subscribe((val: string) => {
    this.onCronUpdate(val);
  });

      },
      (error) => {
        console.error('Error fetching fields', error);
        this.buildForms();
      }
    );

  this.getProjList();

  setTimeout(() => {
    this.getRoles();
    this.patchCronForEdit(this.ruleData?.cron);
  }, 1000);

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
  };
}

get f() {
  return this.firstFormGroup.controls;
}

patchCronForEdit(cronString: string) {
  debugger;
  console.log("cronString:",cronString)
  if (!cronString) return;

  // const [minute, hour, dayOfMonth, month, dayOfWeek] = cronString.split(" ");

  // // Call setThirdFormValues for each field
  // this.setThirdFormValues(minute, 'min');
  // this.setThirdFormValues(hour, 'hour');
  // this.setThirdFormValues(dayOfMonth, 'daymon');
  // this.setThirdFormValues(month, 'mon');
  // this.setThirdFormValues(dayOfWeek.split(','), 'day');
  this.parentCron=cronString;
  this.parent_true= true;
}



  buildForms(): void {
    
   this.thirdFormGroup = this._formBuilder.group({
      minute: [''],
      hour: [''],
      dayOfMonth: [''],
      month: [''],
      dayOfWeek: [''],
    });
    this.secondFormGroup = this._formBuilder.group({
      selectedProject: [null],
      groups: this._formBuilder.array([], [this.minFormArrayLength(1)]),
    });
    this.firstFormGroup = this._formBuilder.group({
      // policyName: ['', Validators.required],
      // ticketabb: ['', Validators.required],
      // tat: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      // selectedCategory: ['', Validators.required],
      // selectedUserGroup: ['', Validators.required],
      // intervalTime: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      // isActive: [false, Validators.required],
      // isinternal: [false, Validators.required]
      policyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
  ticketabb: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      tat: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      selectedCategory: ['', Validators.required],
      selectedUserGroup: ['', Validators.required],
      intervalTime: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      isActive: [true, Validators.required],
      isinternal: [false, Validators.required]
    });
    this.thirdFormLoadValues();
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

  onCronUpdate(event: string | null) {
    console.log("event:",event)
  if (event === null) {
    this.parentCron = '❌ Invalid cron format';
  } else {
    this.parentCron = event;
  }
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
  return formValue.groups.map((group: any) => {
    const conditionOp = "$" + (group.condition?.value?.toLowerCase());   // Rule-level
    const conditionOp2 = "$" + (group.condition2?.value?.toLowerCase()); // Project-level

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
// patch_expression(ruleExpression: string){
//     try {
    
//     const parsed = JSON.parse(ruleExpression);

//         parsed.forEach((project:any) => {
//       const selectedProject = {
//         value: project.ProjectId,
//         name: project.ProjectName
//       };
//       this.createGroup(selectedProject);
//       const idx = this.groupsFormArray.length - 1;
//       this.getApi(project, idx);

//     });

    

//     console.log("Parsed Rule Expression:", parsed);

//     return parsed; 
//   } catch (error) {
//     console.error("Error parsing rule expression:", error);
//     return null;
//   }

// }

// patch_expression(ruleExpression: string) {
//   try {
//     const parsed = JSON.parse(ruleExpression);

//     parsed.forEach((projectWrapper: any) => {
    
//       const condition2Key = Object.keys(projectWrapper)[0];
//       const project = projectWrapper[condition2Key][0]; 

//       const selectedProject = {
//         value: project.ProjectId,
//         name: project.ProjectName
//       };

    
//       this.createGroup(selectedProject);
//       const idx = this.groupsFormArray.length - 1;

//           // Patch project-level dropdown (condition2)
//       const group = this.groupsFormArray.at(idx) as FormGroup;
//       const condition2Option = this.conditionSelectSettings.options.find(
//         (opt: any) => opt.name.toUpperCase() === condition2Key.replace('$', '').toUpperCase()
//       );

//       if (condition2Option) {
//         group.patchValue({ condition2: condition2Option });
//       }

     
//       this.getApi(project, idx);
//     });

//     console.log("Parsed Rule Expression:", parsed);
//     return parsed;

//   } catch (error) {
//     console.error("Error parsing rule expression:", error);
//     return null;
//   }
// }



patch_expression(ruleExpression: string) {
  try {
    const parsed = JSON.parse(ruleExpression);
    let index = 0;

    const processNext = () => {
      if (index >= parsed.length) {
        console.log("Parsed Rule Expression:", parsed);
        return;
      }

      const projectWrapper = parsed[index];
      const condition2Key = Object.keys(projectWrapper)[0];
      const project = projectWrapper[condition2Key][0];

      const selectedProject = {
        value: project.ProjectId,
        name: project.ProjectName
      };

      this.createGroup(selectedProject);
      const idx = this.groupsFormArray.length - 1;

      // Patch project-level dropdown (condition2)
      const group = this.groupsFormArray.at(idx) as FormGroup;
      const condition2Option = this.conditionSelectSettings.options.find(
        (opt: any) => opt.name.toUpperCase() === condition2Key.replace('$', '').toUpperCase()
      );

      if (condition2Option) {
        group.patchValue({ condition2: condition2Option });
      }

      // Call getApi and pass processNext as the callback
      this.getApi(project, idx, () => {
        index++;
        processNext(); // move to next project only after API call finishes
      });
    };

    processNext(); 
     this.patchCronForEdit(this.ruleData.cron);

    return parsed;
    
   

  } catch (error) {
    console.error("Error parsing rule expression:", error);
    return null;
  }
}


createGroup(selectedProject: any) {
    let len = this.secondFormGroup.controls['groups'].length;
    const group = this._formBuilder.group({
      seqNo: [{ value: (len == undefined ? 1 : len + 1), disabled: true }],
      projId: [selectedProject.value, Validators.required],
      projName: [selectedProject.name],
      selectedMainExpression: [''],
      condition: [{ value: '' }],
      condition2:[{ value: '' }],
      arrayGroup: this._formBuilder.array([]),
    });

    this.groupsFormArray.push(group);
    const formArr = this.createFormArrayGroup();
    console.log(formArr);
    var expressionGroup = this.getExpression(len);
    expressionGroup.push(formArr);
    console.log(this.groupsFormArray);
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
  if (!this.thirdFormGroup) return '* * * * *';
  const { minute, hour, dayOfMonth, month, dayOfWeek } = this.thirdFormGroup.value || {};
  return `${minute ?? '*'} ${hour ?? '*'} ${dayOfMonth ?? '*'} ${month ?? '*'} ${dayOfWeek ?? '*'}`;
}

  Submit() {
debugger;

    const firstFormValues = this.firstFormGroup.value;
    const secondFormValues = this.secondFormGroup.value;
    const thirdFormValues = this.thirdFormGroup.value;
    
     // Loop through nested groups and trim fieldValue strings
if (secondFormValues.groups && Array.isArray(secondFormValues.groups)) {
  secondFormValues.groups.forEach((group: any) => {
    if (group.arrayGroup && Array.isArray(group.arrayGroup)) {
      group.arrayGroup.forEach((item: any) => {
        if (typeof item.fieldValue === 'string') {
          item.fieldValue = item.fieldValue.trim().replace(/\s{2,}/g, ' ');
        }
      });
    }
  });
}

    console.log(thirdFormValues)
    if (this.thirdFormGroup.invalid) {

      this.toast.error('Please select all the values before Submitting.');
      this.thirdFormGroup.markAllAsTouched();
      return;
    }
else{ 
  
if (!this.parentCron || this.parentCron === '❌ Invalid cron format') {
  this.toast.error('Invalid Cron');
  this.firstFormGroup.setErrors({ cronEmpty: true });
  return;
}
else{const formValue = this.secondFormGroup.value;
const creationTime = new Date();
const result = this.buildProjectExpressions(formValue)

const cron = this.createCronExpression();
console.log("result",JSON.stringify(result));
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
      id: this.ruleData.id,
      description: firstFormValues.policyName,
    };

      this.ruleService.EditRuleEngine(policyData)
        .pipe(withLoader(this.loaderService))
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.toast.success('Rule Engine Updated successfully.');
             this.router.navigate(['/admin/ruleenginelist']);
          },
          error: (err) => {
            console.error('Error creating rule engine:', err);
            this.toast.error('Failed to Update Rule Engine. Please try again.');
          }
        });}
    }

  }

  fieldOption: any;
  apiOption: any;

  onProjectChange(selectedProject: any, groupIndex: number) {
    //this.getfields(selectedProject, groupIndex);
    this.getApi(selectedProject, groupIndex);

  }
//   getApi(selectedProject: any, groupIndex: number) {
//     this.apiOption = false;
//     this.ruleService.GetApis(selectedProject.ProjectId)
//       .pipe(withLoader(this.loaderService))
//       .subscribe((response: any) => {
//         const items = response?.result || [];

//         const projectOptions = items.map((item: any) => ({
//           name: item.apiName,
//           value: item.id,
//           projectid: item.projectId
//         }));
//         const settings = {
//           singleSelection: true,
//           idField: 'id',
//           textField: 'text',
//           allowSearchFilter: true,
//           labelHeader: 'API Name*',
//           lableClass: 'form-label',
//           formFieldClass: '',
//           appearance: 'outline',
//           options: projectOptions
//         };

//              const exprArray = this.getExpressionGroup(groupIndex);

//       selectedProject.Rule.forEach((rule: any, i: number) => {
//         let exprControl: FormGroup;

//         if (exprArray.length > i) {
//           exprControl = exprArray.at(i) as FormGroup;
//         } else {
//           exprControl = this.createFormArrayGroup();
//           exprArray.push(exprControl);
//         }

//         exprControl.patchValue({
        
//           apiSettings: settings,
         
//         });

//           const apiOptions = settings?.options || [];
//   const selectedApi = apiOptions.find((opt: any) => opt.value === rule.APIID);

//   if (selectedApi) {
//     // Patch apiName with the whole matched object
//     exprControl.patchValue({
//       apiName: selectedApi
//     });
//   }

//   this.onApiChange(selectedApi, groupIndex, i);

// setTimeout(() => { 
//   const fieldOptions = exprControl.get('fieldSettings')?.value?.options || [];
//   const expressionKeys = Object.keys(rule.Expression); 
//   const firstKey = expressionKeys[0]; 
//   const conditionsArray = rule.Expression[firstKey]; 
//   const firstCondition = conditionsArray[0]; 

//   const fieldNameFromRule = Object.keys(firstCondition)[0]; 
//   const fieldValueFromRule = firstCondition[fieldNameFromRule]; 
//   const operator = Object.keys(fieldValueFromRule)[0]; 
//   const value = fieldValueFromRule[operator]; 
  
//   const group = this.groupsFormArray.at(groupIndex) as FormGroup;
//   const conditionOption = this.conditionSelectSettings.options.find(
//   (opt: any) => opt.name.toUpperCase() === firstKey.replace('$', '').toUpperCase()
// );

// // Get the value to patch
// //const conditionValue = conditionOption ? conditionOption.value : '';

// // Now patch the value in your group
// group.patchValue({
//   condition: conditionOption
// });






  
//   const selectedField = fieldOptions.find((f: any) => f.value === fieldNameFromRule);

//   if (selectedField) {
   
//     exprControl.patchValue({
//       fieldName: selectedField,
     
//     });


//      this.onFieldChange(selectedField, groupIndex, i);

//        setTimeout(() => {
//     const exprOptions = exprControl.get('expressionSettings')?.value?.options || [];
//    // const expressionValueFromRule = fieldValueFromRule; 

//     // Find the operator that matches the rule
//     const selectedExpression = exprOptions.find((op: any) => op.value === operator);


//     if (selectedExpression) {
//       exprControl.patchValue({
//         expression: selectedExpression,
//         fieldValue :value
//       });
//     }
//   }, 2000); 
//   }
// }, 2000);

//       });
//         this.apiOption = true;
        
        
//       });
//   }


//   getApi(selectedProject: any, groupIndex: number) {
//   this.apiOption = false;

//   this.ruleService.GetApis(selectedProject.ProjectId)
//     .pipe(withLoader(this.loaderService))
//     .subscribe((response: any) => {
//       const items = response?.result || [];

//       const projectOptions = items.map((item: any) => ({
//         name: item.apiName,
//         value: item.id,
//         projectid: item.projectId
//       }));

//       const settings = {
//         singleSelection: true,
//         idField: 'id',
//         textField: 'text',
//         allowSearchFilter: true,
//         labelHeader: 'API Name*',
//         lableClass: 'form-label',
//         formFieldClass: '',
//         appearance: 'outline',
//         options: projectOptions
//       };

//       const exprArray = this.getExpressionGroup(groupIndex);

//       // Loop over each Rule block ($and/$or)
//       selectedProject.Rule.forEach((ruleBlock: any) => {
//         const conditionKey = Object.keys(ruleBlock)[0]; // "$and" / "$or"
//         const expressions = ruleBlock[conditionKey];

//         // Patch rule-level condition dropdown
//         const group = this.groupsFormArray.at(groupIndex) as FormGroup;
//         const conditionOption = this.conditionSelectSettings.options.find(
//           (opt: any) => opt.name.toUpperCase() === conditionKey.replace('$', '').toUpperCase()
//         );
//         if (conditionOption) {
//           group.patchValue({ condition: conditionOption });
//         }

//         // Loop over each expression inside the rule
//         expressions.forEach((expr: any, i: number) => {
//           let exprControl: FormGroup;

//           if (exprArray.length > i) {
//             exprControl = exprArray.at(i) as FormGroup;
//           } else {
//             exprControl = this.createFormArrayGroup();
//             exprArray.push(exprControl);
//           }

//           // Patch API dropdown settings
//           exprControl.patchValue({ apiSettings: settings });

//           const apiOptions = settings?.options || [];
//           const selectedApi = apiOptions.find((opt: any) => opt.value === expr.APIID);
//           if (selectedApi) {
//             exprControl.patchValue({ apiName: selectedApi });
//           }








          

//               this.fieldOption = false;
//     const value = selectedApi?.value;
//     this.ruleService.Getfields(value).pipe(withLoader(this.loaderService)).subscribe((response: any) => {
//       const items = response?.result || [];
//       if (items.length === 0) {

//         this.toast.error('No mapped API fields found, please select some other API.');
//         const rowGroup = (this.getExpressionGroup(groupIndex).at(i) as FormGroup);
//         rowGroup.get('fieldOption')?.setValue(false);
//         return;
//       }

//       else {
//         const projectOptions = items.map((item: any) => ({
//           id: item.id,
//           name: item.apiField,
//           value: item.apiField,
//           type: item.fieldType,

//         }));


//         // Get the specific row's FormGroup
//         const rowGroup = (this.getExpressionGroup(groupIndex).at(i) as FormGroup);


//         // Reset the expression value
//         rowGroup.get('fieldName')?.setValue(null);


//         // Set options only for this row
//         rowGroup.get('fieldSettings')?.setValue({
//           options: projectOptions,
//           singleSelection: true,
//           idField: 'id',
//           textField: 'text',
//           allowSearchFilter: true,
//           labelHeader: 'Field Name*',
//           lableClass: 'form-label',
//           formFieldClass: '',
//           appearance: 'outline',

//         });

//         setTimeout(() => {

//           rowGroup.get('fieldOption')?.setValue(true);

//         });
//       }

//     }, error => {
//       console.error('Error fetching fields', error);
//     });

























//          // this.onApiChange(selectedApi, groupIndex, i);

//           // Patch field, operator, value
//           setTimeout(() => {
//             const fieldOptions = exprControl.get('fieldSettings')?.value?.options || [];
//             const fieldNameFromRule = Object.keys(expr.Expression)[0];
//             const operator = Object.keys(expr.Expression[fieldNameFromRule])[0];
//             const value = expr.Expression[fieldNameFromRule][operator];

//             const selectedField = fieldOptions.find((f: any) => f.value === fieldNameFromRule);
//             if (selectedField) {
//               exprControl.patchValue({ fieldName: selectedField });










//                   this.expOption = false;
//     const fieldType = selectedField?.type;

//     if (fieldType) {
//       const operators = this.typeOperatorMap[fieldType] || [];

//       // Get the specific row's FormGroup
//       const rowGroup = (this.getExpressionGroup(groupIndex).at(i) as FormGroup);


//       // Reset the expression value
//       rowGroup.get('expression')?.setValue(null);

 
//   // Set options only for this row
//     rowGroup.get('expressionSettings')?.setValue({
//       options: operators,
//       singleSelection: true,
//           idField: 'id',
//           textField: 'text',
//           allowSearchFilter: true,
//           labelHeader: 'Expression*',
//           lableClass: 'form-label',
//           formFieldClass: '',
//           appearance: 'outline',

//       });
//       setTimeout(() => {
//         rowGroup.get('expOption')?.setValue(true);
//       });
//     }





















//              // this.onFieldChange(selectedField, groupIndex, i);


//               setTimeout(() => {
//                 const exprOptions = exprControl.get('expressionSettings')?.value?.options || [];
//                 const selectedExpression = exprOptions.find((op: any) => op.value === operator);

//                 if (selectedExpression) {
//                   exprControl.patchValue({
//                     expression: selectedExpression,
//                     fieldValue: value
//                   });
//                 }
//               }, 10);
//             }
//           }, 10);
//         });
//       });

//       this.apiOption = true;
//     });
// }

getApi(selectedProject: any, groupIndex: number, callback?: () => void) {
  this.apiOption = false;

  this.ruleService.GetApis(selectedProject.ProjectId)
    .pipe(withLoader(this.loaderService))
    .subscribe((response: any) => {
      const items = response?.result || [];

      const projectOptions = items.map((item: any) => ({
        name: item.apiName,
        value: item.id,
        projectid: item.projectId
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

      const exprArray = this.getExpressionGroup(groupIndex);

      // Loop over each Rule block ($and/$or)
      selectedProject.Rule.forEach((ruleBlock: any, ruleIndex: number) => {
        const conditionKey = Object.keys(ruleBlock)[0]; // "$and" / "$or"
        const expressions = ruleBlock[conditionKey];

        // Patch rule-level condition dropdown
        const group = this.groupsFormArray.at(groupIndex) as FormGroup;
        const conditionOption = this.conditionSelectSettings.options.find(
          (opt: any) => opt.name.toUpperCase() === conditionKey.replace('$', '').toUpperCase()
        );
        if (conditionOption) {
          group.patchValue({ condition: conditionOption });
        }

        // Loop over each expression inside the rule
        expressions.forEach((expr: any, i: number) => {
          let exprControl: FormGroup;

          if (exprArray.length > i) {
            exprControl = exprArray.at(i) as FormGroup;
          } else {
            exprControl = this.createFormArrayGroup();
            exprArray.push(exprControl);
          }

          // Patch API dropdown settings
          exprControl.patchValue({ apiSettings: settings });

          const apiOptions = settings?.options || [];
          const selectedApi = apiOptions.find((opt: any) => opt.value === expr.APIID);
          if (selectedApi) {
            exprControl.patchValue({ apiName: selectedApi });
          }

          // Fetch fields for selected API
          this.fieldOption = false;
          const value = selectedApi?.value;
          this.ruleService.Getfields(value)
            .pipe(withLoader(this.loaderService))
            .subscribe((fieldResp: any) => {
              const items = fieldResp?.result || [];

              const rowGroup = this.getExpressionGroup(groupIndex).at(i) as FormGroup;

              if (items.length === 0) {
                this.toast.error('No mapped API fields found, please select some other API.');
                rowGroup.get('fieldOption')?.setValue(false);
                return;
              }

              const projectOptions = items.map((item: any) => ({
                id: item.id,
                name: item.apiField,
                value: item.apiField,
                type: item.fieldType
              }));

              // Reset field and patch options
              rowGroup.get('fieldName')?.setValue(null);
              rowGroup.get('fieldSettings')?.setValue({
                options: projectOptions,
                singleSelection: true,
                idField: 'id',
                textField: 'text',
                allowSearchFilter: true,
                labelHeader: 'Field Name*',
                lableClass: 'form-label',
                formFieldClass: '',
                appearance: 'outline'
              });

              setTimeout(() => {
                rowGroup.get('fieldOption')?.setValue(true);
              });

              // Patch expression operator and value
              setTimeout(() => {
                const fieldOptions = exprControl.get('fieldSettings')?.value?.options || [];
                const fieldNameFromRule = Object.keys(expr.Expression)[0];
                const operator = Object.keys(expr.Expression[fieldNameFromRule])[0];
                const value = expr.Expression[fieldNameFromRule][operator];

                const selectedField = fieldOptions.find((f: any) => f.value === fieldNameFromRule);
                if (selectedField) {
                  exprControl.patchValue({ fieldName: selectedField });

                  const fieldType = selectedField?.type;
                  if (fieldType) {
                    const operators = this.typeOperatorMap[fieldType] || [];

                    rowGroup.get('expression')?.setValue(null);
                    rowGroup.get('expressionSettings')?.setValue({
                      options: operators,
                      singleSelection: true,
                      idField: 'id',
                      textField: 'text',
                      allowSearchFilter: true,
                      labelHeader: 'Expression*',
                      lableClass: 'form-label',
                      formFieldClass: '',
                      appearance: 'outline'
                    });

                    setTimeout(() => {
                      rowGroup.get('expOption')?.setValue(true);
                    });
                  }

                  setTimeout(() => {
                    const exprOptions = exprControl.get('expressionSettings')?.value?.options || [];
                    const selectedExpression = exprOptions.find((op: any) => op.value === operator);

                    if (selectedExpression) {
                      exprControl.patchValue({
                        expression: selectedExpression,
                        fieldValue: value
                      });
                    }
                  }, 10);
                }
              }, 10);
            });
        });
      });

      this.apiOption = true;

      // ✅ Call callback after finishing getApi for this project
      if (callback) callback();
    }, (err) => {
      console.error('Error fetching APIs', err);
      if (callback) callback(); // continue even on error
    });
}



   getApi_create(selectedProject: any, groupIndex: number) {
    this.apiOption = false;
    this.ruleService.GetApis(selectedProject)
      .pipe(withLoader(this.loaderService))
      .subscribe((response: any) => {
        const items = response?.result || [];

        const projectOptions = items.map((item: any) => ({
          name: item.apiName,
          value: item.id,
          projectid: item.projectId
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

 patchFirstFormData(): void {
  if (!this.ruleData) return;

  const selectedUserGroup = (this.userGroupSettings.options as any[]).find(
    opt => opt.value === Number(this.ruleData.policyRoles) 
  );

 
  const selectedCategory = (this.categorySelectSettings.options as any[]).find(
    opt => opt.value === String(this.ruleData.priority)
  );
  this.firstFormGroup.patchValue({
  policyName: this.ruleData.policyName ?? '',
  ticketabb: this.ruleData.ticketAbbrevation ?? '',
  tat: String(this.ruleData.tat ?? ''),
  selectedCategory: selectedCategory,   
  selectedUserGroup: selectedUserGroup,
  intervalTime: String(this.ruleData.intervalTime ?? ''),
  isActive: !!this.ruleData.isActive,
  isinternal: !!this.ruleData.isInternal
});

  console.log('First Form patched:', this.firstFormGroup.value);

  this.patch_expression(this.ruleData.ruleExpression);
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
      this.patchFirstFormData();
    }, error => {
      console.error('Error fetching project list', error);
    });
  }
  // goNext() {

  //   console.log("2", this.secondFormGroup.value)
  //   console.log('Third form group value/status:', this.secondFormGroup);

  //   if (this.currentStep === 0 && this.firstFormGroup.invalid) {
  //     this.toast.error('Please select all the values.');
  //     this.firstFormGroup.markAllAsTouched();

  //     return;
  //   }
  //   else {
  //     if (this.currentStep === 1 && this.secondFormGroup.invalid) {
  //       this.toast.error('Please select all the values.');
  //       this.firstFormGroup.markAllAsTouched();

  //       return;
  //     }
  //     else {
  //       if (this.currentStep < this.steps.length - 1) {
  //         this.currentStep++;
  //       }
  //     }




  //   }

  // }

  goNext() {
  // Show loader
  this.loaderService.showLoader();

  setTimeout(() => {
    console.log("Second form group value:", this.secondFormGroup.value);
    console.log('Second form group status:', this.secondFormGroup.status);

    if (this.currentStep === 0 && this.firstFormGroup.invalid) {
      this.toast.error('Please select all the values.');
      this.firstFormGroup.markAllAsTouched();
      this.loaderService.hideLoader(); // hide loader
      return;
    }
    else if (this.currentStep === 1 && this.secondFormGroup.invalid) {
      this.toast.error('Please select all the values.');
      this.secondFormGroup.markAllAsTouched();
      this.loaderService.hideLoader(); // hide loader
      return;
    }
    else {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    }

    // Hide loader after processing
    this.loaderService.hideLoader();
  }, 500); // Loader visible for 500ms
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
    this.getApi_create(this.selectedProjectId, idx);
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


  addFormArrayGroup(len: number) {
    console.log(len);
    const formArr = this.createFormArrayGroup();
    var expressionGroup = this.getExpression(len);
    expressionGroup.push(formArr);
    let proj = this.secondFormGroup.controls.groups.controls[len].controls.projId.value;
    //this.getfields(proj, len);
    this.getApi_create(proj, len);
  }

  checkboxOptions = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' }
  ];

  onCheckboxChange(selected: any) {
    console.log('Selected:', selected);
  }
  thirdFormLoadValues(){
    this.thirdFormGroup.patchValue({
        minute : this.ruleData.cron.split(' ')[0],
        hour : this.ruleData.cron.split(' ')[1],
        dayOfMonth : this.ruleData.cron.split(' ')[2],
        month : this.ruleData.cron.split(' ')[3],
        dayOfWeek : this.ruleData.cron.split(' ')[4],
      })
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
  const control = this.firstFormGroup.controls['policyName'];

  // ✅ Use ['pattern'] instead of .pattern
  if (!value || control.errors?.['pattern']) {
    this.policyNameExists = false;
    return;
  }

  this.ruleService.CheckPolicyNameExist(value, this.id)
    .pipe(withLoader(this.loaderService))
    .subscribe((response: any) => {
      this.policyNameExists = response.result === true;

      if (this.policyNameExists) {
        control.setErrors({ duplicateName: true });
      } else {
        // Remove duplicateName error if exists
        if (control.hasError('duplicateName')) {
          const errors = { ...control.errors };
          delete errors['duplicateName'];
          control.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    });
}


  getCronFromData(evt: any) {
  if (!evt) return;
  this.thirdFormGroup.patchValue({
    minute: evt.minute,
    hour: evt.hour,
    dayOfMonth: evt.dayOfMonth,
    month: evt.month,
    dayOfWeek: evt.dayOfWeek,
  });
  this.parentCron = evt.cronString;
}
loadEditData() {
  this.ruleService.GetDataById(this.id)
    .pipe(withLoader(this.loaderService))
    .subscribe(
      (response: any) => {
    this.editCronExpression = response.result.cronExpression; // or your property name
  });
}
}

