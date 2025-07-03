
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule,FormGroup, Validators ,ReactiveFormsModule,} from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { CommonModule } from '@angular/common';
import { mapconfigservice } from '../../../services/admin/mapconfig.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { mapconfigmodel } from '../../../models/admin/mapconfig.model';
import { getErrorMsg } from '../../../utils/utils';


@Component({
  selector: 'app-map-configuration-form',
  imports: [CommonModule,CmInputComponent,MatIconModule, CmToggleComponent,ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './map-configuration-form.component.html',
  styleUrl: './map-configuration-form.component.css',
  providers:[ToastrService]
})


export class MapConfigurationFormComponent {
  form!: FormGroup;
  MatButtonToggleChange:any;
  ruleEngineStatus = '';
  mapStatus = '';
  selectedStatus: any;
  editid :any;

  inputFields = {
    name: {
      // labelHeader: 'Name',
      placeholder: 'Enter project name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    displayname: {

      placeholder: 'Enter Display name',
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
    },
    minzoom: {
      // labelHeader: 'Description',
      placeholder: 'Enter MinZoom',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    maxzoom: {
      // labelHeader: 'Description',
      placeholder: 'Enter MaxZoom',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    lat: {
      // labelHeader: 'Description',
      placeholder: 'Enter Latitude',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    long: {
      // labelHeader: 'Description',
      placeholder: 'Enter Longitude',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    sourceurl: {
      
      placeholder: 'Enter SourceUrl',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    wmslayer: {
      
      placeholder: 'Enter WmsLayer',
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
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MapConfigurationFormComponent>,
    private service :mapconfigservice,
     private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      displayname: ['', Validators.required],
      minzoom: ['', Validators.required],
      maxzoom: ['', Validators.required],
      sourceurl: ['', Validators.required],
      lat: ['', Validators.required],
      long: ['', Validators.required],
      wmslayer :['',Validators.required],
      isActive: [false,Validators.required],

      
      
    });
  }

  get f() {
  return this.form.controls;
  }

    ngOnInit(): void {
    
 
        if (this.data?.mode === 'edit' && this.data?.record) {




this.editid=this.data.record.id;
    this.form.patchValue({
      description: this.data.record.description,
      isActive: this.data.record.isActive,
      wmslayer: this.data.record.wmsLayer,
      lat: this.data.record.lat,
      long: this.data.record.long,
      minzoom: this.data.record.minZoom,
      maxzoom: this.data.record.maxZoom,
      sourceurl: this.data.record.sourceURL,
      displayname: this.data.record.displayName,
      name: this.data.record.name,
      
    });

    console.log('Edit form data patched:', this.data.record);
  }

}

  onProjectSelected(event: any) {
    console.log('Selected Project:', event);
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(controlName)?.setValue(file);
    }
  }

  submit() {
      this.toast.success("chgdgsf")
      if (!this.form.invalid) {
        this.form.markAllAsTouched(); 
         
          let _mapconfigmodel = new mapconfigmodel();
    
    _mapconfigmodel.name = this.form.controls['name'].value;
    _mapconfigmodel.description = this.form.controls['description'].value;
    _mapconfigmodel.isActive=this.form.controls['isActive'].value;
    _mapconfigmodel.creationTime="2025-06-20T05:32:25.067Z"
    _mapconfigmodel.creatorUserId=0
    _mapconfigmodel.deleterUserId=0
    _mapconfigmodel.deletionTime="2025-06-20T05:32:25.067Z"
    _mapconfigmodel.id=0
    _mapconfigmodel.lastModificationTime="2025-06-20T05:32:25.067Z"
    _mapconfigmodel.lastModifierUserId="2"
    _mapconfigmodel.isDeleted=true;
    _mapconfigmodel.displayName=this.form.controls['displayname'].value;;
    _mapconfigmodel.lat=this.form.controls['lat'].value;
    _mapconfigmodel.long=this.form.controls['long'].value;
    _mapconfigmodel.minZoom=this.form.controls['minzoom'].value;
    _mapconfigmodel.maxZoom=this.form.controls['maxzoom'].value;
    _mapconfigmodel.sourceURL=this.form.controls['sourceurl'].value;
    

    
      if (this.data?.mode === 'edit' && this.data?.record?.id){

    _mapconfigmodel.id = this.data.record.id;

      this.service.MapEdit(_mapconfigmodel).subscribe({
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
     
    
    
      this.service.MapCreate(_mapconfigmodel).subscribe({
        next: () => {
          console.log('Saved successfully');
    
               this.toast.success('Map saved successfully'); 
          this.dialogRef.close(this.form.value);
        
          this.toast.success('Map saved successfully');
          
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

  close() {
    this.dialogRef.close();
  }

  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
      return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
    }

  

}
