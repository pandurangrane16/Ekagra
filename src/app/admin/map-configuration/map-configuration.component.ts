
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { MapConfigurationFormComponent } from './map-configuration-form/map-configuration-form.component';


@Component({
  selector: 'app-map-configuration',
  imports: [
    CommonModule,
    CmTableComponent,
    CmInputComponent,
    CmSelect2Component
    
  ],
  templateUrl: './map-configuration.component.html',
  styleUrl: './map-configuration.component.css'
})

export class MapConfigurationComponent  {


_headerName = 'Project Configuration Table';
headArr: any[] = [];
selectedProject: any;
selectedStatus: any;
form!: FormGroup;
totalRecords = 2;
perPage = 10;
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
  options: [
    { name: 'apple', value: 'A' },
    { name: 'mango', value: 'B' },
    { name: 'bananannanan', value: 'C' }
  ]
};
statusSelectSettings = {
  labelHeader: 'Status',
  lableClass: 'form-label',
  formFieldClass: 'w-100',
  appearance: 'outline',
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Archived', value: 'archived' }
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


constructor(private fb: FormBuilder,private dialog: MatDialog) {}
ngOnInit(): void {
   this.form = this.fb.group({
     selectedProject: [''],
     selectedStatus: [''],
     searchText: ['']
   });
   this.buildHeader();

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
openDialog() {
          const dialogRef = this.dialog.open(MapConfigurationFormComponent, {
            
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
            { header: 'Name', fieldValue: 'name', position: 1 },
            { header: 'Display Name', fieldValue: 'displayname', position: 2 },
            { header: 'SourceUrl', fieldValue: 'sourceurl', position: 3 },
            { header: 'Description', fieldValue: 'description', position: 4 },
            { header: 'MinZoom', fieldValue: 'minzoom', position: 5 },
            { header: 'MaxZoom', fieldValue: 'maxzoom', position: 6 },
            { header: 'WmsLayer', fieldValue: 'wmslayer', position: 7 },
            { header: 'Lat', fieldValue: 'lat', position: 8 },
            { header: 'Long', fieldValue: 'long', position: 9 },
            { header: 'Status', fieldValue: 'status', position: 10 },
            { header: 'Action', fieldValue: 'action', position: 11 }
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
       
}
