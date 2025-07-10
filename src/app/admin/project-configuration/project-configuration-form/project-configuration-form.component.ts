
import { Component, inject } from '@angular/core';
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
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-project-configuration-form',
  imports: [CommonModule,CmInputComponent,MatTooltipModule,MatCardModule, MatIconModule,CmToggleComponent,ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './project-configuration-form.component.html',
  styleUrl: './project-configuration-form.component.css',
  standalone:true,
  providers:[ToastrService]
})
export class ProjectConfigurationFormComponent {
  router = inject(Router);
  form!: FormGroup;
  MatButtonToggleChange:any;
  ruleEngineStatus:any;
  mapStatus :any;
 previewUrls: { [key: string]: string } = {};
  state:any;
  selectedFilePaths = {
    mapIcon: '',
    projectIcon: ''
  };
    inputFields = {
    name: {
      // labelHeader: 'Name',
      placeholder: 'Enter project name',
      restrictToAlphanumeric:true,
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
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

  toggleSettingsWithoutHeader = {
   
    name: 'isActive',
    //defaultValue: true,
    formControlName: 'isActive',
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


  
  constructor(
    private fb: FormBuilder,
    private service: projconfigservice,
    private toast: ToastrService,
    //private dialogRef: MatDialogRef<ProjectConfigurationFormComponent>,
   // @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.form = this.fb.group({
  name: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9 ]+$/),
      this.noWhitespaceValidator()  
    ]
  ],
  description: [
    '',
    [
      Validators.required,
      this.noWhitespaceValidator()  
    ]
  ],
  mapIcon: [null, Validators.required],
  projectIcon: [null, Validators.required],
  isActive: [Validators.required]
});

  }

  get f() {
  return this.form.controls;
  }

    noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

ReturnValue($event:any) {
  console.log($event);
}
onFileSelect(event: any, type: 'mapIcon' | 'projectIcon') {
  const file = event.target.files[0];
  const control = this.form.get(type);

  if (file) {
    // ✅ Check if the file is an image
    if (!file.type.startsWith('image/')) {
      this.toast.error('Please upload a valid image file.');
      return;
    }

    // ✅ Set preview image
    const objectUrl = URL.createObjectURL(file);
    this.previewUrls[type] = objectUrl;
    console.log('Preview URL set for', type, ':', objectUrl);

    // ✅ Prepare FormData (make sure to use 'File' if backend expects that)
    const formData = new FormData();
    formData.append('File', file); // Use 'File' with capital F if backend expects it

    // ✅ Call upload service
    this.service.UploadFile(formData).subscribe({
      next: (response) => {
        if (response?.result?.success) {
          const uploadedFileName = response.result.fileName;

          // ✅ Update form control with uploaded file name
          control?.setValue(uploadedFileName);
          control?.setErrors(null);
          control?.markAsTouched();
          control?.markAsDirty();

          this.selectedFilePaths[type] = uploadedFileName;
        }
      },
      error: (err) => {
            this.form.patchValue({
     [type]: null
   
    
      
    });
      console.error('Upload error:', err);
        
        this.toast.error('Upload error:', err);
      }
    });
  }
}



  ngOnInit(): void {

      this.state = history.state;
         const state = this.state;
         if (state?.mode === 'edit' && state?.record) {



    this.form.patchValue({
   
      name: state.record.name,
      description: state.record.description,
    
      isActive: state.record.isActive,
    
      
    });
    this.loadExistingIcons();

    console.log('Edit form data patched:', state.record);
  }

    this.form.controls['name'].valueChanges.subscribe((value: string) => {
    if (value !== null) {
      const transformed = value.replace(/\s+/g, '').toUpperCase();

      if (value !== transformed) {
        this.form.controls['name'].setValue(transformed, { emitEvent: false });
      }
    }
  });
 
  

}
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

loadExistingIcons(): void {
  const basePath = 'https://172.19.32.210:8002/UploadedFiles/Icons/';

  if (this.state?.record?.mapIcon) {
    const mapIconUrl = basePath + this.state.record.mapIcon;
    this.selectedFilePaths['mapIcon'] =  this.state?.record?.mapIcon;
    this.previewUrls['mapIcon'] = mapIconUrl;
  }

  if (this.state?.record?.projectIcon) {
    const projectIconUrl = basePath + this.state.record.projectIcon;
    this.selectedFilePaths['projectIcon'] = this.state?.record?.projectIcon;
    this.previewUrls['projectIcon'] = projectIconUrl; 
  }

  this.form.patchValue({
    mapIcon: this.state?.record?.mapIcon,
    projectIcon: this.state?.record?.projectIcon
  });

  console.log('Edit Preview URLs:', this.previewUrls);
}


  submit() {
 
  if (!this.form.invalid) {
    this.form.markAllAsTouched(); 
     
      let _projconfigmodel = new projconfigmodel();

_projconfigmodel.name = this.form.controls['name'].value;
_projconfigmodel.description = this.form.controls['description'].value;
//_projconfigmodel.map=this.form.controls['mapEnabled'].value;
//_projconfigmodel.ruleEngine=this.form.controls['ruleEngineEnabled'].value;
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


     this.service.CheckProjectName(this.form.controls['name'].value,this.state?.record?.id).subscribe(response => {
        if (response.result === true) {
          this.toast.error(" Name already exists in the System.");
          this.form.setErrors({ duplicateName: true });
          return;
        }
       
     else{
  

    if (this.state?.mode === 'edit' && this.state?.record?.id){

    _projconfigmodel.id = this.state.record.id;

      this.service.ProjectEdit(_projconfigmodel).subscribe({
    next: () => {
      console.log('Updated successfully');

      this.toast.success('Project Updated successfully'); 
      this.router.navigate(['/admin/projconfig']);
      //this.dialogRef.close(this.form.value);
    
      //this.toast.success('ProjectField saved successfully');
      
    },
    error: (err) => {
      console.error('Update failed:', err);
      this.toast.error('Update failed:', err);
    }
  });

  return;
   
  }

  else{
  this.service.ProjectCreate(_projconfigmodel).subscribe({
    next: () => {
      console.log('Saved successfully');

      this.toast.success('Project saved successfully'); 
      //this.dialogRef.close(this.form.value);
     this.router.navigate(['/admin/projconfig']);
      //this.toast.success('Project saved successfully');
      
    },
    error: (err) => {
      console.error('Save failed:', err);
      this.toast.error('Failed to save project');
    }
  });
  return;
  }


  

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
    this.router.navigate(['/admin/projconfig']);
  }


      

    };













