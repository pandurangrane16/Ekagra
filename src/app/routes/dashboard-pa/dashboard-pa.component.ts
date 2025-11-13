import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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
import { color } from 'highcharts';

@Component({
  selector: 'app-dashboard-pa',
  imports: [MatButtonToggleModule, CommonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, MapviewComponent,MatButtonModule,MatTooltipModule,MatTabsModule,CmTableComponent, ],
  templateUrl: './dashboard-pa.component.html',
  styleUrl: './dashboard-pa.component.css',
})
export class DashboardPaComponent {
mapHeight = '350px';

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
 
  onRowClicked(evt: any) { }

  
  items: any;
  paHeadArr: any;
  paOngoingHeadArr: any;
  paUpcomingHeadArr: any;
  collectionSize: any;

paList = [
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
paOngoingList = [
   { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] },
  { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] },
  { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] },
  { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] },
  { type: 'pa', desination:'ecbc', devices:'ecbc', announcement:'scheduled', playlist:'Audio 5', button:[{ label: 'Cancel', icon: 'close', type: 'close', color:'warn', disabled:false }] }
  ];
  
private dialogRef?: MatDialogRef<RightSheetComponent>;
constructor(
private dialog: MatDialog,

    ){}

  ngOnInit(): void {

    this.getList();
  
      this.buildHeader();
  


  }
        buildHeader() {  
          this.paHeadArr = [
            { header: 'PA Name', fieldValue: 'name', position: 1, },
            { header: 'Health Status', fieldValue: 'health', position: 2, },
            { header: 'Call Status', fieldValue: 'image', position: 3, },
            { header: 'Cancel Announcement', fieldValue: 'button', position: 4, },
          
          ];
           this.paOngoingHeadArr = [
            { header: 'Destination Type', fieldValue: 'type', position: 1, },
            { header: 'Destination', fieldValue: 'desination', position: 2, },
            { header: 'Destination Devices', fieldValue: 'devices', position: 3, },
            { header: 'Announcement Type', fieldValue: 'announcement', position: 4, },
            { header: 'PlayList Names', fieldValue: 'playlist', position: 5, },
            { header: 'Cancel Announcement', fieldValue: 'button', position: 6, },
          
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
