
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
//import { ToastrService } from 'ngx-toastr';
import { zoneconfigmodel } from '../../../models/admin/zoneconfig.model';
//import * as L from 'leaflet';

import {  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
   private L: any;
drawnItems: any;
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialogRef: MatDialogRef<ZoneConfigurationFormComponent>,
    private service:zoneconfigservice,
   // private toast:ToastrService,
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
    async ngOnInit(): Promise<void>  {

     if (isPlatformBrowser(this.platformId)) {
       const leaflet = await import('leaflet');
    await import('leaflet-draw'); 

    this.L = leaflet;
      this.drawnItems= this.L.FeatureGroup = new this.L.FeatureGroup();
      
      
    }


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
      //this.toast.success("chgdgsf")
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
    
              // this.toast.success('Zone saved successfully'); 
          this.dialogRef.close(this.form.value);
        
          //this.toast.success('Zone saved successfully');
          
        },
        error: (err) => {
          console.error('Save failed:', err);
         // this.toast.error('Failed to save Zone.');
        }
      });
    
    
    
      }
      else {
          this.form.markAllAsTouched(); 
      //this.toast.error('Form is not valid');
      return;
        
      }
    
    
      }
      
showMap() {
  if (isPlatformBrowser(this.platformId)) {
      this.overrideDrawText(); 
    this.isMapVisible = true;
    setTimeout(() => {
      this.initializeMap(); 
    }, 0);
  }
}
overrideDrawText() {
  (this.L as any).drawLocal = {
    draw: {
      toolbar: {
        buttons: {
          polygon: ''
        }
      },
      handlers: {
        polygon: {
          tooltip: {
            start: '',
            cont: '',
            end: ''
          }
        }
      }
    },
    edit: {
      toolbar: {
        buttons: {
          edit: '',
          remove: ''
        }
      },
      handlers: {
        edit: {
          tooltip: {
            text: '',
            subtext: ''
          }
        },
        remove: {
          tooltip: {
            text: ''
          }
        }
      }
    }
  };
}
initializeMap(): void {

   if (!isPlatformBrowser(this.platformId)) return;
  this.map = this.L.map('map', {
    center: [19.0760, 72.8777],
    zoom: 10,
    attributionControl: false
  });

  const osmLayer = this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  });

  osmLayer.addTo(this.map);



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


  var options = {
      position: 'topright',
      draw: {
        //     polyline: {
        //         shapeOptions: {
        //             color: '#f357a1',
        //             weight: 10
        //         }
        //     },
            polygon: {

            },
        circle: false,
        circlemarker: false,// Turns off this drawing tool
        //     rectangle: {
        //         shapeOptions: {
        //             clickable: false
        //         }
        //     },
       
      },
      edit: {
        featureGroup: this.drawnItems, //REQUIRED!!
        // remove: false
      }

    };

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
}

  close() {
    this.dialogRef.close();
  }

}
