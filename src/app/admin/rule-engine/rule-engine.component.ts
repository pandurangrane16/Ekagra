import { Component,inject } from '@angular/core';
import { ProjectConfigurationFormComponent } from '../project-configuration/project-configuration-form/project-configuration-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { projconfigservice } from '../../services/admin/progconfig.service';
import { InputRequest } from '../../models/request/inputreq.model';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';

@Component({
  selector: 'app-rule-engine',
  imports: [CmTableComponent,CmSelect2Component,CmInputComponent],
  templateUrl: './rule-engine.component.html',
  styleUrl: './rule-engine.component.css'
})
export class RuleEngineComponent {
 loaderService=inject(LoaderService)
      _headerName = 'Rule Engine';
      headArr: any[] = [];
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
      list!:any;
      isProjectOptionsLoaded = false;
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
        private service: projconfigservice,
        ) {}
        
        
      ngOnInit(): void {
          this.form = this.fb.group({
            selectedProject: [''],
            selectedStatus: [''],
            searchText: ['']
          });
          this.buildHeader();
          this.getProjConfigList();
          this.getProjList();
       
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
      openDialog() {
          const dialogRef = this.dialog.open(ProjectConfigurationFormComponent, {
            width: '500px',         
            disableClose: true,     
            data: {}               
          });
      
          // Optional: handle result
          dialogRef.afterClosed().subscribe((result:any) => {
            if (result) {
              console.log('Dialog result:', result);
             
            }
          });
        }
        buildHeader() {  
          this.headArr = [
            { header: 'Project', fieldValue: 'name', position: 1 },
            { header: 'API Name', fieldValue: 'description', position: 2 },
            { header: 'URL', fieldValue: 'isActive',"type": "boolean", position: 3 },
           
            { header: 'Type', fieldValue: 'ruleEngine',"type": "boolean", position: 4 },
            { header: 'Active', fieldValue: 'map',"type": "boolean", position: 5 },
            { header: 'Action', fieldValue: 'action', position: 6 }
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
               onPageChange(event:{type:string,pageNo: number}) {
          console.log('Page Changed:', event.pageNo);
        }
        onPageRecordsChange(event:{type:string,perPage: number}) {
              console.log('Records Per Page:', event.perPage);
        }
        onRowClicked(row: any) {
                console.log('Row clicked:', row);
               }
            
        onButtonClicked(event: any) {
                 console.log('Button clicked:', event);
               }
        
        getProjConfigList() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.service.GetAll().pipe(withLoader(this.loaderService)).subscribe((response:any) => {

         const items = response.result?.items;
         
         this.items=items;







        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           

            //let _data = JSON.parse(element);
            element.name = element.name;
            element.description = element.description;
            element.isActive = !!element.isActive; 
            element.ruleEngine = !!element.ruleEngine;
            element.map =!! element.map;

            




         
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
       
  getProjList() {
  this.service.GetProjectList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
    const items = response?.result || [];

 
    const projectOptions = items.map((item: any) => ({
      name: item.name || item.shortCode, 
      value: item.id
    }));

 
    this.projectSelectSettings.options = projectOptions;
    this.isProjectOptionsLoaded = true;
  }, (error:any) => {
    console.error('Error fetching project list', error);
  });
}
     
       

      
    
}