import { Component, inject, OnInit } from '@angular/core';
import { DeviceStatusComponent } from "./widgets/device-status/device-status.component";
import { CmTableComponent } from "../../common/cm-table/cm-table.component";
import { withLoader } from '../../services/common/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../services/common/loader.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MatDialog } from '@angular/material/dialog';
import { CmDialogComponent } from '../../common/cm-dialog/cm-dialog.component';
import { vmsdashboardService } from '../../services/dashboard/vmsDashboard.service';
import { SessionService } from '../../services/common/session.service';
import { CmButtonComponent } from "../../common/cm-button/cm-button.component";
import { MaterialModule } from '../../Material.module';
import { VmsEmergencyComponent } from './vms-emergency/vms-emergency.component';
import { CommonService } from '../../services/common/common.service';

import { alertservice } from '../../services/admin/alert.service';
import{CmBreadcrumbComponent} from '../../common/cm-breadcrumb/cm-breadcrumb.component';

@Component({
  selector: 'app-dashboard-vms',
  imports: [DeviceStatusComponent, CmTableComponent, MaterialModule, CmBreadcrumbComponent],
  templateUrl: './dashboard-vms.component.html',
  styleUrl: './dashboard-vms.component.css'
})
export class DashboardVMSComponent implements OnInit {
  loaderService = inject(LoaderService);
  _common = inject(CommonService);
  alertService = inject(alertservice);
  headerArr: any;
  totalPages: number = 1;
  pager: number = 0;
  MaxResultCount = 10;
  SkipCount = 0;
  perPage = 10;
  pageNo = 0;
  recordPerPage: number = 10;
  processedItems: any[] = [];
  vmdTypeSettings = {
    labelHeader: 'Select VMD',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: {}
  };

   // Zone Properties
 isZoneOptionsLoaded: boolean = false;
 ZoneOptions: any[] = [];
 selectedZones: any[] = [];
 selectedZoneIds: any[] = [];
 ZoneSelectSettings = {
    labelHeader: 'Select Zone',
    lableClass: 'form-label',
    multiple: false,
    formFieldClass: '', 
    appearance: 'fill',
    options: []
 };


  totalRecords: any = 0;


  //  viewDevice(rowData: any): void {
  //    const dialogRef = this.dialog.open(CmDialogComponent, {
  //      width: '600px',
  //        position: { top: '80px' },
  //    panelClass: 'custom-dialog',
  //      data: {
  //        title: `${rowData.location}`,
  //       src: `${rowData.img}`,

  //       // type: 'info',

  //      }
  //    });


  //  }


  userList: any[] = [];
    clearActions() {
        this.selectedZones = [];
        this.selectedZoneIds = [];
        this.getList();
        // Clear logic
    }
  getList() {
    // // ✅ Step 1: Get project codes from session
    // const projectCodesStr = this.session._getSessionValue("projectCodes");
    // if (!projectCodesStr) {
    //   console.warn("⚠️ projectCodes not found in session, retrying...");
    //   setTimeout(() => this.getList(), 500);
    //   return;
    // }

    // const projectCodes = JSON.parse(projectCodesStr);
    // const currentProject = "vms"; // change dynamically later if needed

    // const project = projectCodes.find(
    //   (p: any) => p.name.toLowerCase() === currentProject.toLowerCase()
    // );

    // if (!project) {
    //   console.error(`⚠️ Project "${currentProject}" not found in config.`);
    //   return;
    // }

    // const projectId = Number(project.value);

    // // ✅ Step 2: Prepare API payload
    // const requestPayload = {
    //   projectId,
    //   type: 0,
    //   inputs: "string",
    //   bodyInputs: "string",
    //   seq: 7
    // };
    // debugger;
    // ✅ Step 3: Call API via service + loader
    const zoneIds = this.selectedZoneIds || [];
    this.service
      .GetVmsListDataByZone(zoneIds)
      .pipe(withLoader(this.loaderService))
      .subscribe({
 next: (response: any) => {
  debugger;
      // 1. Check if the response is successful and contains an array
      if (response?.success && Array.isArray(response.result)) {

        if (response.result.length === 0) {
      this.userList = [];
      this.toaster.error('No VMS data found for the selected zones.');
      return;
    }
    else{
        // 2. Filter out the summary object (the one with 'Connected' property)
        // We only want the items that have a 'vmsId'
        const vmsItems = response.result.filter((item: any) => item.vmsId !== undefined);

        // 3. Map the VMS data to your table format
        this.userList = vmsItems.map((item: any) => ({
          location: item.vmsDescription,
          vmsId: item.vmsId,
          vmsCode: item.vmsCode, // Added this since it's available now
         
          button: [{ label: "View", icon: "visibility", type: "view" }],
          img: "../assets/img/cam1.jpg"
        }));

        this.totalRecords = this.userList.length;
        console.log("✅ Loaded VMS list:", this.userList);
    }
        
      
      } else {
        this.userList = [];
        this.totalRecords = 0;
        console.warn("⚠️ No VMS data found in API response");
        this.toaster.error('No VMS data found in API response.');
      }
    },
      error: (err) => {
      console.error("❌ API Error:", err);
      this.userList = [];
      this.toaster.error('Failed to load VMS list. Please try again later.');
    }
      });
  }

    getZoneList() {
        this.service.GetAllZones().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
            const items = response?.result || [];

            const projectOptions = items.map((item: any) => ({
                text: (item.zoneName || '').trim() || 'Unknown',
                id: item.id
            }));

            // 1. Set selectedZones to everything except the "All" option (id: 0)
            this.selectedZones = [...projectOptions];
            
            // 2. Map the IDs to your array that goes to the Child component
            this.selectedZoneIds = this.selectedZones.map(zone => zone.id);

            projectOptions.unshift({
                text: 'All',
                id: 0
            });
            this.ZoneSelectSettings.options = projectOptions;
            this.ZoneOptions=projectOptions
            this.isZoneOptionsLoaded = true;
        }, error => {
            console.error('Error fetching Zone list', error);
        });
    }

    onActionSelectionChange(event: any) {
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

        this.selectedZoneIds = this.selectedZones.map(zone => zone.id);
        this.getList();
        // Trigger any updates based on zone selection if needed
    }

  GetVmdList() {
    this._common._sessionAPITags().subscribe(res => {
      console.log(res);
      let _inputTag = res.find((x: any) => x.tag == "GetVMSDetails");
      const data = _inputTag.inputRequest;

      this.alertService.SiteResponse(JSON.parse(data))
        .pipe(withLoader(this.loaderService))
        .subscribe({
          next: (response: any) => {
            this.loaderService.showLoader();
            // Parse result safely
            let items: any[] = [];

            if (response?.result) {
              try {
                items = typeof response.result === 'string'
                  ? JSON.parse(response.result)
                  : response.result;
              } catch (err) {
                console.error('Error parsing result JSON:', err);
              }
              this.loaderService.hideLoader();
            }

            // Map to dropdown-compatible format
            const projectOptions = items.map((item: any) => ({
              name: `${item.vmsId} - ${item.description}` || item.vmsId,
              value: item.vmsId,

            }));

            // Optional: sort or filter online devices
            // const onlineDevices = projectOptions.filter(p => p.networkStatus === 1);
            console.log(this.vmdTypeSettings);
            this.vmdTypeSettings.options = projectOptions;
            // this.isProjectOptionsLoaded = true;
            this.loaderService.hideLoader();
          },
          error: (error) => {
            console.error('Error fetching VMD list:', error);
          }
        });
    });
  }


  onRowClicked(evt: any) { }


  items: any;
  headArr: any;
  collectionSize: any;

  // userList = [
  //    { location: 'Akshar Chawk', button:[{ label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg' },
  //       { location: 'Natubai Circle', button:[{ label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg'},
  //       { location: 'Yash Complex',button:[{ label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg' },
  //       { location: 'Akshar Chawk', button:[{label: 'View', icon: 'visibility', type: 'view'}], img:'../assets/img/cam1.jpg' },
  //       { location: 'Natubai Circle', button:[{label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg'},
  //       { location: 'Yash Complex',button:[{ label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg' }

  // ];
  constructor(
    private dialog: MatDialog,
    private service: vmsdashboardService, private session: SessionService,private toaster: ToastrService

  ) { }

  ngOnInit(): void {

    this.getList();
    this.getZoneList();

    this.buildHeader();

    this.GetVmdList();

  }
  buildHeader() {
    this.headArr = [
      { header: 'Location', fieldValue: 'location', position: 1, },
      { header: 'Preview', fieldValue: 'button', position: 2, }


    ];
    ;
  }


  viewDevice(rowData: any): void {
    const projectCodesStr = this.session._getSessionValue("projectCodes");
    const projectCodes = projectCodesStr ? JSON.parse(projectCodesStr) : [];
    const currentProject = "vms";

    const project = projectCodes.find(
      (p: any) => p.name.toLowerCase() === currentProject.toLowerCase()
    );

    if (!project) {
      console.error(`⚠️ Project "${currentProject}" not found in config.`);
      return;
    }

    const projectId = Number(project.value);

    const requestPayload = {
      projectId,
      type: 0,
      inputs: rowData.vmsId,
      bodyInputs: "string",
      seq: 8
    };
    debugger;
    // ✅ Call GetVMSSnapshot using same payload structure
    this.service
      .PostSiteResponse(requestPayload)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (response: any) => {
          const result = response?.result ? JSON.parse(response.result) : null;

          if (result?.snapshot) {
            const imageSrc = 'data:image/jpeg;base64,' + result.snapshot;

            this.dialog.open(CmDialogComponent, {
              width: '600px',
              position: { top: '80px' },
              panelClass: 'custom-dialog',
              data: {
                title: `${rowData.location}`,
                src: imageSrc
              }
            });
          } else {
            console.warn('⚠️ No snapshot found for this VMS.');
          }
        },
        error: (err) => {
          console.error('❌ Error fetching snapshot:', err);
        }
      });
  }




  onButtonClicked({ event, data }: { event: any; data: any }) {
    if (event.type === 'view') {
      this.viewDevice(data);
      console.log(data);
    } else if (event.type === 'delete') {
      this.deleteRow(data);
    }



  }
  onPageChange(event: any) {
    console.log(event);
    if (event.type === 'pageChange') {
      this.pager = event.pageNo;

    }
  }
  onPageRecordsChange(event: any) {
    console.log(event);
    if (event.type === 'perPageChange') {
      this.perPage = event.perPage;
      this.pager = 0;

    }
  }
  deleteRow(data: any) {
    const empId = data.employeeId;
    const model = {
      employeeId: empId,
      managerId: null
    };

  }
  //  getList() {
  //     //const selectedProjectId = this.form.controls['selectedProject'].value.value;

  //     // const search = this.form.controls['searchText'].value
  //         this.MaxResultCount=this.perPage;
  //       this.SkipCount=this.MaxResultCount*this.pager;
  //       this.recordPerPage=this.perPage;



  //     }  

  OpenEmergencyPublish() {
    const dialogRef = this.dialog.open(VmsEmergencyComponent, {
      width: '600px',
      position: { top: '20px' },
      panelClass: 'custom-confirm-dialog',
      data: {
        data: this.vmdTypeSettings
      },
      autoFocus: false,
    });
  }

}
