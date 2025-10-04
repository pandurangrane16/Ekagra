import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { getErrorMsg } from '../../../utils/utils';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';

@Component({
  selector: 'app-role-configuration',
  imports: [MaterialModule, CommonModule, CmInputComponent,CmToggleComponent],
  templateUrl: './role-configuration.component.html',
  styleUrl: './role-configuration.component.css'
})
export class RoleConfigurationComponent implements OnInit {
  form: any;
  inputFields = {
    roleName: {
      // labelHeader: 'Description',
      placeholder: 'Role Name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },

    roleDesc: {
      // labelHeader: 'Description',
      placeholder: 'Description',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
  }
  isActiveSettings = {

    name: 'isActive',
    formControlName: 'isActive',
    defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

  get f() {
    return this.form.controls;
  }
  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      roleId: [],
      roleName: ['', Validators.required],
      roleDesc: ['', Validators.required],
      isActive: [true, Validators.required]
    })
  }

  close() {

  }

  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  submit(){}
}
