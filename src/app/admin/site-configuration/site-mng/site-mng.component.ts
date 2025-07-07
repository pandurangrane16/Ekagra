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
import { siteconfigmodel } from '../../../models/admin/siteconfig.model';
import { locationmodel } from '../../../models/admin/location.model';
import { v4 as uuidv4 } from 'uuid';


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
noLocationFound: boolean = false;
foreditmode : boolean =false;
  MatButtonToggleChange:any;
  ruleEngineStatus = '';
  newlocationid:any;
  mapStatus = '';
  editId :any;
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
    },
      areaname: {
      // labelHeader: 'Description',
      placeholder: 'Enter AreaName',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    },
      district: {
      // labelHeader: 'Description',
      placeholder: 'Enter District',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    },
      roadname: {
      // labelHeader: 'Description',
      placeholder: 'Enter RoadName',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    },
      taluka: {
      // labelHeader: 'Description',
      placeholder: 'Enter Taluka',
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
     formControlName: 'isActive',
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

  
onLocationSelected(selected: any) {
  console.log('Selected location:', selected);

  if (selected?.name && selected?.road && selected?.district && selected?.taluka) {
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
      isActive: [false,Validators.required],
      locationDropdown: [''],
      address: [''],
      areaname: [''],
      roadname: [''],
      taluka: [''],
      district: [''],

    
      

      
      selectedStatus: [''],

      

      
    });
 


  }
  ngOnInit(): void {

      
    
  this.setupFormValueListeners(); 
  //this.loadPosts();               
  this.getProjList();


    

  }

  

setupFormValueListeners() {

   const state = history.state;

    if (state?.mode === 'edit' && this.foreditmode === false) {
    return; 
  }
   else
     {
     const lat$ = this.form.get('lat')!.valueChanges.pipe(
    debounceTime(1000),
    distinctUntilChanged()
  );

  const lon$ = this.form.get('long')!.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged()
  );

  combineLatest([lat$, lon$])
    .pipe(filter(([lat, lon]) => !!lat && !!lon))
    .subscribe(([lat, lon]) => {
      this.fetchPincode(lat, lon);
    });

  this.form.get('pincode')?.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(value => {
      if (!value || value.toString().trim() === '') {
        this.form.patchValue({
          areaname: null,
          roadname: null,
          taluka: null,
          district: null,
          address: null,
          locationDropdown: null
        });

        this.isLocationsOptionsLoaded = false;
        this.noLocationFound = false;
        this.locationDropdownSettings.options = [];
        return;
      }

      if (value.toString().length === 6) {
        this.isLocationsOptionsLoaded = false;
        this.noLocationFound = false;

        this.form.patchValue({
          areaname: null,
          roadname: null,
          taluka: null,
          district: null,
          address: null,
          locationDropdown: null
        });

        this.fetchLocationByPincode(value);
      }
    });
   }
 
}

 fetchPincode(lat: string, lon: string) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  this.http.get<any>(url).subscribe({
    next: (res) => {
      const pincode = res?.address?.postcode;
      console.log("pincode"+pincode)
      if (pincode && /^\d+$/.test(pincode)) {
        this.form.get('pincode')?.setValue(pincode);
                this.form.patchValue({
            areaname : null,
            roadname :null,
            taluka :null,
            district :null,
            address :null,
            locationDropdown :null
          })
        
      this.fetchLocationByPincode(pincode);

        
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
fetchlocationByLocationId(locationid: number) {

  this.service.GetLocationbyLocationId(locationid).subscribe(response => {
    console.log('API Response:', response);

   
    let items: any[] = [];
    const result = response?.result;

    if (Array.isArray(result)) {
      items = result;
    } else if (result && typeof result === 'object') {
      items = [result];
    }

    this.locationOptions = items;

  
    if (items.length === 1) {
      const item = items[0];
 const formattedAddress = `${item.areaName}, ${item.road}, ${item.district}, ${item.taluka}`;

  this.service.GetLocationByPincode(item.pinCode ).subscribe(response => {
     
    console.log(response)
    
     this.locationOptions = response?.result || [];
     const items=response?.result || [];


  

  this.noLocationFound = false;
  
    const locationsOptions = items.map((item: any) => ({
      road: item.road, 
      taluka: item.taluka,
      name: item.areaName, 
      district: item.district,
      locationId:item.locationId
      

    }));

 
    this.locationDropdownSettings.options = locationsOptions
     this.isLocationsOptionsLoaded = true;
   const selectedOption = (this.locationDropdownSettings.options as any[])?.find(
      proj => proj.name === item.areaName
    );
   // const formattedAddress = `${selectedOption.areaName}, ${selectedOption.road}, ${selectedOption.district}, ${selectedOption.taluka}`;
    console.log(selectedOption);
      this.form.patchValue({

        locationDropdown:selectedOption,
        address :formattedAddress,
        pincode: item.pinCode 
      });
console.log(this.form.controls);
this.form.get('address')?.setValue(formattedAddress);
      this.noLocationFound = false;
      this.foreditmode =true;
       this.setupFormValueListeners();
   
  }, error => {
    console.error('Error fetching project list', error);
  });

 


  
     
      return;
    }

    
  

 

  }, error => {
    console.error('Error fetching location by locationId:', error);
    this.noLocationFound = true;
    this.isLocationsOptionsLoaded = false;
  });
}

  fetchLocationByPincode(pincode: number) {
  this.service.GetLocationByPincode(pincode).subscribe(response => {
     
    console.log(response)
    
     this.locationOptions = response?.result || [];
     const items=response?.result || [];


         if (items.length === 0) {
          this.form.patchValue({
            areaname : null,
            roadname :null,
            taluka :null,
            district :null
          })
     
      this.noLocationFound = true;
       this.isLocationsOptionsLoaded = false;
      // this.locationDropdownSettings.options = []; 

      return;
    }

  this.noLocationFound = false;
  
    const locationsOptions = items.map((item: any) => ({
      road: item.road, 
      taluka: item.taluka,
      name: item.areaName, 
      district: item.district,
      locationId:item.locationId
      

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

    const state = history.state;
console.log(state.record)
  if (state?.mode === 'edit' && state?.record) {
    this.editId = state.record.id;

    const selectedProj = (this.projectSelectSettings.options as any[])?.find(
      proj => proj.name === state.record.projectName
    );
       this.form.patchValue({
      description: state.record.description,
      isActive: state.record.isActive,
      siteId: state.record.siteId,
      siteName: state.record.siteName,
      lat: state.record.lat,
      long: state.record.long,
      name: selectedProj
    });


    const locationid = state.record.locationId
    this.fetchlocationByLocationId(locationid)
    console.log(this.form.controls)
    console.log("locationfound"+ this.noLocationFound)
    console.log('Selected project:', selectedProj);
    


    console.log('Edit form data patched30:', state.record);
  }

  }, error => {
    console.error('Error fetching project list', error);
  });
}  
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  // Helper to create and call SiteCreate after we have locationId
  const createSite = (finalLocationId: string) => {
    let _siteconfigmodel = new siteconfigmodel();

    _siteconfigmodel.description = this.form.controls['description'].value;
    _siteconfigmodel.isActive = this.form.controls['isActive'].value;
    _siteconfigmodel.creationTime = "2025-06-20T05:32:25.067Z";
    _siteconfigmodel.creatorUserId = 0;
    _siteconfigmodel.deleterUserId = 0;
    _siteconfigmodel.deletionTime = "2025-06-20T05:32:25.067Z";
    _siteconfigmodel.lastModificationTime = "2025-06-20T05:32:25.067Z";
    _siteconfigmodel.lastModifierUserId = "2";
    _siteconfigmodel.isDeleted = false;
    _siteconfigmodel.projectId = this.form.controls['name'].value?.value;
    _siteconfigmodel.siteId = this.form.controls['siteId'].value;
    _siteconfigmodel.siteName = this.form.controls['siteName'].value;
    _siteconfigmodel.lat = this.form.controls['lat'].value;
    _siteconfigmodel.long = this.form.controls['long'].value;

    const state = history.state;
    if (state?.mode === 'edit' && state?.record){

    _siteconfigmodel.id = state.record.id;
    _siteconfigmodel.locationId =state.record.locationId;

      this.service.SiteEdit(_siteconfigmodel).subscribe({
    next: () => {
      console.log('Updated successfully');

           //this.toast.success('ProjectField saved successfully'); 
       this.router.navigate(['/admin/siteconfig']);
    
      //this.toast.success('ProjectField saved successfully');
      
    },
    error: (err) => {
      console.error('Update failed:', err);
      //this.toast.error('Failed to save project');
    }
  });

  return;

  }
    _siteconfigmodel.locationId = finalLocationId;

    this.service.SiteCreate(_siteconfigmodel).subscribe({
      next: () => {
        console.log('Site saved successfully');
        this.router.navigate(['/admin/siteconfig']);
      },
      error: (err) => {
        console.error('Site save failed:', err);
      }
    });
  };

  // If noLocationFound, first create location
  if (this.noLocationFound) {
    let _locationmodel = new locationmodel();

    _locationmodel.isActive = true;
    _locationmodel.creationTime = "2025-06-20T05:32:25.067Z";
    _locationmodel.creatorUserId = 0;
    _locationmodel.deleterUserId = 0;
    _locationmodel.deletionTime = "2025-06-20T05:32:25.067Z";
    _locationmodel.lastModificationTime = "2025-06-20T05:32:25.067Z";
    _locationmodel.lastModifierUserId = "2";
    _locationmodel.isDeleted = false;
    _locationmodel.areaname = this.form.controls['areaname'].value;
    _locationmodel.road = this.form.controls['roadname'].value;
    _locationmodel.taluka = this.form.controls['taluka'].value;
    _locationmodel.district = this.form.controls['district'].value;
    _locationmodel.pincode = this.form.controls['pincode'].value;
    _locationmodel.locationId = uuidv4();

    this.service.LocationCreate(_locationmodel).subscribe({
      next: (res: any) => {
        const newId = res?.result?.locationId || _locationmodel.locationId;
        console.log('Location saved successfully with ID:', newId);
        createSite(newId); // ✅ Only proceed after location is saved
      },
      error: (err) => {
        console.error('Location save failed:', err);
      }
    });
  } else {
    // Use selected location from dropdown
    const selectedLocationId = this.form.controls['locationDropdown'].value?.locationId;
    createSite(selectedLocationId);
  }
}

    get f() {
  return this.form.controls;
  }

  close() {
    this.router.navigate(['/admin/siteconfig']);
  }

}
