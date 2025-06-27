import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule,FormGroup, Validators ,ReactiveFormsModule,} from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { getErrorMsg } from '../../../utils/utils';
import { projfieldconfigservice } from '../../../services/admin/projfieldconfig.service';
import { projfieldconfigmodel } from '../../../models/admin/projfieldconfig.model';




@Component({
  selector: 'app-project-field-configuration-form',
  imports: [CommonModule,CmInputComponent,CmSelect2Component,MatIconModule, CmToggleComponent,ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './project-field-configuration-form.component.html',
  styleUrl: './project-field-configuration-form.component.css'
})

export class ProjectFieldConfigurationFormComponent  implements OnInit{
  
  form!: FormGroup;
  MatButtonToggleChange:any;
  isProjectOptionsLoaded = false;
  editid:any;
  ruleEngineStatus = '';
  mapStatus = '';
  selectedProject: any;
  inputFields = {

        description: {
      // labelHeader: 'Description',
      placeholder: 'Enter description',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    },
        maplabel: {
      // labelHeader: 'Description',
      placeholder: 'Enter Maplabel',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    },
    apilabel: {
      // labelHeader: 'Description',
      placeholder: 'Enter Apilabel',
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

  projectEnabled = {
   
    name: 'isActive',
    defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

    isSameas= {
   
    name: 'isSameas',
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
    options: []
    
  };
  onProjectSelected(event: any) {
    console.log('Selected Project:', event);
  }
  
  constructor(
    
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectFieldConfigurationFormComponent>,
    private service :projfieldconfigservice,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
    
      description: ['', Validators.required],
      isActive: [false,Validators.required],
      maplabel: ['',Validators.required],
      apilabel: ['',Validators.required],
      isSameas: [false,Validators.required],
      selectedProject:['', Validators.required],
      
      
    });
  }

  ngOnInit(): void {
    
 
   this.getProjList();

}
 
  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(controlName)?.setValue(file);
    }
  }

  get f() {
  return this.form.controls;
  }

      getProjList() {
  this.service.GetProjectList().subscribe(response => {
    const items = response?.result || [];

 
    const projectOptions = items.map((item: any) => ({
      name: item.name || item.shortCode, 
      value: item.id
    }));

 
    this.projectSelectSettings.options = projectOptions;
    this.isProjectOptionsLoaded = true;
     if (this.data?.mode === 'edit' && this.data?.record) {


const selectedProj = (this.projectSelectSettings.options as any[]).find(
  proj => proj.name === this.data.record.projectName
);
console.log(selectedProj);

this.editid=this.data.record.id;
    this.form.patchValue({
      description: this.data.record.description,
      isActive: this.data.record.isActive,
      maplabel: this.data.record.mapLabel,
      apilabel: this.data.record.apiLabel,
      isSameas: this.data.record.isMapLabel,
      selectedProject: selectedProj
    });

    console.log('Edit form data patched:', this.data.record);
  }
  }, error => {
    console.error('Error fetching project list', error);
  });
}  

  submit() {
 
  if (!this.form.invalid) {
    this.form.markAllAsTouched(); 
     
      let _projfieldconfigmodel = new projfieldconfigmodel();


_projfieldconfigmodel.description = this.form.controls['description'].value;
_projfieldconfigmodel.isActive=this.form.controls['isActive'].value;
_projfieldconfigmodel.creationTime="2025-06-20T05:32:25.067Z"
_projfieldconfigmodel.creatorUserId=0
_projfieldconfigmodel.deleterUserId=0
_projfieldconfigmodel.deletionTime="2025-06-20T05:32:25.067Z"
_projfieldconfigmodel.lastModificationTime="2025-06-20T05:32:25.067Z"
_projfieldconfigmodel.lastModifierUserId="2"
_projfieldconfigmodel.isDeleted=false
_projfieldconfigmodel.isMap=this.form.controls['isSameas'].value;
_projfieldconfigmodel.label=this.form.controls['apilabel'].value;
_projfieldconfigmodel.dataType="string"
_projfieldconfigmodel.mapLabel=this.form.controls['maplabel'].value;
_projfieldconfigmodel.projectId = this.form.controls['selectedProject'].value?.value;

  if (this.data?.mode === 'edit' && this.data?.record?.id){

    _projfieldconfigmodel.id = this.data.record.id;

      this.service.ProjectfieldEdit(_projfieldconfigmodel).subscribe({
    next: () => {
      console.log('Updated successfully');

           //this.toast.success('ProjectField saved successfully'); 
      this.dialogRef.close(this.form.value);
    
      //this.toast.success('ProjectField saved successfully');
      
    },
    error: (err) => {
      console.error('Update failed:', err);
      //this.toast.error('Failed to save project');
    }
  });

  return;

  }


 


  this.service.ProjectfieldCreate(_projfieldconfigmodel).subscribe({
    next: () => {
      console.log('Saved successfully');

           //this.toast.success('ProjectField saved successfully'); 
      this.dialogRef.close(this.form.value);
    
      //this.toast.success('ProjectField saved successfully');
      
    },
    error: (err) => {
      console.error('Save failed:', err);
      //this.toast.error('Failed to save project');
    }
  });



  }
  else {
      this.form.markAllAsTouched(); 
 // this.toast.error('Form is not valid');
  return;
    
  }


  }

  close() {
    this.dialogRef.close();
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

}
