import { Component,inject, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { siteconfigservice } from '../../../services/admin/siteconfig.service';
import { getErrorMsg } from '../../../utils/utils';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged,filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-site-mng',
  imports: [CmInputComponent,CmToggleComponent,CmSelect2Component,CommonModule,ReactiveFormsModule,MaterialModule,MatButtonModule],
  templateUrl: './site-mng.component.html',
  styleUrl: './site-mng.component.css',
  providers :[CmLoaderComponent,LoaderService],
  standalone : true
})
export class SiteMngComponent implements OnInit{
form!: FormGroup;
locationOptions: any[] = [];
router = inject(Router);
  MatButtonToggleChange:any;
  ruleEngineStatus = '';
  mapStatus = '';
  selectedStatus: any;
  isProjectOptionsLoaded =false;
  isLocationsOptionsLoaded =false;
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
    },
      siteId: {
      // labelHeader: 'Description',
      placeholder: 'Enter Site Id',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    },
      siteName: {
      // labelHeader: 'Description',
      placeholder: 'Enter Site Name',
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
    pincode: {
      // labelHeader: 'Description',
      placeholder: 'Enter Pincode',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    },
       address: {
      // labelHeader: 'Description',
      placeholder: 'Enter Address',
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
    options: [],
  };
    locationDropdownSettings = {
    // labelHeader: 'Select Project',
    lableClass: 'form-label',
    formFieldClass: '', 
    appearance: 'outline',
    options: [],
  };

  
onLocationSelected(event: any) {
  const selected = event.option?.value;
console.log(selected);
  if (selected && selected.name && selected.road && selected.district && selected.taluka) {
    const formattedAddress = `${selected.name}, ${selected.road}, ${selected.district}, ${selected.taluka}`;
    this.form.get('address')?.setValue(formattedAddress);
  } else {
    this.form.get('address')?.setValue('');
  }
}

onProjectSelected(event: any) {

}


  posts: any[] = [];
  constructor(
    private fb: FormBuilder,private loader:LoaderService,private apiService : ApiService,
    private service :siteconfigservice,private http: HttpClient
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      siteId: ['', Validators.required],
      siteName: ['', Validators.required],
      lat: ['', Validators.required],
      long: ['', Validators.required],
      pincode: ['', Validators.required],
      description: ['', Validators.required],
      locationDropdown: ['', Validators.required],
      address: ['', Validators.required],
    
      

      
      selectedStatus: [''],

      

      
    });
 


  }
  ngOnInit(): void {
      this.getProjList();
    this.loadPosts();
 // Combine valueChanges with debounce
  const lat$ = this.form.get('lat')!.valueChanges.pipe(
    debounceTime(1000),
    distinctUntilChanged()
  );

  const lon$ = this.form.get('long')!.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged()
  );

  combineLatest([lat$, lon$])
    .pipe(
      filter(([lat, lon]) => !!lat && !!lon) // Make sure both values are present
    )
    .subscribe(([lat, lon]) => {
      this.fetchPincode(lat, lon);
    });


    this.form.get('pincode')?.valueChanges
    .pipe(
      debounceTime(300), 
      distinctUntilChanged() 
    )
    .subscribe(value => {
      this.fetchLocationByPincode(value);
    });

    

  }

 fetchPincode(lat: string, lon: string) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  this.http.get<any>(url).subscribe({
    next: (res) => {
      const pincode = res?.address?.postcode;
      if (pincode && /^\d+$/.test(pincode)) {
        this.form.get('pincode')?.setValue(pincode);
        
      } else {
        this.form.get('pincode')?.setValue(''); 
        alert('Invalid or missing pincode');
      }
    },
    error: () => {
      this.form.get('pincode')?.setValue(''); 
      alert('Failed to fetch address');
    }
  });
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

  fetchLocationByPincode(pincode: number) {
  this.service.GetLocationByPincode(pincode).subscribe(response => {
     
    console.log(response)
    
     this.locationOptions = response?.result || [];
     const items=response?.result || [];

 
    const locationsOptions = items.map((item: any) => ({
      road: item.road, 
      taluka: item.taluka,
      name: item.areaName, 
      district: item.district,
      

    }));

 
    this.locationDropdownSettings.options = locationsOptions
    console.log(this.locationDropdownSettings.options

    )
    this.isLocationsOptionsLoaded = true;
  console.log(this.isLocationsOptionsLoaded);
  }, error => {
    console.error('Error fetching project list', error);
  });
}  
        getProjList() {
  this.service.GetProjectList().subscribe(response => {
    const items = response?.result || [];

 console.log("project")
    const projectOptions = items.map((item: any) => ({
      name: item.name || item.shortCode, 
      value: item.id
    }));

 
    this.projectSelectSettings.options = projectOptions;
    this.isProjectOptionsLoaded = true;
//      if (this.data?.mode === 'edit' && this.data?.record) {


// const selectedProj = (this.projectSelectSettings.options as any[]).find(
//   proj => proj.name === this.data.record.projectName
// );
// console.log(selectedProj);

// this.editid=this.data.record.id;
//     this.form.patchValue({
//       description: this.data.record.description,
//       isActive: this.data.record.isActive,
//       maplabel: this.data.record.mapLabel,
//       apilabel: this.data.record.apiLabel,
//       isSameas: this.data.record.isMapLabel,
//       selectedProject: selectedProj
//     });

//     console.log('Edit form data patched:', this.data.record);
//   }
  }, error => {
    console.error('Error fetching project list', error);
  });
}  
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  submit() {
    if (this.form.valid) {
      
    }
  }
    get f() {
  return this.form.controls;
  }

  close() {
    this.router.navigate(['/admin/siteconfig']);
  }

}
