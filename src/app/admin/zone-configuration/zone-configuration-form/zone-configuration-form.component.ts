
import { Component, Inject } from '@angular/core';
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
import { zoneconfigservice } from '../../../services/admin/zoneconfig.service';
import { ToastrService } from 'ngx-toastr';
import { zoneconfigmodel } from '../../../models/admin/zoneconfig.model';

@Component({
  selector: 'app-zone-configuration-form',
  imports: [CommonModule,CmInputComponent,MatIconModule, CmToggleComponent,ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './zone-configuration-form.component.html',
  styleUrl: './zone-configuration-form.component.css'
})



export class ZoneConfigurationFormComponent {
  form!: FormGroup;
  MatButtonToggleChange:any;
  ruleEngineStatus = '';
  mapStatus = '';
  selectedStatus: any;
  inputFields = {
    zonename: {
      // labelHeader: 'Name',
      placeholder: 'Enter Zone name',
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
 

  toggleSettingsWithoutHeader = {
   
    name: 'isActive',
    defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
  
 

 
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ZoneConfigurationFormComponent>,
    private service:zoneconfigservice,
    private toast:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      zonename: ['', Validators.required],
      isActive: [false,Validators.required],
      
      
    });
  }

  get f() {
  return this.form.controls;
  }
  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(controlName)?.setValue(file);
    }
  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
      return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
    }
  onProjectSelected(event: any) {
    console.log('Selected Project:', event);
  }
  submit() {
      this.toast.success("chgdgsf")
      if (!this.form.invalid) {
        this.form.markAllAsTouched(); 
         
          let _zoneconfigmodel = new zoneconfigmodel();
    
  
    _zoneconfigmodel.description = this.form.controls['description'].value;
    _zoneconfigmodel.isActive=this.form.controls['isActive'].value;
    _zoneconfigmodel.creationTime="2025-06-20T05:32:25.067Z"
    _zoneconfigmodel.creatorUserId=0
    _zoneconfigmodel.deleterUserId=0
    _zoneconfigmodel.deletionTime="2025-06-20T05:32:25.067Z"
    _zoneconfigmodel.id=0
    _zoneconfigmodel.lastModificationTime="2025-06-20T05:32:25.067Z"
    _zoneconfigmodel.lastModifierUserId="2"
    _zoneconfigmodel.isDeleted=false;
    _zoneconfigmodel.zoneCategory="string"
    _zoneconfigmodel.zoneCordinate="string"
    _zoneconfigmodel.zoneName=this.form.controls['zonename'].value;
    _zoneconfigmodel.userId=0;
    _zoneconfigmodel.projectId=0

    

    
    
     
    
    
      this.service.ZoneCreate(_zoneconfigmodel).subscribe({
        next: () => {
          console.log('Saved successfully');
    
               this.toast.success('Zone saved successfully'); 
          this.dialogRef.close(this.form.value);
        
          this.toast.success('Zone saved successfully');
          
        },
        error: (err) => {
          console.error('Save failed:', err);
          this.toast.error('Failed to save Zone.');
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

}
