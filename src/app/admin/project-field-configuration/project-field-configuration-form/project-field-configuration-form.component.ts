import { Component, inject, OnInit } from '@angular/core';
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
import { MatCardModule } from '@angular/material/card';
import { projfieldconfigservice } from '../../../services/admin/projfieldconfig.service';
import { projfieldconfigmodel } from '../../../models/admin/projfieldconfig.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';




@Component({
  selector: 'app-project-field-configuration-form',
  imports: [CommonModule,CmInputComponent,MatTooltipModule,MatCardModule,CmSelect2Component,MatIconModule, CmToggleComponent,ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './project-field-configuration-form.component.html',
  styleUrl: './project-field-configuration-form.component.css'
})

export class ProjectFieldConfigurationFormComponent  implements OnInit{
  router = inject(Router);
  
  form!: FormGroup;
  MatButtonToggleChange:any;
  showMapLabelError : boolean = false;
  isProjectOptionsLoaded = false;
  editid:any;
  state:any;
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
     formControlName: 'isActive',
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

    isSameas= {
   
    name: 'isSameas',
      formControlName: 'isSameas',
    defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
  selectedName :string = "";
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
    private toast: ToastrService,
    //private dialogRef: MatDialogRef<ProjectFieldConfigurationFormComponent>,
    private service :projfieldconfigservice,

   // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
this.form = this.fb.group({
  description: ['',[ Validators.required, this.noWhitespaceValidator()]  ],
  isActive: [ Validators.required],
  maplabel: [{ value: '', disabled: true }, [Validators.required, this.noWhitespaceValidator(), this.noSpecialCharValidator()]  ],
  apilabel: [{ value: '', disabled: true }, [Validators.required, this.noWhitespaceValidator(), this.noSpecialCharValidator() ] ],
  isSameas: [ Validators.required],
  selectedProject: ['',[ Validators.required, this.noWhitespaceValidator()]  ],
});
  }
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (typeof value !== 'string') {
      return null; 
    }

    const isWhitespace = value.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}


noSpecialCharValidator(): ValidatorFn {
  debugger;
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (typeof value !== 'string') return null;

    // Allow only alphanumeric, underscores, hyphens and spaces (customize as needed)
    const valid = /^[a-zA-Z0-9_\- ]*$/.test(value);
    return !valid ? { specialChars: true } : null;
  };
}

  ngOnInit(): void {
    
    this.state = history.state;
         const state = this.state;
   this.getProjList();
  this.form.get('selectedProject')?.valueChanges.subscribe(selected => {
    const selectedProject = selected?.value;

    if (selectedProject) {
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
     if (this.state?.mode === 'edit' && this.state?.record) {
      this.form.patchValue({
         apilabel: this.state.record.apiLabel,
      })
      
     }
               
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
     if (this.state?.mode === 'edit' && this.state?.record) {


const selectedProj = (this.projectSelectSettings.options as any[]).find(
  proj => proj.name === this.state.record.projectName
);
console.log("hello selectedProj");

this.editid=this.state.record.id;
    this.form.patchValue({
      description: this.state.record.description,
      isActive: this.state.record.isActive,
      maplabel: this.state.record.mapLabel,
      apilabel: this.state.record.apiLabel,
      isSameas: this.state.record.isMapLabel,
      selectedProject: selectedProj
    });

    console.log('Edit form data patched:', this.state.record);
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
_projfieldconfigmodel.isMap=this.form.controls['isSameas'].value;
_projfieldconfigmodel.label=this.form.controls['apilabel'].value;
_projfieldconfigmodel.dataType="string"
_projfieldconfigmodel.mapLabel=this.form.controls['maplabel'].value;
_projfieldconfigmodel.projectId = this.form.controls['selectedProject'].value?.value;

    this.service.CheckMapLabel(_projfieldconfigmodel.projectId,_projfieldconfigmodel.mapLabel,this.state?.record?.id).subscribe(response => {
        if (response.result === true) {
          this.toast.error(" Map Label exists in the System.");
          
          return;
        }
       
     else{



          this.service.CheckMapLabel(_projfieldconfigmodel.projectId,_projfieldconfigmodel.label,this.state?.record?.id).subscribe(response => {
        if (response.result === true) {
          this.toast.error(" Api Label exists in the System.");
          
          return;
        }
       
     else{

      
  
  if (this.state?.mode === 'edit' && this.state?.record?.id){

    _projfieldconfigmodel.id = this.state.record.id;

      this.service.ProjectfieldEdit(_projfieldconfigmodel).subscribe({
    next: () => {
      console.log('Updated successfully');

           this.toast.success('Updated successfully'); 
           this.router.navigate(['/admin/projfieldconfig']);
      
      
    },
    error: (err) => {
      console.error('Update failed:', err);
      //this.toast.error('Failed to save project');
    }
  });

  return;

  }

  else{  this.service.ProjectfieldCreate(_projfieldconfigmodel).subscribe({
    next: () => {
      console.log('Saved successfully');

           this.toast.success('ProjectField saved successfully'); 
           this.router.navigate(['/admin/projfieldconfig']);
    
    
      //this.toast.success('ProjectField saved successfully');
      
    },
    error: (err) => {
      console.error('Save failed:', err);
      //this.toast.error('Failed to save project');
    }
  });}



     }
        

      });


  

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
    this.router.navigate(['/admin/projfieldconfig']);
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

//   getErrorMessage(controlName: string, label: string): string {
//   const control = this.form.get(controlName);
//   if (control?.hasError('required')) return `${label} is required.`;
//   if (control?.hasError('whitespace')) return `${label} cannot be empty or whitespace.`;
//   if (control?.hasError('specialChars')) return `${label} should not contain special characters.`;
//   return '';
// }

}
