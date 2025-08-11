
import { Component, inject,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { zoneconfigservice } from '../../services/admin/zoneconfig.service';
import { InputRequest } from '../../models/request/inputreq.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { CmConfirmationDialogComponent } from '../../common/cm-confirmation-dialog/cm-confirmation-dialog.component';
import { ZoneConfigurationFormComponent } from './zone-configuration-form/zone-configuration-form.component';


@Component({
  selector: 'app-zone-configuration',
  imports: [
    CommonModule,
    CmTableComponent,
    CmInputComponent,
    CmSelect2Component,MatCardModule
    
  ],
  templateUrl: './zone-configuration.component.html',
  styleUrl: './zone-configuration.component.css'
})




export class ZoneConfigurationComponent  {
loaderService =inject(LoaderService)
router = inject(Router);
_headerName = 'Project Configuration Table';
headArr: any[] = [];
isProjectOptionsLoaded = false;
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
isSearch: boolean = false;
closeResult!: string;
searchText!:string;
selectedProject: any;
selectedStatus: any;
form!: FormGroup;

collectionSize = 2;
searchInputSettings = {
  labelHeader: 'Search',
  placeholder: 'Type to search...',
  formFieldClass: '', 
  labelClass: 'form-label',
  appearance: 'fill',
  isDisabled: false,
  color: 'primary'
};
squareSettings = {
  labelHeader: 'Search',
  formFieldClass: 'cm-square-input',
       placeholder: 'Search (minimum 3 letters)',
  appearance: 'outline',
  isDisabled: false
};
roundedSettings = {
  labelHeader: 'Search',
  formFieldClass: 'cm-pill-input',
  appearance: 'fill',
  isDisabled: false
};
projectSelectSettings = {
  labelHeader: 'Select Name',
  lableClass: 'form-label',
  formFieldClass: '', 
  appearance: 'fill',
  options: []
};
   statusSelectSettings = {
        labelHeader: 'Select Status',
          lableClass: 'form-label',
          formFieldClass: 'w-100',
          appearance: 'fill',
          options: [
            { name: 'Enable', value: true },
            { name: 'Disable', value: false },
            { name: 'All', value: null }
          ]
        };

gridArr = [
  {
   zonename: 'Alpha Project',
   description:'as',
   status: 'Active',
   action:''
    
  },
  {
    zonename: 'Alpha Project',
    description:'as',
    status: 'Active',
    action:''
     
   },
   {
    zonename: 'Alpha Project',
    description:'as',
    status: 'Active',
    action:''
     
   },
 
];


constructor(private fb: FormBuilder,
   private service: zoneconfigservice,
   private dialog: MatDialog) {}
ngOnInit(): void {
   this.form = this.fb.group({
     selectedProject: [''],
     selectedStatus: [''],
     searchText: ['']
   });



   this.buildHeader();
   this.getZoneConfigList();
   this.GetZoneList();



     this.form.get('searchText')?.valueChanges
       .pipe(
         debounceTime(300), 
         distinctUntilChanged() 
       )
       .subscribe(value => {
            if (value && value.length >= 3) {
            this.pager=0;
            this.perPage=10;
         this.getFilteredList();
       } else if (!value || value.length === 0) {
          this.pager=0;
            this.perPage=10;
          this.getFilteredList();
       }
       });
   

}

 submit(){
    this.pager=0;
         this.perPage=10;
  this.getFilteredList();
 }

 GetZoneList() {
  this.service.GetAll().pipe(withLoader(this.loaderService)).subscribe((response:any) => {


    const items = response.result?.items || [];

    const projectOptions = items.map((item: any) => ({
      name: item.zoneName,  
      value: item.id        
    }));
  
    projectOptions.unshift({
      name: 'All',
      value: null
    });

    this.projectSelectSettings.options = projectOptions;
    this.form.controls['selectedProject'].setValue({
  name: 'All',
  value: null
});

this.form.controls['selectedStatus'].setValue({
  name: 'All',
  value: null
});
    this.isProjectOptionsLoaded = true;
  }, error => {
    console.error('Error fetching project list', error);
  });
}
  getFilteredList() {
      this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
    const selectedProjectId = this.form.controls['selectedProject'].value.value;
     const selectedStatus = this.form.controls['selectedStatus'].value.value;
     const search = this.form.controls['searchText'].value
     this.service.GetFilteredList(0,search,selectedStatus,this.MaxResultCount,this.SkipCount,selectedProjectId).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
    //  const items = response?.result || [];
         
    //      this.items=items;
         const items = response.result?.items;
         this.items=items;
 const totalCount=response.result?.totalCount;


        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           

            //let _data = JSON.parse(element);
            element.projName = element.projectName;
            element.description = element.description;
            element.mapLabel=element.mapLabel;
            element.apiLabel=element.label;
            element.isActive = !!element.isActive; 
            
              element.button = [
    { label: 'Edit', icon: 'edit', type: 'edit' },
    { label: 'Delete', icon: 'delete', type: 'delete' }
  ];




         
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
onProjectSelected(event: any) {
  console.log('Selected Project:', event);
}

onStatusChange(value: any) {
  this.selectedStatus = value;
  console.log('Selected Status:', value);
  // Apply filtering or logic here
}
onProjectChange(value: any) {
  this.selectedProject = value;
  console.log('Selected Project:', value);
  // Apply filtering or logic here
}
getProjList() {
  this.service.GetProjectList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
    const items = response?.result || [];

    const projectOptions = items.map((item: any) => ({
      name: item.name || item.shortCode,
      value: item.id
    }));

  
    projectOptions.unshift({
      name: 'All',
      value: null
    });

    this.projectSelectSettings.options = projectOptions;
//     this.form.controls['selectedProject'].setValue({
//   name: 'All',
//   value: null
// });

// this.form.controls['selectedStatus'].setValue({
//   name: 'All',
//   value: null
// });
    this.isProjectOptionsLoaded = true;
  }, error => {
    console.error('Error fetching project list', error);
  });
}
// openDialog() {
//           const dialogRef = this.dialog.open(ZoneConfigurationFormComponent, {
            
//             width: '800px', 
             
//             disableClose: true,  
//             autoFocus: false,   
//             data: {}               
//           });
      
         
//           dialogRef.afterClosed().subscribe(result => {
//              this.getZoneConfigList();
              
//             if (result) {
            
//               console.log('Dialog result:', result);
             
//             }
//           });
// }
openDialog() {
      this.router.navigate(['/admin/zoneform']);   
          
}

buildHeader() {  
          this.headArr = [
            { header: 'Zone Name', fieldValue: 'zoneName', position: 1 },
            { header: 'Description', fieldValue: 'description', position: 2 },
            { header: 'Status', fieldValue: 'isActive',type:'boolean', position: 3 },
            { header: 'Action', fieldValue: 'button', position: 4 }
          ];
;}     
handleBtnAction(e: any) {
          console.log('Button Action:', e);
}
handlePageChange(pageno: number) {
  console.log('Page Changed to:', pageno);
}
handlePerPageChange(records: number) {
  console.log('Records Per Page:', records);
}
handleSearchWithId(item: any) {
  console.log('Row clicked:', item);
}
handleSearch(term: string) {
  console.log('Search term:', term);
}
  onPageChange(event:any) {
    console.log(event);
  if (event.type === 'pageChange') {
    this.pager = event.pageNo;
  this.getFilteredList();
  }
}


onPageRecordsChange(event:any ) {
  console.log(event);
  if (event.type === 'perPageChange') {
    this.perPage = event.perPage;
    this.pager = 0;
    this.getFilteredList();
  }
}


onPaginationChanged(event: { pageNo: number; perPage: number }) {
  if (this.perPage !== event.perPage) {
    this.perPage = event.perPage;
    this.pager = 0; 
  } else {
    this.pager = event.pageNo;
  }

  this.getFilteredList(); 
}
onRowClicked(row: any) {
        console.log('Row clicked:', row);
}
    
    onButtonClicked({ event, data }: { event: any; data: any }) {
  if (event.type === 'edit') {
    this.editRow(data);
    console.log(data);
  } else if (event.type === 'delete') {
    this.deleteRow(data);
  }
}
editRow(rowData: any) {
  this.router.navigate(['/admin/zoneform'], {
    state: {
      mode: 'edit',
      record: rowData
    }
  });
}
deleteRow(rowData: any): void {
  const dialogRef = this.dialog.open(CmConfirmationDialogComponent, {
    width: '400px',
      position: { top: '20px' },
  panelClass: 'custom-confirm-dialog',
    data: {
      title: 'Confirm Delete',
     message: `Are you sure?<div style="margin-top: 8px;">Zone: <b>${rowData.zoneName}</b> will be deleted.</div>`,

      type: 'delete',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
     
      this.service.Delete(rowData.id).pipe(withLoader(this.loaderService)).subscribe({
        next: (res:any) => {
          if (res.success) {
            this.getZoneConfigList();
            console.log('Deleted successfully');
           
          } else {
            console.error('Delete failed:', res.error);
          }
        },
        error: (err) => {
          console.error('API error:', err);
        }
      });
    } else {
      console.log('User cancelled');
    }
  });
}
getZoneConfigList() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.service.GetAll().pipe(withLoader(this.loaderService)).subscribe((response:any) => {

         const items = response.result?.items;
         
         this.items=items;

 const totalCount=response.result?.totalCount;





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
       
}
