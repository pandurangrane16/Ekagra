
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule,FormGroup, Validators ,ReactiveFormsModule,} from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { CommonModule } from '@angular/common';
import { projconfigservice } from '../../../services/admin/progconfig.service';
import { projconfigmodel } from '../../../models/admin/projconfig.model';
import { getErrorMsg } from '../../../utils/utils';
import { MatIconModule } from '@angular/material/icon';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-project-configuration-form',
  imports: [CommonModule,CmInputComponent, MatIconModule,CmToggleComponent,ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './project-configuration-form.component.html',
  styleUrl: './project-configuration-form.component.css',
  standalone:true,
  providers:[ToastrService]
})
export class ProjectConfigurationFormComponent {
  form!: FormGroup;
  MatButtonToggleChange:any;
  ruleEngineStatus:any;
  mapStatus :any;
  selectedFilePaths = {
    mapIcon: '',
    projectIcon: ''
  };
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

 
  isactivetoggle = {
   
    name: 'isActive',
    formControlName:'isActive',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };



  Maptoggle = {
   
    name: 'mapEnabled',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

  Ruleenginetoggle = {
   
    name: 'ruleEngineEnabled',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
previewUrls: { [key: string]: string } = {};

  
  constructor(
    private fb: FormBuilder,
    private service: projconfigservice,
    private toast: ToastrService,
    private dialogRef: MatDialogRef<ProjectConfigurationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.form = this.fb.group({
      name: [ '',Validators.required],
      description: [ '',Validators.required],
      ruleEngineEnabled: [false,Validators.required],
      mapEnabled: [false,Validators.required],
      mapIcon: [ null,Validators.required],
      projectIcon: [ null,Validators.required],
      isActive: [false,Validators.required],
    });
  }

  get f() {
  return this.form.controls;
  }

ReturnValue($event:any) {
  console.log($event);
}

onFileSelect(event: any, type: 'mapIcon' | 'projectIcon') {
  const file = event.target.files[0];
  const control = this.form.get(type);

  if (file) {
 
    if (!file.type.startsWith('image/')) {
      console.warn('File is not an image:', file.type);
      return;
    }

   
    const objectUrl = URL.createObjectURL(file);
    this.previewUrls[type] = objectUrl;
    console.log('Preview URL set for', type, ':', objectUrl);

  
    const formData = new FormData();
    formData.append('file', file);

    this.service.UploadFile(formData).subscribe({
      next: (response) => {
        if (response?.result?.success) {
          const uploadedFileName = response.result.fileName;

          control?.setValue(uploadedFileName);
          control?.setErrors(null);
          control?.markAsTouched();
          control?.markAsDirty();

          this.selectedFilePaths[type] = uploadedFileName;
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
      }
    });
  }
}


  ngOnInit(): void {
         if (this.data?.mode === 'edit' && this.data?.record) {



    this.form.patchValue({
   
      name: this.data.record.name,
      description: this.data.record.description,
      mapEnabled: this.data.record.map,
      ruleEngineEnabled: this.data.record.ruleEngine,
      isActive: this.data.record.isActive,
    
      
    });
    this.loadExistingIcons();

    console.log('Edit form data patched:', this.data.record);
  }
 
  

}
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

loadExistingIcons(): void {
  const basePath = 'https://172.19.32.210:8002/UploadedFiles/Icons/';

  if (this.data?.record?.mapIcon) {
    const mapIconUrl = basePath + this.data.record.mapIcon;
    this.selectedFilePaths['mapIcon'] =  this.data?.record?.mapIcon;
    this.previewUrls['mapIcon'] = mapIconUrl;
  }

  if (this.data?.record?.projectIcon) {
    const projectIconUrl = basePath + this.data.record.projectIcon;
    this.selectedFilePaths['projectIcon'] = this.data?.record?.projectIcon;
    this.previewUrls['projectIcon'] = projectIconUrl; 
  }

  this.form.patchValue({
    mapIcon: this.data?.record?.mapIcon,
    projectIcon: this.data?.record?.projectIcon
  });

  console.log('Edit Preview URLs:', this.previewUrls);
}


  submit() {
  this.toast.success("chgdgsf")
  if (!this.form.invalid) {
    this.form.markAllAsTouched(); 
     
      let _projconfigmodel = new projconfigmodel();

_projconfigmodel.name = this.form.controls['name'].value;
_projconfigmodel.description = this.form.controls['description'].value;
_projconfigmodel.map=this.form.controls['mapEnabled'].value;
_projconfigmodel.ruleEngine=this.form.controls['ruleEngineEnabled'].value;
_projconfigmodel.mapIcon=this.form.controls['mapIcon'].value;
_projconfigmodel.projectIcon=this.form.controls['projectIcon'].value;
_projconfigmodel.isActive=this.form.controls['isActive'].value;
_projconfigmodel.creationTime="2025-06-20T05:32:25.067Z"
_projconfigmodel.creatorUserId=0
_projconfigmodel.deleterUserId=0
_projconfigmodel.deletionTime="2025-06-20T05:32:25.067Z"
_projconfigmodel.id=0
_projconfigmodel.lastModificationTime="2025-06-20T05:32:25.067Z"
_projconfigmodel.lastModifierUserId="2"
_projconfigmodel.sequence=0
_projconfigmodel.shortCode="2"
_projconfigmodel.roles="2"
_projconfigmodel.isDeleted=false;

  if (this.data?.mode === 'edit' && this.data?.record?.id){

    _projconfigmodel.id = this.data.record.id;

      this.service.ProjectEdit(_projconfigmodel).subscribe({
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

 


  this.service.ProjectCreate(_projconfigmodel).subscribe({
    next: () => {
      console.log('Saved successfully');

           this.toast.success('Project saved successfully'); 
      this.dialogRef.close(this.form.value);
    
      this.toast.success('Project saved successfully');
      
    },
    error: (err) => {
      console.error('Save failed:', err);
      this.toast.error('Failed to save project');
    }
  });



  }
  else {
      this.form.markAllAsTouched(); 
  this.toast.error('Form is not valid');
  return;
    
  }


  }



  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(controlName)?.setValue(file);
    }
  }

  


    close() {
    this.dialogRef.close();
  }


      

    };













