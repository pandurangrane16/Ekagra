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
import { ToastrService } from 'ngx-toastr';




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
  showMapLabelError = false;
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

  projectEnabled2 = {
   
    name: 'isActive',
    defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

  projectEnabled = {

  name: 'isActive',
  formControlName: 'isActive',
  data: [
    { value: true, displayName: 'Yes' },
    { value: false, displayName: 'No' }
  ]
};

    isSameas= {
   
    name: 'isSameas',
    formControlName: 'isSameas',
   
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
    private toast :ToastrService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
this.form = this.fb.group({
  description: ['', Validators.required],
  isActive: [ Validators.required],
  maplabel: [{ value: '', disabled: true }, Validators.required],
  apilabel: [{ value: '', disabled: true }, Validators.required],
  isSameas: [ Validators.required],
  selectedProject: ['', Validators.required],
});
  }

  ngOnInit(): void {
    
 
   this.getProjList();
this.form.controls['selectedProject'].valueChanges.subscribe((value: { value: number; name: string } | null) => {
  const selectedName = value?.name?.trim();

  if (selectedName) {
    this.form.controls['maplabel'].enable();
    this.form.controls['apilabel'].enable();
  } else {
    this.form.controls['maplabel'].disable();
    this.form.controls['maplabel'].reset();
    
    this.form.controls['apilabel'].disable();
    this.form.controls['apilabel'].reset();
  }
});





this.form.controls['maplabel'].valueChanges.subscribe((newVal: string) => {
  const isSame = this.form.controls['isSameas'].value;
  if (isSame === true) {
    this.form.controls['apilabel'].setValue(newVal);     
  }
});
this.form.controls['isSameas'].valueChanges.subscribe((option: boolean) =>  {

  if (option === true) {
    const mapVal = this.form.controls['maplabel'].value || '';
    this.form.controls['apilabel'].setValue(mapVal);     
    this.form.controls['apilabel'].disable();            
  } else {
    this.form.controls['apilabel'].enable();            
    this.form.controls['apilabel'].reset();              
  }
});

}



onMapLabelClick(): void {
  const mapLabelControl = this.form.controls['maplabel'];
  const projectSelected = this.form.controls['selectedProject'].value;

  if (mapLabelControl.disabled && !projectSelected) {
    this.showMapLabelError = true;

  
    setTimeout(() => this.showMapLabelError = false, 3000);
  }
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
      console.log('Edit form data patched form value:', this.form.value);
      console.log(this.form.controls)

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
_projfieldconfigmodel.isMapLabel=this.form.controls['isSameas'].value;
_projfieldconfigmodel.label=this.form.controls['apilabel'].value;
_projfieldconfigmodel.dataType="string"
_projfieldconfigmodel.mapLabel=this.form.controls['maplabel'].value;

_projfieldconfigmodel.projectId = this.form.controls['selectedProject'].value?.value;

    this.service.CheckMapLabel(_projfieldconfigmodel.projectId,_projfieldconfigmodel.mapLabel,this.data?.record?.id).subscribe(response => {
        if (response.result === true) {
          this.toast.error(" Map Label exists in the System.");
          
          return;
        }
       
     else{



          this.service.CheckMapLabel(_projfieldconfigmodel.projectId,_projfieldconfigmodel.label,this.data?.record?.id).subscribe(response => {
        if (response.result === true) {
          this.toast.error(" Api Label exists in the System.");
          
          return;
        }
       
     else{

      
  
  if (this.data?.mode === 'edit' && this.data?.record?.id){

    _projfieldconfigmodel.id = this.data.record.id;

      this.service.ProjectfieldEdit(_projfieldconfigmodel).subscribe({
    next: () => {
      console.log('Updated successfully');

           this.toast.success('Updated successfully'); 
      this.dialogRef.close(this.form.value);
    
      //this.toast.success('ProjectField saved successfully');
      
    },
    error: (err) => {
      console.error('Update failed:', err);
      this.toast.error('Update failed:', err);
    }
  });

  return;

  }

  this.service.ProjectfieldCreate(_projfieldconfigmodel).subscribe({
    next: () => {
      console.log('Saved successfully');

           this.toast.success('ProjectField saved successfully'); 
      this.dialogRef.close(this.form.value);
    
     
      
    },
    error: (err) => {
      console.error('Save failed:', err);
      this.toast.error('Failed to save project');
    }
  });
     }
        

      });


  

     }
        

      });

  







  }
  else {
      this.form.markAllAsTouched(); 
 this.toast.error('Form is not valid');
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
