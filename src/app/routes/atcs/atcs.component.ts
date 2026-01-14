
import { Component, inject, Input, input, OnInit } from '@angular/core';
import { MapviewComponent } from "../dashboard/widgets/mapview/mapview.component";
import { NotificationComponent } from "../dashboard/widgets/notification/notification.component";
import { ZonalComponent } from "./widgets/zonal/zonal.component";
import { CorridorComponent } from "./widgets/corridor/corridor.component";
import { FailuresComponent } from "./widgets/failures/failures.component";
import { CycleComponent } from "./widgets/cycle/cycle.component";
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { atcsDashboardservice } from '../../services/atcs/atcsdashboard.service';
import { CmLeafletComponent } from '../../common/cm-leaflet/cm-leaflet.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { SessionService } from '../../services/common/session.service';
import { SiteRequestModel } from '../../models/admin/siteresponse.model';
import { CmBreadcrumbComponent } from "../../common/cm-breadcrumb/cm-breadcrumb.component";

interface Junction {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-atcs',
  imports: [CmLeafletComponent, NotificationComponent, ZonalComponent, CorridorComponent, FailuresComponent, CycleComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, CommonModule, MatDatepickerModule, CmBreadcrumbComponent],
  templateUrl: './atcs.component.html',
  styleUrl: './atcs.component.css',
  providers: [provideNativeDateAdapter()]
})
export class AtcsComponent {
//  corridorData: any[] = [];
  loaderService = inject(LoaderService)
  constructor(private service: atcsDashboardservice) { }
  selectedJunction: string = '';
  selectedCorridorJunction: string = '';
  isMap: boolean = false;
  islabel: boolean = false;
  polygonCoordinates:any;
  basepath: any;
  zoneCordinate2:any;
  id: any;
  allCorridorData: any[] = []; // Stores everything from the API
corridorData: any[] = [];
//   startDate: Date | null = null;
// endDate: Date | null = null;

endDate: Date = new Date();
  startDate: Date = new Date(this.endDate.getTime() - (24 * 60 * 60 * 1000));
projectId: number = 0;
 ZoneSelectSettings = {
          labelHeader: 'Select Zone',
          lableClass: 'form-label',
           multiple: false,
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
        isZoneOptionsLoaded: boolean = false;
        ZoneOptions: any[] = [];



  junctions: Junction[] = [
    { value: 'Junction 1', viewValue: 'Junction 1' },
    { value: 'Junction 2', viewValue: 'Junction 2' },
    { value: 'Junction 3', viewValue: 'Junction 3' },
  ];

  isCardExpanded = false;
  siteList: any[] = [];
labelList: any[] = [
 
  { key: 'sl', label: 'Saturation Level' }, 
  { key: 'm', label: 'Mode' },

  { key: 'pn', label: 'Plan Number' },
  { key: 'h', label: 'Health' },
 
  { key: 'serverTime', label: 'Server Time' },
  { key: 'id', label: 'Site Id' }
];
  popupData: { [siteId: string]: any } = {};
  session = inject(SessionService);


  ngOnInit(): void {
    this.getZoneList();
debugger;
     // ✅ Step 1: Get project codes from session
    const projectCodesStr = this.session._getSessionValue("projectCodes");
    if (!projectCodesStr) {
      console.error("⚠️ 'projectCodes' not found in session.");
      return;
    }

    const projectCodes = JSON.parse(projectCodesStr);
    const currentProject = "ATCS"; // change dynamically later if needed

    const project = projectCodes.find(
      (p: any) => p.name.toLowerCase() === currentProject.toLowerCase()
    );

    if (!project) {
      console.error(`⚠️ Project "${currentProject}" not found in config.`);
      return;
    }

    const projectId = Number(project.value);
    this.projectId = projectId;

    
    this.loadCorridorData();
    this.id = this.session._getSessionValue("projectIdRoute");
    console.log("projectIdRoute",this.id)




    this.service.getKeysDataForConfig('basePath').pipe(withLoader(this.loaderService)).subscribe(basePath => {
      console.log('basePath:', basePath);
      this.basepath = basePath;

      this.loadJunctions();
      this.loadpoints();
     // this.loadpopuplabels();

    });


  }

    onPolygonDrawn(coords: any) {
  console.log('Received polygon coordinates in parent:', coords);
   const stringifiedCoords = JSON.stringify(coords); 
  this.polygonCoordinates = stringifiedCoords; 
   
}

// Define this at the top of your class
selectedZones: any[] = [];

// onActionSelectionChange(event: any) {
//   // Use the event value or the bound property
//   const selectedValues = event.value || [];
  
//   // Find the 'All' option in your list
//   const allOption = this.ZoneOptions.find((x: any) => x.text.toLowerCase() === 'all');

//   if (!allOption) return;

//   const isAllSelected = selectedValues.some((x: any) => x.id === allOption.id);

//   // 1. If 'ALL' was just clicked -> Select every other option except 'ALL'
//   if (isAllSelected) {
//     const allExceptAll = this.ZoneOptions.filter((x: any) => x.id !== allOption.id);
//     this.selectedZones = [...allExceptAll];
//     return;
//   }

//   // 2. Default behavior: selectedZones is already updated by [(ngModel)]
//   // But we ensure 'ALL' is never part of the final selection array if other things are picked
//   this.selectedZones = selectedValues.filter((x: any) => x.id !== allOption.id);
// }
getSelectedZoneIds(): number[] {
  // Map the objects in selectedZones to just their numeric IDs
  return this.selectedZones.map(zone => zone.id);
}

// 1. Define a simple property
selectedZoneIds: number[] = [];

onActionSelectionChange(event: any) {
   this.siteList = [];
  const selectedValues = event.value || [];
  const allOption = this.ZoneOptions.find((x: any) => x.text.toLowerCase() === 'all');

  if (!allOption) return;

  const isAllSelected = selectedValues.some((x: any) => x.id === allOption.id);

  if (isAllSelected) {
    const allExceptAll = this.ZoneOptions.filter((x: any) => x.id !== allOption.id);
    this.selectedZones = [...allExceptAll];
  } else {
    this.selectedZones = selectedValues.filter((x: any) => x.id !== allOption.id);
  }
debugger;
  // 2. UPDATE THE IDS HERE (Not in the template)
  this.selectedZoneIds = this.selectedZones.map(zone => zone.id);
  const allPolygons: any[] = [];
  
  this.selectedZones.forEach(zone => {
    if (zone.zoneCordinate) {
      try {
        // Parse the string (e.g. "[[[lng,lat],...]]")
        const parsed = JSON.parse(zone.zoneCordinate);
        // Push the actual polygon array into our master list
        allPolygons.push(parsed[0]); 
      } catch (e) {
        console.error("Invalid coordinates for zone: " + zone.text, e);
      }
    }
  });

  // 2. Convert the master list back to a string format your map method expects
  // This will look like: [ [[p1],[p2]], [[p1],[p2]] ]
  this.zoneCordinate2 = JSON.stringify(allPolygons);
  console.log("zoneCordinate2", this.zoneCordinate2);

  this.loadJunctions();
  this.loadCorridorData();
  this.loadpoints();
}

// Ensure you also update IDs in your clear function
clearActions() {
  this.selectedZones = [];
  this.selectedZoneIds = [];
  this.loadJunctions();
  this.loadCorridorData();
}


loadCorridorData() {
  debugger;
  // 1. Get the Name string from the dropdown. 
  // Fallback to session if no selection exists.
  const junctionName = this.selectedCorridorJunction;

  // 2. Format dates to ISO String as required by your Swagger ($date-time)
  const from = this.startDate ? this.startDate.toISOString() : '';
  const to = this.endDate ? this.endDate.toISOString() : '';
     

  // 3. Safety check: Ensure we have a name before calling the API
  // if (!junctionName) {
  //   console.warn("No Junction Name available for Corridor Data");
  //   return;
  // }

  // 4. Call the service passing the name string
  this.service.getCongestionData(from, to,this.selectedZoneIds)
    .pipe(withLoader(this.loaderService))
    .subscribe({
     next: (res: any) => {
        // 2. Store the full list in the master variable
        this.allCorridorData = res?.result || [];

        debugger;
        
        // 3. Filter data for the currently selected junction
        this.filterCorridorByJunction();
        
        console.log('Total Records:', this.allCorridorData.length);
      },
      error: (err) => {
        console.error("Error loading corridor data:", err);
        this.allCorridorData = [];
        this.corridorData = [];
      }
    });
}

filterCorridorByJunction() {
  debugger;

  if (this.selectedCorridorJunction) {
    // Only show records matching the selected junctionName (e.g., "UCON_12_5301")
    this.corridorData = this.allCorridorData.filter(item => 
      item.junctionName === this.selectedCorridorJunction
    );
    console.log(`Filtered Records for ${this.selectedCorridorJunction}:`, this.corridorData);
  } else {
    // Fallback: show everything or nothing
    this.corridorData = this.allCorridorData;
    console.log("No junction selected, showing all records.",this.corridorData);
  }
}



onCorridorJunctionChange(event: any) {
    this.selectedCorridorJunction = event.value;
    this.filterCorridorByJunction(); // Instantly update graph without API call
}

getZoneList() {
  this.service.GetAllZones().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
   
      debugger;
        const items = response?.result || [];

     
        const projectOptions = items.map((item: any) => ({
          text: (item.zoneName || '').trim() || 'Unknown',
          id: item.id,
          zoneCordinate: item.zoneCordinate
        }));

        debugger;

  
    // projectOptions.unshift({
    //   text: 'All',
    //   id: 0
    // });

  
    // 1. Set selectedZones to everything except the "All" option (id: 0)
    this.selectedZones = [...projectOptions];
    
    // 2. Map the IDs to your array that goes to the Child component
    this.selectedZoneIds = this.selectedZones.map(zone => zone.id);

      const allPolygons: any[] = [];
  
  this.selectedZones.forEach(zone => {
    if (zone.zoneCordinate) {
      try {
        // Parse the string (e.g. "[[[lng,lat],...]]")
        const parsed = JSON.parse(zone.zoneCordinate);
        // Push the actual polygon array into our master list
        allPolygons.push(parsed[0]); 
      } catch (e) {
        console.error("Invalid coordinates for zone: " + zone.text, e);
      }
    }
  });

  // 2. Convert the master list back to a string format your map method expects
  // This will look like: [ [[p1],[p2]], [[p1],[p2]] ]
  this.zoneCordinate2 = JSON.stringify(allPolygons);
  console.log("zoneCordinate2", this.zoneCordinate2);
    
   


      projectOptions.unshift({
      text: 'All',
      id: 0
    });
      this.ZoneSelectSettings.options = projectOptions;
    this.ZoneOptions=projectOptions
    
// if (!this.isEdit) {
//   this.form.controls['selectedRole'].setValue({
//     text: 'All',
//     id: 0
//   });
// }

// this.form.controls['selectedStatus'].setValue({
//   name: 'All',
//   value: null
// });

    this.isZoneOptionsLoaded = true;
  }, error => {
    console.error('Error fetching Zone list', error);
  });
}

  onMarkerClicked2(siteId: string) {
    this.service.login().pipe(withLoader(this.loaderService)).subscribe({
      next: (res: any) => {
        const token = res?.token;
        if (!token) {
          console.error("Token missing in login response");
          return;
        }

        const headers = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        this.service.sitedata(siteId, headers).pipe(withLoader(this.loaderService)).subscribe({
          next: (siteRes) => {
            console.log("Fetched site data:", siteRes);


            this.popupData = {
              [siteId]: siteRes
            };
          },
          error: (err) => {
            console.error("Error fetching site data:", err);
          }
        });
      },
      error: (err) => {
        console.error("Login failed:", err);
      }
    });
  }

//   onMarkerClicked(siteId: string) {
//   const model: SiteRequestModel = {
//   projectId: this.projectId,
//   type: 0,
//   inputs: siteId,
//   bodyInputs: null,
//   seq: 43
// }
//   this.service.SiteResponse(model).pipe(withLoader(this.loaderService)).subscribe({
//     next: (res: any) => {
//       if (!res?.result) {
//         console.error("No result found in site response");
//         return;
//       }

     
//       let parsedResult;
//       try {
//         parsedResult = JSON.parse(res.result);
//       } catch (e) {
//         console.error("Failed to parse result JSON:", e);
//         return;
//       }

//       console.log("Fetched site response:", parsedResult);

//       this.popupData = {
//         [siteId]: parsedResult
//       };
//       console.log("Popup data set for siteId", this.popupData);
//     },
//     error: (err) => {
//       console.error("Error fetching site response:", err);
//     }
//   });
// }

onMarkerClicked(siteId: string) {
  const model: SiteRequestModel = {
    projectId: this.projectId,
    type: 0,
    inputs: siteId,
    bodyInputs: null,
    seq: 43
  };

  this.service.SiteResponse(model).pipe(withLoader(this.loaderService)).subscribe({
    next: (res: any) => {
      if (!res?.result) {
        console.error("No result found in site response");
        return;
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(res.result);
      } catch (e) {
        console.error("Failed to parse result JSON:", e);
        return;
      }

      // ✅ Instead of replacing, update the object immutably
      this.popupData = {
        ...this.popupData,      // keep previous popups
        [siteId]: parsedResult  // update/add current popup
      };

      // ✅ Force change detection by creating a new reference
      this.popupData = { ...this.popupData };

      console.log("Popup data set for siteId", siteId, this.popupData);
    },
    error: (err) => {
      console.error("Error fetching site response:", err);
    }
  });
}






  getSelectedJunctionName(): string {
    const selected = this.junctions.find(j => j.value === this.selectedJunction);
    //console.log(selected ? selected.viewValue : 'No junction selected');
    return selected ? selected.viewValue : 'Select a junction';
  }




  loadpoints(): void {
    debugger;
    //const basePath = 'https://172.19.32.51:8089/UploadedFiles/Icons/';
    const basePath = this.basepath
    const projectId = this.getAtcsProjectId();

  // If projectId is null, we shouldn't make the API call
  if (projectId === null) {
    console.error("Cannot load junctions: ATCS Project ID not found.");
    return;
  }
    this.service.GetActiveSitesbyZoneAndProject(this.selectedZoneIds, [projectId]).pipe(withLoader(this.loaderService)).subscribe({
      next: (res: any) => {
        const rawSites = res?.result || [];

        if (rawSites.length === 0) {
          this.siteList = [];
          return;
        }

        // ✅ Assume all sites use the same mapIcon (from first record)
        const mapIconName = rawSites[0].mapIcon;
        const iconUrl = basePath + mapIconName;

        this.siteList = rawSites.map((site: any) => ({
          ...site,
          mapIconUrl: iconUrl  // attach full icon URL to every site
        }));

        this.isMap = true; // map loads only after siteList is ready
        console.log('Site list with icon:', this.siteList);
        debugger;
      },
      error: (err) => {
        console.error('Error fetching site list:', err);
      }
    });
  }
  // loadpopuplabels(): void {
  //   this.service.getlabels(this.id).pipe(withLoader(this.loaderService)).subscribe((res: any) => {
  //     if (res && res.result && Array.isArray(res.result.items)) {
  //       this.labelList = res.result.items;
  //       this.islabel = true
  //       console.log("labellist",this.labelList)
  //     } else {
  //       this.labelList = [];
  //     }
  //   });
  // }

  getAtcsProjectId(): number | null {
  const projectCodesStr = this.session._getSessionValue("projectCodes");
  
  if (!projectCodesStr) {
    console.warn("⚠️ projectCodes not found in session.");
    return null;
  }

  try {
    const projectCodes = JSON.parse(projectCodesStr);
    const currentProject = "atcs"; // Set to "atcs"

    const project = projectCodes.find(
      (p: any) => p.name.toLowerCase() === currentProject.toLowerCase()
    );

    if (!project) {
      console.error(`⚠️ Project "${currentProject}" not found in config.`);
      return null;
    }

    return Number(project.value);
  } catch (e) {
    console.error("Error parsing project codes", e);
    return null;
  }
}
loadJunctions(): void {
const projectId = this.getAtcsProjectId();

  // If projectId is null, we shouldn't make the API call
  if (projectId === null) {
    console.error("Cannot load junctions: ATCS Project ID not found.");
    return;
  }

  // Pass the dynamic projectId in an array as required by the API
  this.service.GetActiveSitesbyZoneAndProject(this.selectedZoneIds, [projectId])
    .pipe(withLoader(this.loaderService))
    .subscribe((res: any) => {
  
      if (res?.success && Array.isArray(res.result)) {
        this.junctions = res.result.map((item: any) => ({
          value: item.siteName,
          viewValue: `${item.siteName} (${item.siteId})`
        }));


       this.selectedJunction = this.junctions[0].value;
       this.selectedCorridorJunction = this.junctions[0].viewValue;
       this.filterCorridorByJunction();
        
        console.log('Initial junction selected:', this.selectedJunction);
      } else {
        this.junctions = [];
      }
    });
}


  onJunctionChange(event: MatSelectChange) {
    const junction = event.value;
    this.selectedJunction = event.value;

  }
  expand(): void {
    this.isCardExpanded = !this.isCardExpanded;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.classList.toggle('fullscreenDiv');
  }



handleDateChange(evt: any, type: string) {
  debugger;
  if (type === "start") {
    this.startDate = evt.value;
  } else {
    this.endDate = evt.value;
  }

  this.loadCorridorData();
  this.loadCorridorData();
}

}
