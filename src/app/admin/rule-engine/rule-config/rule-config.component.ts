import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { RuleEngineService } from '../../../services/admin/rule-engine.service';
import { SignalRService } from '../../../services/common/signal-r.service';

@Component({
  selector: 'app-rule-config',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmInputComponent, CmSelect2Component,CmToggleComponent],
  templateUrl: './rule-config.component.html',
  styleUrl: './rule-config.component.css'
})
export class RuleConfigComponent {
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
    labelHeader: 'Select Category',
    lableClass: 'form-label',
    formFieldClass: '', 
    appearance: 'outline',
    options: [
      { name: 'Low', value: 'L' },
      { name: 'Medium', value: 'M' },
      { name: 'High', value: 'H' }
    ],
    
  };
  firstFormGroup = this._formBuilder.group({
    policyName: ['', Validators.required],
    selectedCategory: ['', Validators.required],
    selectedUserGroup: ['', Validators.required],
    intervalTime: ['', Validators.required],
    isActive: [false, Validators.required]
  });
  secondFormGroup = this._formBuilder.group({
    selectedProject: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
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
    if(this.ruleConditions == null) {
      this.ruleService.setRulesStorage();
      this.ruleConditions = this.ruleService.getRuleConditions();
    }
  }

  goNext() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
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

  CheckConnection(){
    this.signalRService.initializeSignalRConnection();
  }

}
