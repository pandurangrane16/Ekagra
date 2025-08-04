
import { Component,inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { InputRequest } from '../../models/request/inputreq.model';
import { projfieldconfigservice } from '../../services/admin/projfieldconfig.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { CmConfirmationDialogComponent } from '../../common/cm-confirmation-dialog/cm-confirmation-dialog.component';
import { ProjectFieldConfigurationFormComponent } from './project-field-configuration-form/project-field-configuration-form.component';


@Component({
  selector: 'app-project-field-configuration',
  standalone: true,
  imports: [
    CommonModule,
    CmTableComponent,
    CmInputComponent,
    CmSelect2Component,
    MatCardModule
    
  ],
  templateUrl: './project-field-configuration.component.html',
  styleUrl: './project-field-configuration.component.css'
})


export class ProjectFieldConfigurationComponent  {

router = inject(Router);
loaderService=inject(LoaderService)
  _headerName = 'Project Configuration Table';
  headArr: any[] = [];
  isProjectOptionsLoaded =false;
  MaxResultCount=10;
  SkipCount=0;
  perPage=10;
  pageNo=0;
  items:any;
  _request: any = new InputRequest();
  totalPages: number = 1;
  pager: number = 0;
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
    labelHeader: 'Select Project',
    lableClass: 'form-label',
    formFieldClass: '', 
    appearance: 'fill',
    options: [ ]
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
  
  
  constructor(private fb: FormBuilder,
     private service: projfieldconfigservice,
    private dialog: MatDialog) {}
  ngOnInit(): void {
     this.form = this.fb.group({
       selectedProject: [''],
       selectedStatus: [''],
       searchText: ['']
     });
     this.buildHeader();
    this.getProjList();
    this.getProjfieldConfigList();


  
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
  getProjfieldConfigList() {
      
      this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
      this.service.GetAll(this.MaxResultCount,this.SkipCount).pipe(withLoader(this.loaderService)).subscribe((response:any) => {

         const items = response.result?.items;
         const totalCount=response.result?.totalCount;
         this.items=items;


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
    
    
    onButtonClicked({ event, data }: { event: any; data: any }) {
  if (event.type === 'edit') {
    this.editRow(data);
    console.log(data);
  } else if (event.type === 'delete') {
    this.deleteRow(data);
  }
}
editRow(rowData: any) {
  this.router.navigate(['/admin/projfieldform'], {
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
     message: `Are you sure?<div style="margin-top: 8px;">Project Field: <b>${rowData.projectName}</b> will be deleted.</div>`,

      type: 'delete',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    debugger;
    if (result) {
     
      this.service.Delete(rowData.id).pipe(withLoader(this.loaderService)).subscribe({
        next: (res:any) => {
          if (res.success) {
            this.getProjfieldConfigList();
            console.log('Deleted successfully');
           console.error('Deleted successfully',Response);
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


  // openDialog() {
  //           const dialogRef = this.dialog.open(ProjectFieldConfigurationFormComponent, {
              
  //             width: '500px', 
               
  //             disableClose: true,  
  //             autoFocus: false,   
  //             data: {}               
  //           });
        
  //           // Optional: handle result
  //           dialogRef.afterClosed().subscribe(result => {
  //             this.getProjfieldConfigList();
  //             if (result) {
  //               console.log('Dialog result:', result);
               
  //             }
  //           });
  // }

          openDialog() {
      this.router.navigate(['/admin/projfieldform']);   
          
}
  buildHeader() {  
            this.headArr = [
              { header: 'Project Name', fieldValue: 'projName', position: 1 },
              { header: 'Map Label', fieldValue: 'mapLabel', position: 2 },
              { header: 'Api Label', fieldValue: 'apiLabel', position: 3 },
              { header: 'Description', fieldValue: 'description', position: 4 },
              { header: 'Status', fieldValue: 'isActive',type:'boolean', position: 5 },
              { header: 'Action', fieldValue: 'button', position: 6 }
            ];
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

 submit(){
    this.pager=0;
         this.perPage=10;
  this.getFilteredList();
 }
  getFilteredList() {
      this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
    const selectedProjectId = this.form.controls['selectedProject'].value.value;
     const selectedStatus = this.form.controls['selectedStatus'].value.value;
     const search = this.form.controls['searchText'].value
     this.service.GetFilteredList(selectedProjectId,search,selectedStatus,this.MaxResultCount,this.SkipCount).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
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

  handleBtnAction(e: any) {
            console.log('Button Action:', e);
  }
  handlePageChange(pageno: number) {
    console.log('Page Changed to:', pageno);
    this.pageNo=pageno;
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
  // onPageChange(pageNo: number) {
  //   console.log('Page Changed:', pageNo);
  //   this.pager=pageNo;
    
  // }


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

         
  }
