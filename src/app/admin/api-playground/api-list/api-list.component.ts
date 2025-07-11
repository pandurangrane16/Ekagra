
import { Component,inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { InputRequest } from '../../../models/request/inputreq.model';
import { apiplaygroundservice } from '../../../services/admin/apiplayground.service';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CmConfirmationDialogComponent } from '../../../common/cm-confirmation-dialog/cm-confirmation-dialog.component';



@Component({
    selector: 'app-api-list',
    standalone: true,
    imports: [
      CommonModule,
      CmTableComponent,
      CmInputComponent,
      CmSelect2Component,
      MatCardModule
      
    ],
    templateUrl: './api-list.component.html',
   
    styleUrls: ['./api-list.component.css']
})

 

    export class ApiListComponent implements OnInit {
router = inject(Router);
      _headerName = 'API List';
      headArr: any[] = [];
      items:any;
      _request: any = new InputRequest();
      totalPages: number = 1;
      pager: number = 1;
        MaxResultCount=10;
  SkipCount=0;
  perPage=10;
  pageNo=0;
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
      list!:any;
      isProjectOptionsLoaded = false;
      isProjtypeOptionsLoaded = false;
      gridArr = [
           {
            name: 'Alpha Project',
            status:'as',
            ruleEngine:'as',
            description:'as',
            map: 'Active',
             action:''
             
           },
           {
            name: 'Alpha Project',
            ruleEngine:'as',
            map:'as',
            description:'as',
             status: 'Active',
             action:''
           }
         ];
      projectSelectSettings = {
          labelHeader: 'Select Project',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
          projectTypeSettings = {
          labelHeader: 'Project Type',
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
          isDisabled: false
        };
        
      roundedSettings = {
          labelHeader: 'Search',
          formFieldClass: 'cm-pill-input',
          appearance: 'fill',
          isDisabled: false
        };

      constructor(private fb: FormBuilder,
        private dialog: MatDialog,
        private service: apiplaygroundservice,
        ) {}
        
        
      ngOnInit(): void {
          this.form = this.fb.group({
            selectedProject: [''],
            selectedStatus: [''],
            searchText: [''],
            selectedProjType:['']
          });
          this.buildHeader();
          this.getApiList();
          this.getProjList();
          this.GetProjectType();


            this.form.get('searchText')?.valueChanges
              .pipe(
                debounceTime(300), 
                distinctUntilChanged() 
              )
              .subscribe(value => {
                   if (value && value.length >= 3) {
                       this.perPage=10;
                 this.pager=0;
                this.getFilteredList();
              } else if (!value || value.length === 0) {

                 this.perPage=10;
                 this.pager=0;
                 this.getFilteredList();
              }
              });
       
        }

      onProjectChange(value: any) {
          this.selectedProject = value;
          console.log('Selected Project:', value);
          // Apply filtering or logic here
        }

      onStatusChange(value: any) {
          this.selectedStatus = value;
          console.log('Selected Status:', value);
          // Apply filtering or logic here
        }

      onProjectSelected(event: any) {
          console.log('Selected Project:', event);
        }
         submit(){
          this.pager=0;
          this.perPage=10;
  this.getFilteredList();
 }
    

        openDialog() {
    //  this.router.navigate(['/admin/projform']);   
          
}
        buildHeader() {  
          this.headArr = [
            { header: 'Project Name', fieldValue: 'name', position: 1 },
            { header: 'Api Name', fieldValue: 'apiname', position: 2 },
            { header: 'Type', fieldValue: 'type2', position: 3 },
           
            { header: 'Method', fieldValue: 'method', position: 4 },
            { header: 'Status', fieldValue: 'isActive',"type": "boolean", position: 5 },
            { header: 'BaseUrl', fieldValue: 'baseurl', position: 6 },
            { header: 'Action', fieldValue: 'button', position: 7}
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
deleteRow(rowData: any): void {
  const dialogRef = this.dialog.open(CmConfirmationDialogComponent, {
    width: '400px',
      position: { top: '20px' },
  panelClass: 'custom-confirm-dialog',
    data: {
      title: 'Confirm Delete',
     message: `Are you sure?<div style="margin-top: 8px;">API: <b>${rowData.projectName}</b> will be deleted.</div>`,

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
            this.getApiList();
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
  // this.router.navigate(['/admin/projform'], {
  //   state: {
  //     mode: 'edit',
  //     record: rowData
  //   }
  // });
}
        
        getApiList() {
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
           

            console.log(element.type)
         
             element.name = element.projectName;
            element.apiname = element.apiName;
            element.isActive = !!element.isActive; 
              element.method = element.httpMethod;
             element.baseurl = element.baseURL;

const matched = (this.projectTypeSettings.options as { name: string; value: any }[])
  .find(opt => String(opt.value) === String(element.type));

element.type2 = matched ? matched.name : element.type;


                       element.button = [
    { label: 'Edit', icon: 'edit', type: 'edit' },
    { label: 'Delete', icon: 'delete', type: 'delete' }
  ];
            
console.log(element.type,element.type2)
console.log(this.projectTypeSettings.options)



         
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
      getFilteredList() {
    const selectedProjectId = this.form.controls['selectedProject'].value.value;
     const selectedStatus = this.form.controls['selectedStatus'].value.value;
     const projtype = this.form.controls['selectedProjType'].value.value;
     const search = this.form.controls['searchText'].value
        this.MaxResultCount=this.perPage;
      this.SkipCount=this.MaxResultCount*this.pager;
      this.recordPerPage=this.perPage;
 
     this.service.GetFilteredList(selectedProjectId, projtype,search,selectedStatus,this.MaxResultCount,this.SkipCount).subscribe(response => {
    //  const items = response?.result || [];
         
    //      this.items=items;
         const items = response.result?.items;
         this.items=items;
           const totalCount=response.result?.totalCount;


        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           

             element.name = element.projectName;
            element.apiname = element.apiName;
            element.isActive = !!element.isActive; 
              element.method = element.httpMethod;
             element.baseurl = element.baseURL;


const matched = (this.projectTypeSettings.options as { name: string; value: any }[])
  .find(opt => String(opt.value) === String(element.type));

element.type2 = matched ? matched.name : element.type;

         
            
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

GetProjectType() {
  this.service.GetProjectType().subscribe(response => {
    const items = response?.result || [];

    const projectOptions = items.map((item: any) => ({
      name: item.prmvalue, 
      value: item.rfu1
    }));

  
    projectOptions.unshift({
      name: 'All',
      value: null
    });

    this.projectTypeSettings.options = projectOptions;
this.form.controls['selectedProject'].setValue({
  name: 'All',
  value: null
});

this.form.controls['selectedProjType'].setValue({
  name: 'All',
  value: null
});

this.form.controls['selectedStatus'].setValue({
  name: 'All',
  value: null
});
    this.isProjtypeOptionsLoaded = true;
  }, error => {
    console.error('Error fetching project list', error);
  });
}
     
       

      
    
      }

      

  
  

 
  
 




