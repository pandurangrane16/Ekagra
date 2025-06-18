

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-bulk-upload',
  imports: [
    CommonModule,
    CmTableComponent,
   
    CmSelect2Component,
    ReactiveFormsModule
    
  ],
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.css'
})
export class BulkUploadComponent {


_headerName = 'Project Configuration Table';
headArr: any[] = [];
selectedProject: any;
selectedStatus: any;
form!: FormGroup;
totalRecords = 2;
perPage = 10;
totalPages = 1;
collectionSize = 2;

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

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    // Handle selected file logic here
  }
}

onDownloadClicked() {
  // Replace with actual file download logic
  window.open('/assets/sample-file.xlsx', '_blank');
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
