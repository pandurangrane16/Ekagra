
import { Component,inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { mapconfigservice } from '../../services/admin/mapconfig.service';
import { InputRequest } from '../../models/request/inputreq.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CmConfirmationDialogComponent } from '../../common/cm-confirmation-dialog/cm-confirmation-dialog.component';
import { MapConfigurationFormComponent } from './map-configuration-form/map-configuration-form.component';


@Component({
  selector: 'app-map-configuration',
  imports: [
    CommonModule,
    CmTableComponent,
    CmInputComponent,
    CmSelect2Component,MatCardModule
    
  ],
  templateUrl: './map-configuration.component.html',
  styleUrl: './map-configuration.component.css'
})

export class MapConfigurationComponent  {

router = inject(Router);
_headerName = 'Project Configuration Table';
headArr: any[] = [];
isProjectOptionsLoaded = false;
items:any;
_request: any = new InputRequest();
totalPages: number = 1;
MaxResultCount=10;
  SkipCount=0;
  perPage=10;
  pageNo=0;
   recordPerPage: number = 10;
     pager: number = 0;

totalRecords!: number;

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
   name: 'Alpha Project',
   displayname:'as',
   sourceurl:'as',
   description:'as',
   minzoom:'as',
   maxzoom:'as',
   wmslayer:'as',
   lat:'1',
   long:'1',
   status: 'Active',
   action:''
    
  },
  {
    name: 'Alpha Project',
    displayname:'as',
    sourceurl:'as',
    description:'as',
    minzoom:'as',
    maxzoom:'as',
    wmslayer:'as',
    lat:'1',
    long:'1',
    status: 'Active',
    action:''
     
   },
   {
    name: 'Alpha Project',
    displayname:'as',
    sourceurl:'as',
    description:'as',
    minzoom:'as',
    maxzoom:'as',
    wmslayer:'as',
    lat:'1',
    long:'1',
    status: 'Active',
    action:''
     
   }
];


constructor(private fb: FormBuilder,
   private service: mapconfigservice,
  private dialog: MatDialog) {}
ngOnInit(): void {
   this.form = this.fb.group({
     selectedProject: [''],
     selectedStatus: [''],
     searchText: ['']
   });
   this.buildHeader();
   this.getMapConfigList();
   this.GetMapList();

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

onProjectSelected(event: any) {
  console.log('Selected Project:', event);
}
GetMapList() {
  this.service.GetMapList().subscribe(response => {
    const items = response?.result || [];

    const projectOptions = items.map((item: any) => ({
      name: item.name || item.displayName,
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
  getFilteredList() {
      this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
    const selectedProjectId = this.form.controls['selectedProject'].value.value;
     const selectedStatus = this.form.controls['selectedStatus'].value.value;
     const search = this.form.controls['searchText'].value
     this.service.GetFilteredList(0,search,selectedStatus,this.MaxResultCount,this.SkipCount,selectedProjectId).subscribe(response => {
    //  const items = response?.result || [];
         
    //      this.items=items;
         const items = response.result?.items;
         this.items=items;
           const totalCount=response.result?.totalCount;


        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           
debugger;
                element.name = element.name;
           element.displayName = element.displayName;
           element.sourceURL = element.sourceURL;
           element.description = element.description;
           element.minZoom = element.minZoom;
           element.maxZoom = element.maxZoom;
           element.wmsLayer = element.wmsLayer;
           element.lat = element.lat;
           element.long = element.long;
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
// openDialog() {
//           const dialogRef = this.dialog.open(MapConfigurationFormComponent, {
            
//             width: '500px', 
             
//             disableClose: true,  
//             autoFocus: false,   
//             data: {}               
//           });
      
//           // Optional: handle result
//           dialogRef.afterClosed().subscribe(result => {
//             if (result) {
//               console.log('Dialog result:', result);
             
//             }
//           });
// }
          openDialog() {
      this.router.navigate(['/admin/mapform']);   
          
}
 submit(){
      this.pager=0;
         this.perPage=10;
  this.getFilteredList();
 }
buildHeader() {  
          this.headArr = [
            { header: 'Name', fieldValue: 'name', position: 1 },
            { header: 'Display Name', fieldValue: 'displayName', position: 2 },
            { header: 'SourceUrl', fieldValue: 'sourceURL', position: 3 , cellClass: 'wrap-text' },
            { header: 'Description', fieldValue: 'description', position: 4 },
            { header: 'MinZoom', fieldValue: 'minZoom', position: 5 },
            { header: 'MaxZoom', fieldValue: 'maxZoom', position: 6 },
            { header: 'WmsLayer', fieldValue: 'wmsLayer', position: 7 , cellClass: 'wrap-text' },
            { header: 'Lat', fieldValue: 'lat', position: 8 },
            { header: 'Long', fieldValue: 'long', position: 9 },
            { header: 'Status', fieldValue: 'isActive', type:'boolean',position: 10 },
            { header: 'Action', fieldValue: 'button', position: 11 }
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

deleteRow(rowData: any): void {
  const dialogRef = this.dialog.open(CmConfirmationDialogComponent, {
    width: '400px',
      position: { top: '20px' },
  panelClass: 'custom-confirm-dialog',
    data: {
      title: 'Confirm Delete',
     message: `Are you sure?<div style="margin-top: 8px;">Map: <b>${rowData.name}</b> will be deleted.</div>`,

      type: 'delete',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
     
      this.service.Delete(rowData.id).subscribe({
        next: (res) => {
          if (res.success) {
            this.getMapConfigList();
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
editRow(rowData: any) {
  this.router.navigate(['/admin/mapform'], {
    state: {
      mode: 'edit',
      record: rowData
    }
  });
}   
getMapConfigList() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.service.GetAll().subscribe(response => {

         const items = response.result?.items;
         
         this.items=items;
           const totalCount=response.result?.totalCount;







        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           
           element.name = element.name;
           element.displayName = element.displayName;
           element.sourceURL = element.sourceURL;
           element.description = element.description;
           element.minZoom = element.minZoom;
           element.maxZoom = element.maxZoom;
           element.wmsLayer = element.wmsLayer;
           element.lat = element.lat;
           element.long = element.long;
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
