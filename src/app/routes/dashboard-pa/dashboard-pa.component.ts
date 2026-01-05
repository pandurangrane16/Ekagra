import { CommonModule } from '@angular/common';
import { Component,inject, HostListener } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MapviewComponent } from "../dashboard/widgets/mapview/mapview.component";
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmDialogComponent } from '../../common/cm-dialog/cm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RightSheetComponent } from './right-sheet';
import { withLoader } from '../../services/common/common';
import { LoaderService } from '../../services/common/loader.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PaDashboardService } from '../../services/Pa/pa_dashboard.service';
import { CmSelectCheckComponent } from '../../common/cm-select-check/cm-select-check.component';
// import { CmBreadcrumbComponent } from '../../common/cm-breadcrumb/cm-breadcrumb.component';
import{CmBreadcrumbComponent} from '../../common/cm-breadcrumb/cm-breadcrumb.component';
import { withLatestFrom } from 'rxjs';    
import { color } from 'highcharts';
import { atcsDashboardservice } from '../../services/atcs/atcsdashboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-pa',
  imports: [MatButtonToggleModule,MatDatepickerModule,CmSelectCheckComponent, CommonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, MapviewComponent,MatButtonModule,MatTooltipModule,MatTabsModule,CmTableComponent,CmBreadcrumbComponent, FormsModule],
  templateUrl: './dashboard-pa.component.html',
  styleUrl: './dashboard-pa.component.css',
    providers: [provideNativeDateAdapter()]
})
export class DashboardPaComponent {
loaderService = inject(LoaderService);
mapHeight = '350px';
onlineCount:any;
startDate:any;
endDate:any;
offlineCount:any;


headerArr: any;
     totalPages: number = 1;
      pager: number =0;
        MaxResultCount=10;
  SkipCount=0;
  perPage=10;
  pageNo=0;
recordPerPage: number = 10;
processedItems: any[] = [];
 totalRecords: any = 0;
 activeComponent: 'a' | 'b' | 'c' = 'a';
 drawerState: 'in' | 'out' = 'out';

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

 viewDevice(rowData: any): void {
   const dialogRef = this.dialog.open(CmDialogComponent, {
     width: '600px',
       position: { top: '80px' },
   panelClass: 'custom-dialog',
     data: {
       title: `${rowData.location}`,
      src: `${rowData.img}`,
 
      // type: 'info',
     
     }
   });
 
  
 }
DateWiseFilter(evtData: any, category: string) {
  const localDate = new Date(evtData.value);

  // Convert date to UTC explicitly
  const utcDate = new Date(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds()
  );

  // Convert to Unix UTC timestamp in milliseconds (13 digits)
  const unixUtcMs = utcDate.getTime();  // 💥 No /1000 here

  if (category === "start") {
    this.startDate = unixUtcMs;
    console.log("Start Date UTC UNIX (ms):", unixUtcMs);
  } else {
    this.endDate = unixUtcMs;
    console.log("End Date UTC UNIX (ms):", unixUtcMs);
  }

  this.GetOngoingAnnoucement();
}



 
  onRowClicked(evt: any) {
    // table emits the clicked row object or id depending on configuration
    // normalize to an object and expose id for searchWithId
    const payload = evt && typeof evt === 'object' ? evt : { id: evt };
    console.log('Row clicked:', payload);
    // If you want to trigger a navigation or fetch details by id, do it here.
  }

  
  items: any;
  paHeadArr: any;
  paOngoingHeadArr: any;
  paUpcomingHeadArr: any;
  collectionSize: any;

paList: any[] = [
   { name: 'PA1', health:'Unavailable',image:'../assets/img/pa_grey.png', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'gray', disabled:true }] },
   { name: 'Mumbai', health:'Available',image:'../assets/img/pa_blue.png', button:[{ label: 'Cancel', icon: 'close', type: 'close',color:'gray', disabled:true }] },
   { name: 'ecbc', health:'Busy',image:'../assets/img/pa_green.png', button:[{ label: 'Cancel ', icon: 'close', type: 'close', color:'warn' }] },
   { name: 'Akshar Chawk', health:'Unavailable',image:'../assets/img/pa_grey.png', button:[{ label: 'Cancel', icon: 'close', type: 'close' , color:'gray', disabled:true}] },
   { name: 'Akshar Chawk', health:'Unavailable',image:'../assets/img/pa_grey.png', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'gray', disabled:true }] },
  ];
paUpcomingList = [
   { name: 'Schedule',  type: 'pa', desination:'ecbc',time:'11:40:00'},
   { name: 'Schedule',  type: 'pa', desination:'ecbc',time:'11:45:00'},
   { name: 'Schedule',  type: 'pa', desination:'ecbc',time:'11:50:00'},
   { name: 'Schedule',  type: 'pa', desination:'ecbc',time:'11:55:00'},
   { name: 'Schedule',  type: 'pa', desination:'ecbc',time:'12:05:00'},
   
  ];
paOngoingList: any[] = [
   { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] },
  { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] },
  { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] },
  { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] },
  { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] }
  ];
  
private dialogRef?: MatDialogRef<RightSheetComponent>;
constructor(
private dialog: MatDialog,private service:PaDashboardService, private atcsService: atcsDashboardservice
    ){}

    getZoneList() {
        this.atcsService.GetAllZones().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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
        // Trigger any updates based on zone selection if needed
    }

    clearActions() {
        this.selectedZones = [];
        this.selectedZoneIds = [];
        // Clear logic
    }

  ngOnInit(): void {
    this.getZoneList(); // Load zones
    this.getList();
    this.fetchPaStatus();
    this.GetOngoingAnnoucement();
  
      this.buildHeader();
  


  }
        buildHeader() {  
          this.paHeadArr = [
            { header: 'PA Name', fieldValue: 'paname', position: 1, },
            { header: 'Health Status', fieldValue: 'healthstatus',type:'Boolean', position: 2, },
            { header: 'Call Status', fieldValue: 'callstatus', position: 3, },
            { header: 'Cancel Announcement', fieldValue: 'button', position: 4, },
          
          ];
           this.paOngoingHeadArr = [
            { header: 'Destination', fieldValue: 'destination', position: 1, },
            { header: 'Source', fieldValue: 'source', position: 2, },
            { header: 'Announcement Status ', fieldValue: 'announcementStatus', position: 3, },
            { header: 'Duration', fieldValue: 'duration', position: 4, },
            { header: 'Record Name', fieldValue: 'recordName', position: 5, },
            { header: 'Audio', fieldValue: 'audio', position: 6, },
            { header: 'Announcement Type', fieldValue: 'announcementType', position: 7, },
      
            { header: 'Cancel Announcement', fieldValue: 'button', position: 8, },
          
          ];
           this.paUpcomingHeadArr = [
            { header: 'Announcement Name', fieldValue: 'name', position: 1, },
            { header: 'Destination Type', fieldValue: 'type', position: 2, },
            { header: 'Destination', fieldValue: 'desination', position: 3, },
            { header: 'Start Time', fieldValue: 'time', position: 4, },
          
          ];
          ;}

        onButtonClicked({ event, data }: { event: any; data: any }) {
  if (event.type === 'view') {
    this.viewDevice(data);
    console.log(data);
  } else if (event.type === 'delete') {
    this.deleteRow(data);
  }

 

}    
          onPageChange(event:any) {
    console.log(event);
  if (event.type === 'pageChange') {
    this.pager = event.pageNo;

  }
}
onPageRecordsChange(event:any ) {
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
 getList() {
    //const selectedProjectId = this.form.controls['selectedProject'].value.value;
    
    // const search = this.form.controls['searchText'].value
        this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
 
   

    }  

  GetOngoingAnnoucement() {

  const start = this.startDate ??
    Math.floor(new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000);

  const end = this.endDate ??
    Math.floor(new Date(new Date().setHours(23, 59, 59, 999)).getTime() / 1000);

  this.MaxResultCount = this.perPage;
  this.SkipCount = this.MaxResultCount * this.pager;
  this.recordPerPage = this.perPage;

  const inputs = `${start},${end},,,${this.SkipCount},${this.MaxResultCount}`;

  const requestBody = {
    projectId: 3,
    type: 1,
    inputs: inputs,
    bodyInputs: "",
    seq: 8
  };

  this.service
    .GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (response: any) => {

        let parsedResult: any = {};
        let items: any[] = [];

        try {
          parsedResult = JSON.parse(response?.result || "{}");
          items = parsedResult?.data || [];
        } catch (err) {
          console.error('JSON parse failed:', err);
          items = [];
        }

        this.items = items;

        const totalCount = items.length;

        if (Array.isArray(items)) {

          items.forEach((element: any, index: number) => {
            element.destination = element.destination || '-';
            element.source = element.source || '-';
            element.announcementStatus = element.announcementStatus || '-';
            element.duration = element.duration || '-';
            element.recordName = element.recordName || '-';
            element.audio = element.audio || '-';
            element.announcementType = element.announcementType || '-';
            element.sNo = index + 1;

            element.button = [
              { label: 'Cancel', icon: 'cancel', type: 'cancel' }
            ];
          });

          // Pagination logic (unchanged)
          const _length = totalCount / Number(this.recordPerPage);

          if (_length > Math.floor(_length) && Math.floor(_length) !== 0)
            this.totalRecords = Number(this.recordPerPage) * _length;
          else if (Math.floor(_length) === 0)
            this.totalRecords = 10;
          else
            this.totalRecords = totalCount;

          this.totalPages = this.totalRecords / this.pager;
        }
      },

      error: (error: any) => {
        console.error('GetOngoingAnnouncement API failed:', error);

        // Reset UI safely
        this.items = [];
        this.totalRecords = 0;
        this.totalPages = 0;

        // Optional: show toast
        // this.toastr.error('Failed to load ongoing announcements');
      }
    });
}

           ListView() {
  

const requestBody = {
  projectId: 3,
  type: 1,
  inputs: "",
  bodyInputs: "",
  seq: 2
};
       this.service.GetSiteResponse(requestBody).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
    //  const items = response?.result || [];
         
 // 1️⃣ Parse the JSON string in result
const parsedResult = JSON.parse(response?.result || "{}");

// 2️⃣ Take the data array from parsed result
const items = parsedResult?.data || [];
this.paList = items;

// To calculate total pagination count
const totalCount = items.length;

if (Array.isArray(items)) {

  items.forEach((element: any, index: number) => {

    // Map fields safely
    element.destination = element.destination || '-';
    element.source = element.source || '-';
    element.announcementStatus = element.announcementStatus || '-';
    element.duration = element.duration || '-';
    element.recordName = element.recordName || '-';
    element.audio = element.audio || '-';
    element.announcementType = element.announcementType || '-';
    element.sNo = element.sNo || index + 1;

    // Add button to last column
    element.button = [
      { label: 'Cancel', icon: 'cancel', type: 'cancel' }
    ];
  });

  // 3️⃣ Pagination LIKE your existing logic
  const _length = totalCount / Number(this.recordPerPage);

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

showComponent(type: 'a' | 'b' | 'c') {
    this.activeComponent = type;
  }

  toggleDrawer() {
    this.drawerState = this.drawerState === 'out' ? 'in' : 'out';
  }

  closeDrawer() {
    this.drawerState = 'out';
  }

  // Optional: Click outside directive (alternative to a custom directive)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const drawerElement = document.querySelector('.drawer');
    if (drawerElement && !drawerElement.contains(event.target as Node) && this.drawerState === 'in') {
      this.closeDrawer();
    }
  }
  fetchPaStatus() {
      const requestBody = {
    projectId: 3,
    type: 1,
    inputs: "all,all,all",
    bodyInputs: "",
    seq: 5
  };
  this.service.GetSiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))  
    .subscribe({
      next: (res: any) => {
        const counts = this.getOnlineOfflineCount(res);
        this.onlineCount = counts.online;
        this.offlineCount = counts.offline;
      },
      error: (err) => {
        console.error(err);
      }
    });
}

 getOnlineOfflineCount(apiResult: any) {
  const parsed = typeof apiResult.result === 'string'
    ? JSON.parse(apiResult.result)
    : apiResult.result;

  const data = parsed.data || [];

  const offlineStatuses = [
    'unregistered',
    'rejected',
    'device not configured'
  ];

  let offline = 0;
  let online = 0;

  data.forEach((item:any) => {
    const status = (item.Status || '').toLowerCase();
    offlineStatuses.includes(status) ? offline++ : online++;
  });

  return { online, offline };
}


  openRightDialog() {
    // 👇 Check if dialog is already open
    if (this.dialogRef && this.dialogRef.getState() !== 2) {
      return; // already open
    }

    this.dialogRef = this.dialog.open(RightSheetComponent, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '350px',
      panelClass: 'right-dialog'
    });

    // 👇 Clear ref when closed
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = undefined;
    });
  }
  
}
