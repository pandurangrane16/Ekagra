
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule,FormGroup, Validators ,ReactiveFormsModule,} from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { CmToggleComponent } from '../../common/cm-toggle/cm-toggle.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-project-configuration-form',
  imports: [CommonModule,CmInputComponent, CmToggleComponent,ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './project-configuration-form.component.html',
  styleUrl: './project-configuration-form.component.css'
})
export class ProjectConfigurationFormComponent {
  form!: FormGroup;
  MatButtonToggleChange:any;
  inputFields = {
    name: {
      labelHeader: 'Name',
      placeholder: 'Enter project name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary'
    },
    description: {
      labelHeader: 'Description',
      placeholder: 'Enter description',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary'
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

  ruleEngineStatus = '';
  mapStatus = '';




  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectConfigurationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ruleEngineEnabled: [false],
      mapEnabled: [false],
      mapIcon: [null, Validators.required],
      projectIcon: [null, Validators.required],
      enabled: [true],
      isActive: [true],
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
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }







}
