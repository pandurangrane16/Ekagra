
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { zoneconfigservice } from '../../services/admin/zoneconfig.service';
import { InputRequest } from '../../models/request/inputreq.model';
import { ZoneConfigurationFormComponent } from './zone-configuration-form/zone-configuration-form.component';


@Component({
  selector: 'app-zone-configuration',
  imports: [
    CommonModule,
    CmTableComponent,
    CmInputComponent,
    CmSelect2Component
    
  ],
  templateUrl: './zone-configuration.component.html',
  styleUrl: './zone-configuration.component.css'
})




export class ZoneConfigurationComponent  {


_headerName = 'Project Configuration Table';
headArr: any[] = [];
isProjectOptionsLoaded = false;
items:any;
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
perPage = 10;
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
   this.getProjList();

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
  this.service.GetProjectList().subscribe(response => {
    const items = response?.result || [];

 
    const projectOptions = items.map((item: any) => ({
      name: item.name || item.shortCode, 
      value: item.id
    }));

 
    this.projectSelectSettings.options = projectOptions;
    this.isProjectOptionsLoaded = true;
  }, error => {
    console.error('Error fetching project list', error);
  });
}  
openDialog() {
          const dialogRef = this.dialog.open(ZoneConfigurationFormComponent, {
            
            width: '500px', 
             
            disableClose: true,  
            autoFocus: false,   
            data: {}               
          });
      
          // Optional: handle result
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              console.log('Dialog result:', result);
             
            }
          });
}
buildHeader() {  
          this.headArr = [
            { header: 'Zone Name', fieldValue: 'zoneName', position: 1 },
            { header: 'Description', fieldValue: 'description', position: 2 },
            { header: 'Status', fieldValue: 'isActive',type:'boolean', position: 3 },
            { header: 'Action', fieldValue: 'action', position: 4 }
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
onPageChange(pageNo: number) {
  console.log('Page Changed:', pageNo);
}
onPageRecordsChange(perPage: number) {
      console.log('Records Per Page:', perPage);
}
onRowClicked(row: any) {
        console.log('Row clicked:', row);
}
onButtonClicked(event: any) {
  console.log('Button clicked:', event);
}
getZoneConfigList() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.service.GetAll().subscribe(response => {

         const items = response.result?.items;
         
         this.items=items;







        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           

            //let _data = JSON.parse(element);
            element.zoneName = element.zoneName;
            element.description = element.description;
             element.isActive = !!element.isActive; 
         

        




         
          });
          // var _length = data.totalCount / Number(this.recordPerPage);
          // if (_length > Math.floor(_length) && Math.floor(_length) != 0)
          //   this.totalRecords = Number(this.recordPerPage) * (_length);
          // else if (Math.floor(_length) == 0)
          //   this.totalRecords = 10;
          // else
          //   this.totalRecords = data.totalRecords;
          // this.totalPages = this.totalRecords / this.pager;
          //this.getMediaByStatus(this.tabno);
        }
      })
    }       
       
}
