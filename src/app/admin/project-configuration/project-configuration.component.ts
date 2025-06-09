
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectConfigurationFormComponent } from '../project-configuration-form/project-configuration-form.component';


@Component({
    selector: 'app-project-configuration',
    standalone: true,
    imports: [
      CommonModule,
      CmTableComponent,
      CmInputComponent,
      CmSelect2Component
      
    ],
    templateUrl: './project-configuration.component.html',
    // styleUrl: './project-configuration.component.css',
    styleUrls: ['./project-configuration.component.css']
})

    // export class ProjectConfigurationComponent implements OnInit {
    //     headArr: any[] = [];
    //     gridArr: any[] = [];
      
    //     totalRecords: number = 0;
    //     perPage: number = 10;
    //     totalPages: number = 1;
    //     collectionSize: number = 0;
      
    //     ngOnInit(): void {
            
    //       this.headArr = [
    //         { header: 'Name', fieldValue: 'name', position: 1 },
    //         { header: 'Status', fieldValue: 'status', position: 2 },
    //         { header: 'Actions', fieldValue: 'button', position: 3 }
    //       ];
      
    //       this.gridArr = [
    //         {
    //           name: 'Item 1',
    //           status: 'Active',
    //           button: [{ label: 'Edit' }]
    //         },
    //         {
    //           name: 'Item 2',
    //           status: 'Inactive',
    //           button: [{ label: 'View' }]
    //         }
    //       ];
      
    //       this.totalRecords = this.gridArr.length;
    //       this.collectionSize = this.gridArr.length;
    //     }
      
    //     onPageChange(pageNo: number) {
    //       console.log('Page Changed:', pageNo);
    //     }
      
    //     onPageRecordsChange(perPage: number) {
    //       console.log('Records Per Page:', perPage);
    //     }
      
    //     onRowClicked(row: any) {
    //       console.log('Row clicked:', row);
    //     }
      
    //     onButtonClicked(event: any) {
    //       console.log('Button clicked:', event);
    //     }
    //   }

    export class ProjectConfigurationComponent implements OnInit {

        _headerName = 'Project Configuration Table';
        headArr: any[] = [];

        selectedProject: any;
        selectedStatus: any;
        
        onProjectChange(value: any) {
          this.selectedProject = value;
          console.log('Selected Project:', value);
          // Apply filtering or logic here
        }

        projectSelectSettings = {
          labelHeader: 'Select Project',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: [
            { name: 'apple', value: 'A' },
            { name: 'mango', value: 'B' },
            { name: 'bananannanan', value: 'C' }
          ]
        };
        
        onStatusChange(value: any) {
          this.selectedStatus = value;
          console.log('Selected Status:', value);
          // Apply filtering or logic here
        }
      

        statusSelectSettings = {
          lableClass: 'form-label',
          formFieldClass: 'w-100',
          appearance: 'fill',
          options: [
            { name: 'Active', value: 'active' },
            { name: 'Inactive', value: 'inactive' },
            { name: 'Archived', value: 'archived' }
          ]
        };
        onProjectSelected(event: any) {
          console.log('Selected Project:', event);
        }
        
        
      
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
        form!: FormGroup;
        totalRecords = 2;
        perPage = 10;
        totalPages = 1;
        collectionSize = 2;
      
       
        constructor(private fb: FormBuilder,private dialog: MatDialog) {}
        ngOnInit(): void {
          this.form = this.fb.group({
            selectedProject: [''],
            selectedStatus: [''],
            searchText: ['']
          });
          this.buildHeader();
       
        }

        openDialog() {
          const dialogRef = this.dialog.open(ProjectConfigurationFormComponent, {
            width: '500px',         
            disableClose: true,     
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
            { header: 'Description', fieldValue: 'description', position: 2 },
            { header: 'Status', fieldValue: 'status', position: 3 },
            { header: 'Rule Engine', fieldValue: 'ruleEngine', position: 4 },
            { header: 'Map', fieldValue: 'map', position: 5 },
            { header: 'Action', fieldValue: 'action', position: 6 }
          ];
          ;}
      
        handleBtnAction(e: any) {
          console.log('Button Action:', e);
        }
      
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
        
          isDisabled: false
        };
        
        roundedSettings = {
          labelHeader: 'Search',
          formFieldClass: 'cm-pill-input',
          appearance: 'fill',
          isDisabled: false
        };
        
        
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

      

  
  

 
  
 




