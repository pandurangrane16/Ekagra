  
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder,FormArray, FormsModule,FormGroup, Validators ,ReactiveFormsModule,} from '@angular/forms';
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
import { LoaderService } from '../../../services/common/loader.service';
import { withLoader } from '../../../services/common/common';
import { SOPService } from '../../../services/admin/sop.service';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sop-form.component',
  imports: [CommonModule,CmSelect2Component,CmInputComponent,MatTooltipModule,MatCardModule, MatIconModule,CmToggleComponent,ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './sop-form.component.html',
  styleUrl: './sop-form.component.css',
  standalone:true,
  providers:[ToastrService]
})
export class SopFormComponent {
   loaderService = inject(LoaderService);
  router = inject(Router);
  form!: FormGroup;
  MatButtonToggleChange:any;
  basepath:any;
  ruleEngineStatus:any;
  mapStatus :any;
 previewUrls: { [key: string]: string } = {};
  state:any;
  selectedFilePaths = {
    mapIcon: '',
    projectIcon: ''
  };
  isPolicyOptionLoaded:any;
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
       sequence: {
      // labelHeader: 'Name',
      placeholder: 'Enter Sequence',
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
       ActionSettings = {
          labelHeader: 'Select Action',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
           PolicySettings = {
          labelHeader: 'Select Action',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
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
    private service: SOPService,
    private toast: ToastrService,
    //private dialogRef: MatDialogRef<ProjectConfigurationFormComponent>,
   // @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.form = this.fb.group({
  name: ['', [ Validators.required,Validators.pattern(/^[a-zA-Z0-9 ]+$/),this.noWhitespaceValidator()  ]  ],
  description: [ '', [ Validators.required, this.noWhitespaceValidator()  ]  ],
  isActive: [Validators.required],
  actions: this.fb.array([])  
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


    GetPolicyList() {
    this.service.GetPolicyList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
      const items = response?.result || [];

      const projectOptions = items.map((item: any) => ({
        name: item.policyName,
        value: item.id
      }));


      projectOptions.unshift({
        name: 'All',
        value: null
      });

      this.PolicySettings.options = projectOptions;
      this.form.controls['name'].setValue({
        name: 'All',
        value: null
      });

    
      this.isPolicyOptionLoaded = true;
    }, error => {
      console.error('Error fetching policy list', error);
    });
  }

ReturnValue($event:any) {
  console.log($event);
}

get actions(): FormArray<FormGroup> {
  return this.form.get('actions') as FormArray<FormGroup>;
}

removeActionRow(index: number) {
  this.actions.removeAt(index);
}

  onProjectSelected($event: Event) {

  }


ngOnInit(): void {
 this.GetPolicyList();

  this.form = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/), this.noWhitespaceValidator()]],
    description: ['', [Validators.required, this.noWhitespaceValidator()]],
    isActive: [Validators.required],
    actions: this.fb.array([])  
  });

  this.addActionRow(); 
}
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  addActionRow() {
  const row = this.fb.group({
    actionName: [null, Validators.required],
    sequence: ['', Validators.required]     
  });
  this.actions.push(row);
}




//   submit() {
//   try {
//   if (!this.form.invalid) {
//     this.form.markAllAsTouched(); 
     
//       let _projconfigmodel = new projconfigmodel();

// _projconfigmodel.name = this.form.controls['name'].value;
// _projconfigmodel.description = this.form.controls['description'].value;
// //_projconfigmodel.map=this.form.controls['mapEnabled'].value;
// //_projconfigmodel.ruleEngine=this.form.controls['ruleEngineEnabled'].value;
// _projconfigmodel.mapIcon=this.form.controls['mapIcon'].value;
// _projconfigmodel.projectIcon=this.form.controls['projectIcon'].value;
// _projconfigmodel.isActive=this.form.controls['isActive'].value;
// _projconfigmodel.creationTime="2025-06-20T05:32:25.067Z"
// _projconfigmodel.creatorUserId=0
// _projconfigmodel.deleterUserId=0
// _projconfigmodel.deletionTime="2025-06-20T05:32:25.067Z"
// _projconfigmodel.id=0
// _projconfigmodel.lastModificationTime="2025-06-20T05:32:25.067Z"
// _projconfigmodel.lastModifierUserId="2"
// _projconfigmodel.sequence=0
// _projconfigmodel.shortCode="2"
// _projconfigmodel.roles="2"
// _projconfigmodel.isDeleted=false;


//      this.service.CheckProjectName(this.form.controls['name'].value,this.state?.record?.id).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
//         if (response.result === true) {
//           this.toast.error(" Name already exists in the System.");
//           this.form.setErrors({ duplicateName: true });
//           return;
//         }
       
//      else{
  

//     if (this.state?.mode === 'edit' && this.state?.record?.id){

//     _projconfigmodel.id = this.state.record.id;

//       this.service.ProjectEdit(_projconfigmodel).pipe(withLoader(this.loaderService)).subscribe({
//     next: () => {
//       console.log('Updated successfully');

//       this.toast.success('Project Updated successfully'); 
//       this.router.navigate(['/admin/projconfig']);
//       //this.dialogRef.close(this.form.value);
    
//       //this.toast.success('ProjectField saved successfully');
      
//     },
//     error: (err) => {
//       console.error('Update failed:', err);
//       this.toast.error('Update failed:', err);
//     }
//   });

//   return;
   
//   }

//   else{
//   this.service.ProjectCreate(_projconfigmodel).pipe(withLoader(this.loaderService)).subscribe({
//     next: () => {
//       console.log('Saved successfully');

//       this.toast.success('Project saved successfully'); 
//       //this.dialogRef.close(this.form.value);
//      this.router.navigate(['/admin/projconfig']);
//       //this.toast.success('Project saved successfully');
      
//     },
//     error: (err) => {
//       console.error('Save failed:', err);
//       this.toast.error('Failed to save project');
//     }
//   });
//   return;
//   }


  

//      }
        

//       });



 
 




//   }
//   else {
//       this.form.markAllAsTouched(); 
//   this.toast.error('Form is not valid');
//   return;
    
//   }

// } catch (error) {
//     console.error('Unexpected error in submit:', error);
//     this.toast.error('An unexpected error occurred');
//   }
//   }

submit(){
  
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



























