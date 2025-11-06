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

@Component({
  selector: 'app-dashboard-vms',
  imports: [DeviceStatusComponent, CmTableComponent],
  templateUrl: './dashboard-vms.component.html',
  styleUrl: './dashboard-vms.component.css'
})
export class DashboardVMSComponent implements OnInit {

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
  headArr: any;
  collectionSize: any;

userList = [
   { location: 'Akshar Chawk', button:[{ label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg' },
      { location: 'Natubai Circle', button:[{ label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg'},
      { location: 'Yash Complex',button:[{ label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg' },
      { location: 'Akshar Chawk', button:[{label: 'View', icon: 'visibility', type: 'view'}], img:'../assets/img/cam1.jpg' },
      { location: 'Natubai Circle', button:[{label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg'},
      { location: 'Yash Complex',button:[{ label: 'View', icon: 'visibility', type: 'view' }], img:'../assets/img/cam1.jpg' }
      
];
    constructor(
private dialog: MatDialog,

    ){}

  ngOnInit(): void {

    this.getList();
  
      this.buildHeader();
  


  }
        buildHeader() {  
          this.headArr = [
            { header: 'Location', fieldValue: 'location', position: 1, },
            { header: 'Action', fieldValue: 'button', position: 2, }
  
          
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


    
}
