import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { MaterialModule } from '../../../Material.module';
import { MatButtonModule } from '@angular/material/button';
import { LoaderService } from '../../../services/common/loader.service';
import { CmLoaderComponent } from '../../../common/cm-loader/cm-loader.component';
import { delay } from 'rxjs';
import { ApiService } from '../../../services/common/api.service';

@Component({
  selector: 'app-site-mng',
  imports: [CmInputComponent,CmToggleComponent,CmSelect2Component,ReactiveFormsModule,MaterialModule,MatButtonModule],
  templateUrl: './site-mng.component.html',
  styleUrl: './site-mng.component.css',
  providers :[CmLoaderComponent,LoaderService]
})
export class SiteMngComponent implements OnInit{
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
  posts: any[] = [];
  constructor(
    private fb: FormBuilder,private loader:LoaderService,private apiService : ApiService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      selectedStatus: [''],
      
    });
  }
  ngOnInit(): void {
    this.loadPosts();
  }
  loadPosts() {
    this.apiService.getPosts().subscribe((res :any)=>{
      this.posts = res;
      console.log(this.posts);
    })
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
