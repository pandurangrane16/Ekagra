
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
//import { MatDialog } from '@angular/material/dialog';
//import { SiteConfigurationFormComponent } from './site-configuration-form/site-configuration-form.component';
import { Router } from '@angular/router';
import { siteconfigservice } from '../../services/admin/siteconfig.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';




@Component({
  selector: 'app-site-configuration',
  standalone: true,
  imports: [
    CommonModule,
    CmTableComponent,
    CmInputComponent,
    CmSelect2Component
    
  ],
  templateUrl: './site-configuration.component.html',
  styleUrl: './site-configuration.component.css'
})
export class SiteConfigurationComponent  {

router = inject(Router);
isProjectOptionsLoaded = false;
_headerName = 'Project Configuration Table';
headArr: any[] = [];
selectedProject: any;
  MaxResultCount=10;
  SkipCount=0;
  perPage=10;
  pageNo=0;
   recordPerPage: number = 10;
     pager: number = 0;
selectedStatus: any;
form!: FormGroup;
totalRecords = 2;
items :any;

totalPages = 1;
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
  labelHeader: 'Select Project',
  lableClass: 'form-label',
  formFieldClass: '', 
  appearance: 'outline',
  options:[]
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
   projectname: 'Alpha Project',
   siteid:'as',
   sitename:'as',
   lat:'1',
   long:'1',
   description:'as',
   status: 'Active',
   action:''
    
  },
  {
    projectname: 'Alpha Project',
    siteid:'as',
    sitename:'as',
    lat:'1',
    long:'1',
    description:'as',
    status: 'Active',
    action:''
     
   }
];


constructor(private fb: FormBuilder,private service:siteconfigservice
  //,private dialog: MatDialog
  ) {}
ngOnInit(): void {
   this.form = this.fb.group({
     selectedProject: [''],
     selectedStatus: [''],
     searchText: ['']
   });
   this.buildHeader();
   this.getProjList();
   this.getSiteConfigList();

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

 getSiteConfigList() {
      
      this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
      const selectedProjectId = this.form.controls['selectedProject'].value.value;
     const selectedStatus = this.form.controls['selectedStatus'].value.value;
     const search = this.form.controls['searchText'].value
      this.service.GetAll(this.MaxResultCount,this.SkipCount).subscribe(response => {
       
         const items = response.result?.items;
         const totalCount=response.result?.totalCount;
       


         console.log("List before mapping:", items);
         this.items = items.map((element: any) => ({
  ...element,

 
    siteId : element.siteId,
    siteName : element.siteName,
    lat:element.lat,
    long:element.long,
    description:element.description,
    name: element.projectName,
    isActive: !!element.isActive,
    button: [
    { label: 'Edit', icon: 'edit', type: 'edit' },
    { label: 'Delete', icon: 'delete', type: 'delete' }
  ]
}));
 console.log("list2: " + this.items)



        if (Array.isArray(items)) {
         
        
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
getProjList() {
  this.service.GetProjectList().subscribe(response => {
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
    this.isProjectOptionsLoaded = true;
  }, error => {
    console.error('Error fetching project list', error);
  });
}


 submit(){
  this.getFilteredList();
 }
  getFilteredList() {
     this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
    const selectedProjectId = this.form.controls['selectedProject'].value.value;
     const selectedStatus = this.form.controls['selectedStatus'].value.value;
     const search = this.form.controls['searchText'].value
     this.service.GetFilteredList(selectedProjectId,search,selectedStatus,this.MaxResultCount,this.SkipCount).subscribe(response => {
    //  const items = response?.result || [];
         
    //      this.items=items;
         const items = response.result?.items;
         this.items=items;

const totalCount=response.result?.totalCount;
        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
               
        element.siteId = element.siteId;
            element.siteName = element.siteName;
            element.lat=element.lat;
            element.long=element.long;
            element.description=element.description;
            element.name=element.projectName;
            
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
openDialog() {

this.router.navigate(['/admin/siteconfigmng']);
          
}
buildHeader() {  
          this.headArr = [
            { header: 'Project Name', fieldValue: 'name', position: 1 },
            { header: 'Site Id', fieldValue: 'siteId', position: 2 },
            { header: 'Site Name', fieldValue: 'siteName', position: 3 },
            { header: 'Lat', fieldValue: 'lat', position: 4 },
            { header: 'Long', fieldValue: 'long', position: 5 },
            { header: 'Description', fieldValue: 'description', position: 6 },
            { header: 'Status', fieldValue: 'isActive',type:'boolean', position: 5 },
            { header: 'Action', fieldValue: 'button', position: 7 }
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
       console.log(data);
    this.editRow(data);
    console.log(data);
  } else if (event.type === 'delete') {
   
  }
}
// deleteRow(rowData: any): void {
//   const dialogRef = this.dialog.open(CmConfirmationDialogComponent, {
//     width: '400px',
//       position: { top: '20px' },
//   panelClass: 'custom-confirm-dialog',
//     data: {
//       title: 'Confirm Delete',
//      message: `Are you sure?<div style="margin-top: 8px;">Project: <b>${rowData.name}</b> will be deleted.</div>`,

//       type: 'delete',
//       confirmButtonText: 'Confirm',
//       cancelButtonText: 'Cancel'
//     }
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     if (result) {
     
//       this.service.Delete(rowData.id).subscribe({
//         next: (res) => {
//           if (res.success) {
//             this.getProjfieldConfigList();
//             console.log('Deleted successfully');
           
//           } else {
//             console.error('Delete failed:', res.error);
//           }
//         },
//         error: (err) => {
//           console.error('API error:', err);
//         }
//       });
//     } else {
//       console.log('User cancelled');
//     }
//   });
// }

editRow(rowData: any) {
  this.router.navigate(['/admin/siteconfigmng'], {
    state: {
      mode: 'edit',
      record: rowData
    }
  });
}
       
}
