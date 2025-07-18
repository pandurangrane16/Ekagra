
import { Component, Inject, Injectable } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule,FormGroup, Validators ,ReactiveFormsModule,} from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../Material.module';

@Component({
  selector: 'app-site-configuration-form',
  standalone:true,
  imports: [CommonModule,CmInputComponent,CmSelect2Component,CmToggleComponent,ReactiveFormsModule, FormsModule,MaterialModule],
  templateUrl: './site-configuration-form.component.html',
  styleUrl: './site-configuration-form.component.css'
})
@Injectable({ providedIn: 'root' })
export class SiteConfigurationFormComponent {
  form!: FormGroup;
  MatButtonToggleChange:any;
  ruleEngineStatus = '';
  mapStatus = '';
  selectedStatus: any;
  inputFields = {
    name: {
      // labelHeader: 'Name',
      placeholder: 'Enter project name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    description: {
      // labelHeader: 'Description',
      placeholder: 'Enter description',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    }
  };
  ruleEngineToggleSettings = {
    headerName: 'Rule Engine Enabled',
    name: 'ruleEngineToggle',
    data: [
      { value: 'enabled', displayName: 'Enabled' },
      { value: 'disabled', displayName: 'Disabled' }
    ]
  };

  toggleSettingsWithoutHeader = {
   
    name: 'isActive',
    defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
  
  mapToggleSettings = {
    headerName: 'Map Enabled',
    name: 'mapToggle',
    data: [
      { value: 'enabled', displayName: 'Enabled' },
     
      
    ]
  };
  projectSelectSettings = {
    // labelHeader: 'Select Project',
    lableClass: 'form-label',
    formFieldClass: '', 
    appearance: 'outline',
    options: [
      { name: 'apple', value: 'A' },
      { name: 'mango', value: 'B' },
      { name: 'bananannanan', value: 'C' }
    ],
    
  };
  onProjectSelected(event: any) {
    console.log('Selected Project:', event);
  }
  
  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required,],
      description: ['', Validators.required],
      selectedStatus: [''],
      
    });
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(controlName)?.setValue(file);
    }
  }

  submit() {
    if (this.form.valid) {
      
    }
  }

  close() {
    
  }

}
