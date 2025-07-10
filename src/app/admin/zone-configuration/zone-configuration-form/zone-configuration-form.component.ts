
import { Component, Inject, inject, OnInit } from '@angular/core';
//import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule,FormGroup, Validators ,ReactiveFormsModule,} from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { CmLeafletComponent } from '../../../common/cm-leaflet/cm-leaflet.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { getErrorMsg } from '../../../utils/utils';
import { zoneconfigservice } from '../../../services/admin/zoneconfig.service';
import { ToastrService } from 'ngx-toastr';
import { InputRequest } from '../../../models/request/inputreq.model';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';

//import { ToastrService } from 'ngx-toastr';
import { zoneconfigmodel } from '../../../models/admin/zoneconfig.model';
//import * as L from 'leaflet';

import {  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-zone-configuration-form',
  imports: [CommonModule,CmInputComponent,MatIconModule,CmLeafletComponent, MatCardModule,CmToggleComponent,ReactiveFormsModule,  MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './zone-configuration-form.component.html',
  styleUrl: './zone-configuration-form.component.css',
    standalone : true
})



export class ZoneConfigurationFormComponent implements OnInit {
  form!: FormGroup;
router = inject(Router);
  MatButtonToggleChange:any;
  isMap : boolean = false;
  editmode: boolean = false;
  ruleEngineStatus = '';
  items:any;
   MaxResultCount=10;
    SkipCount=0;
    perPage=10;
    pageNo=0;
  _request: any = new InputRequest();
  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  mapStatus = '';
  public state:any;
  id: number = 0;
  zoneCordinate:any;
   private L: any;
drawnItems: any;
polygonCoordinates:any;
drawControl: any;
coordinates: any[] = [];
zoneName: string = '';
description: string = '';
canSave: boolean = false;
isMapVisible: boolean = false;
  map!: L.Map;
 
  inputFields = {
    zonename: {
      // labelHeader: 'Name',
      placeholder: 'Enter Zone name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      restrictToAlphanumeric:true,
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
    //defaultValue: true,
    formControlName: 'isActive',
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };
  
 

 
  
  constructor(
    private fb: FormBuilder,
    //@Inject(PLATFORM_ID) private platformId: Object,
   
    private service:zoneconfigservice,private toast :ToastrService,
    // private router: Router
    @Inject(PLATFORM_ID) private platformId: Object,
    //private dialogRef: MatDialogRef<ZoneConfigurationFormComponent>,
   // private toast:ToastrService,
   //  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      zonename: ['', Validators.required],
      isActive: [Validators.required],

      
      
    });
  }

  get f() {
  return this.form.controls;
  }
     ngOnInit(): void {

         
        this.state = history.state;
         const state = this.state;
         if (state?.mode === 'edit' && state?.record) {
          console.log("edit")
          this.editmode = true;
         this.zoneCordinate=state.record.zoneCordinate
    this.form.patchValue({
   
      zonename: state.record.zoneName,
      description: state.record.description,
      isActive :state.record.isActive
        
    });
      
  }
 
  }

  onPolygonDrawn(coords: any) {
  console.log('Received polygon coordinates in parent:', coords);
   const stringifiedCoords = JSON.stringify(coords); 
  this.polygonCoordinates = stringifiedCoords; 
   
}
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
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
Draw() {
  const zoneName = this.form.controls['zonename']?.value?.trim();
  const description = this.form.controls['description']?.value?.trim();

  if (!zoneName || !description) {
    this.toast.error("Please enter both Zone Name and Description.");
    return;
  }

  setTimeout(() => {
    this.isMap = true;
  }, 1000);

  console.log(this.form.controls);
}

submit() {
  //  Validation: Coordinates are required in create mode
   const state = history.state;
  if (state?.mode !== 'edit' && !this.polygonCoordinates) {
    this.toast.error('Please draw the zone coordinates before submitting.');
    return;
  }

  //  Validation: If form is invalid, mark fields and stop
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  //  Create zoneconfigmodel
  const _zoneconfigmodel = new zoneconfigmodel();
  _zoneconfigmodel.description = this.form.controls['description'].value;
  _zoneconfigmodel.isActive = this.form.controls['isActive'].value;
  _zoneconfigmodel.zoneName = this.form.controls['zonename'].value;
  _zoneconfigmodel.userId = 0;
  _zoneconfigmodel.projectId = 0;
  _zoneconfigmodel.id = 0;

  // Dummy timestamps & user info (replace with real values if needed)
  _zoneconfigmodel.creationTime = "2025-06-20T05:32:25.067Z";
  _zoneconfigmodel.creatorUserId = 0;
  _zoneconfigmodel.lastModificationTime = "2025-06-20T05:32:25.067Z";
  _zoneconfigmodel.lastModifierUserId = "2";
  _zoneconfigmodel.deleterUserId = 0;
  _zoneconfigmodel.deletionTime = "2025-06-20T05:32:25.067Z";
  _zoneconfigmodel.isDeleted = false;
  _zoneconfigmodel.zoneCategory = "string";

  //  Handle zone coordinates logic
 
  if (state?.mode === 'edit' && state?.record) {
    _zoneconfigmodel.zoneCordinate = this.polygonCoordinates
      ? this.polygonCoordinates
      : state.record.zoneCordinate;

    _zoneconfigmodel.id = state.record.id;

    //  Update Zone
    this.service.ZoneEdit(_zoneconfigmodel).subscribe({
      next: () => {
        this.toast.success('Zone updated successfully');
        this.router.navigate(['/admin/zoneconfig']);
         console.log('Closing dialog...');
       // this.dialogRef.close(this.form.value);
        return;
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.toast.error('Update failed');
         return;
      }
    });

  }

  else{
      //  Create Zone
  _zoneconfigmodel.zoneCordinate = this.polygonCoordinates;

  this.service.ZoneCreate(_zoneconfigmodel).subscribe({
    next: () => {
      this.toast.success('Zone saved successfully');
        this.router.navigate(['/admin/zoneconfig']);
      //this.dialogRef.close(this.form.value);
    },
    error: (err) => {
      console.error('Save failed:', err);
      this.toast.error('Failed to save Zone.');
    }
  });
  }


}
getZoneConfigList() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      //this._request.searchItem = this.searchText;
      this.service.GetAll().subscribe(response => {

         const items = response.result?.items;
         
         this.items=items;

 const totalCount=response.result?.totalCount;



this.drawnItems = new this.L.FeatureGroup();
this.map.addLayer(this.drawnItems);

  //this.map.addLayer(this.drawnItems);

  this.drawControl = new this.L.Control.Draw({
draw: {
   polygon: {
               
            },
    marker: false,
    circle: false,
    rectangle: false,
    polyline: false,
    circlemarker: false
  },
  edit: {
    featureGroup: this.drawnItems
  },
      remove: {
        tooltip: {
          text: ''
        }
      }
    
  
  });


        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           

            //let _data = JSON.parse(element);
            element.zoneName = element.zoneName;
            element.description = element.description;
             element.isActive = !!element.isActive; 
         
              element.button = [
    { label: 'Edit', icon: 'edit', type: 'edit' },
    { label: 'Delete', icon: 'delete', type: 'delete' }
  ];

        

    });

    // var drawControl = new this.L.Control.Draw(options);
    // this.map.addControl(drawControl);

  this.map.addControl(this.drawControl);


  
  this.map.on(this.L.Draw.Event.CREATED, (event: any) => {
    const layer = event.layer;
    this.drawnItems.addLayer(layer);

    const geojson = layer.toGeoJSON();
    this.coordinates = geojson.geometry.coordinates;

    console.log('Polygon coordinates:', this.coordinates);
    this.canSave = true;
         
          });
             var _length = totalCount / Number(this.recordPerPage);
          if (_length > Math.floor(_length) && Math.floor(_length) != 0)
            this.totalRecords = Number(this.recordPerPage) * (_length);
          else if (Math.floor(_length) == 0)
            this.totalRecords = 10;
          else
            this.totalRecords = totalCount;
          this.totalPages = this.totalRecords / this.pager;
        }
      })
    } 
      




    close() {
    this.router.navigate(['/admin/zoneconfig']);
  }

}
