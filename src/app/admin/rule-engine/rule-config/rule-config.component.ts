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
  private _formBuilder = inject(FormBuilder);
  signalRService = inject(SignalRService);
  ruleService = inject(RuleEngineService);
  userGroupSettings = {
    labelHeader: 'User Group*',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Admin', value: '0' },
      { name: 'Supervisor', value: '1' },
      { name: 'CMS User Admin', value: '2' },
      { name: 'Operators', value: '3' }
    ]
  };

  projectSettings = {
    labelHeader: 'Project*',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'VMS', value: '0' },
      { name: 'ATCS', value: '1' },
      { name: 'TEST', value: '2' },
      { name: 'TEST 2', value: '3' }
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
  categorySelectSettings = {
    labelHeader: 'Select Category*',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Low', value: 'L' },
      { name: 'Medium', value: 'M' },
      { name: 'High', value: 'H' }
    ],

  };

  conditionSelectSettings = {
    labelHeader: 'Condition',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'AND', value: 'and' },
      { name: 'OR', value: 'or' },
    ],

  };

  fieldSettings = {
    labelHeader: 'Field Name',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'PT', value: 'pt' },
      { name: 'Network Status', value: 'networkstatus' },
      { name: 'Power Status', value: 'powerstatus' },
      { name: 'Snapshot', value: 'snapshot' },
    ],
  };

  expressionSettings = {
    labelHeader: 'Expression',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'outline',
    options: [
      { name: 'Equal', value: '==' },
      { name: 'Not Equal', value: '!=' },
      { name: 'Greater Than', value: '>' },
      { name: 'Greater Than Equal To', value: '>=' },
      { name: 'Less Than', value: '<' },
      { name: 'Less Than Equal To', value: '<=' },
      { name: 'Is Null', value: 'isnull' },
      { name: 'Is Not Null', value: 'notnull' },
      { name: 'Begins With', value: 'beginwith' },
      { name: 'Doesn\'t Begins With', value: 'dbegin' },
      { name: 'Contains', value: 'contain' },
      { name: 'Doesn\'t Contains', value: 'dcontain' },
    ]
  }

  minuteSettings = {
    labelHeader: 'Minute',
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
    labelHeader: 'Hour',
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

  firstFormGroup = this._formBuilder.group({
    policyName: ['', Validators.required],
    selectedCategory: ['', Validators.required],
    selectedUserGroup: ['', Validators.required],
    intervalTime: ['', Validators.required],
    isActive: [false, Validators.required]
  });
  secondFormGroup = this._formBuilder.group({
    selectedProject: ['', Validators.required],
    groups: this._formBuilder.array([]),
  });
  thirdFormGroup = this._formBuilder.group({
    minute: ['', Validators.required],
    hour: ['', Validators.required],
    dayOfMonth: ['', Validators.required],
    month: ['', Validators.required],
    dayOfWeek: ['', Validators.required],
  });
  isLinear = false;

  //currentStep = 0;

  // steps = [
  //   { icon: '🧾', title: 'Rule Details' },
  //   { icon: '✏️', title: 'Rule Design' },
  //   { icon: '⏰', title: 'Rule Schedule' },
  //   { icon: '✅', title: 'Confirm' }
  // ];
  ruleConditions: any;
  constructor() {
    this.ruleConditions = this.ruleService.getRuleConditions();
    if (this.ruleConditions == null) {
      this.ruleService.setRulesStorage();
      this.ruleConditions = this.ruleService.getRuleConditions();
    }
  }
  ngOnInit(): void {
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
  }

  goNext() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
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
  createGroup() {
    let len = this.secondFormGroup.controls['groups'].length;
    const group = this._formBuilder.group({
      seqNo: [{ value: (len == undefined ? 1 : len + 1), disabled: true }],
      projId: [Validators.required],
      selectedMainExpression: ['', Validators.required],
      condition: [{ value: '', disabled: true }],
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
    });
  }

  addFormArrayGroup(len: number) {
    console.log(len);
    const formArr = this.createFormArrayGroup();
    var expressionGroup = this.getExpression(len);
    expressionGroup.push(formArr);
  }

  checkboxOptions = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' }
  ];

  onCheckboxChange(selected: any) {
    console.log('Selected:', selected);
  }

}
