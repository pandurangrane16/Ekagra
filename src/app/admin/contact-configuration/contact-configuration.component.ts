interface OptionItem {
  name: string;
  value: string;
}
 interface Select2Settings {
  labelHeader: string;
  lableClass: string;
  formFieldClass: string;
  appearance: string;
  options: OptionItem[];
}

import { Component } from '@angular/core';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { FormBuilder,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { OnInit } from '@angular/core';
import { projconfigservice } from '../../services/admin/progconfig.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputRequest } from '../../models/request/inputreq.model';
import { PramglobalService } from '../../services/admin/pramglobal.service';
@Component({
  selector: 'app-contact-configuration',
  imports: [CmInputComponent,
    CmSelect2Component,
    CmTableComponent
  ],
  templateUrl: './contact-configuration.component.html',
  styleUrl: './contact-configuration.component.css'
})

export class ContactConfigurationComponent implements OnInit{
  _headerName = 'Contact Configuration Table';
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
       ContactType: any;
       selectedStatus: any;
       form!: FormGroup;
       perPage = 10;
       collectionSize = 2;
       list!:any;
       isProjectOptionsLoaded = false;

           constructor(private fb: FormBuilder,
              //  private dialog: MatDialog,
               private service: projconfigservice,
               private PramglobalService:PramglobalService
               ) {}

  ngOnInit(): void {
            this.form = this.fb.group({
                        selectedProject: [''],
                        selectedStatus: [''],
                        searchText: [''],
                         ContactType: ['']
                      });
                      this.loadContactTypes('10','20');
                      this.buildHeader();
                      this.getProjConfigList();
                      this.getProjList();
            
            
                        this.form.get('searchText')?.valueChanges
                          .pipe(
                            debounceTime(300), 
                            distinctUntilChanged() 
                          )
                          .subscribe(value => {
                               if (value && value.length >= 3) {
                            this.getFilteredList();
                          } else if (!value || value.length === 0) {
                             this.getFilteredList();
                          }
                          });





          }

               getFilteredList() {
    const selectedProjectId = this.form.controls['selectedProject'].value.value;
     const selectedStatus = this.form.controls['selectedStatus'].value.value;
     const search = this.form.controls['searchText'].value
     this.service.GetFilteredList(selectedProjectId,search,selectedStatus).subscribe(response => {
    //  const items = response?.result || [];
         
    //      this.items=items;
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
            
              element.button = [
    { label: 'Edit', icon: 'edit', type: 'edit' },
    { label: 'Delete', icon: 'delete', type: 'delete' }
  ];




         
          });
        
        }
      })
    }    

             buildHeader() {  
          this.headArr = [
            { header: 'Name', fieldValue: 'name', position: 1 },
            { header: 'Description', fieldValue: 'description', position: 2 },
            { header: 'Status', fieldValue: 'isActive',"type": "boolean", position: 3 },
           
            { header: 'Rule Engine', fieldValue: 'ruleEngine',"type": "boolean", position: 4 },
            { header: 'Map', fieldValue: 'map',"type": "boolean", position: 5 },
            { header: 'Action', fieldValue: 'button', position: 6 }
          ];
          ;}
      
               getProjConfigList() {
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
            element.name = element.name;
            element.description = element.description;
            element.isActive = !!element.isActive; 
            element.ruleEngine = !!element.ruleEngine;
            element.map =!! element.map;

                       element.button = [
    { label: 'Edit', icon: 'edit', type: 'edit' },
    { label: 'Delete', icon: 'delete', type: 'delete' }
  ];
            




         
          });
          
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

  
    // projectOptions.unshift({
    //   name: 'All',
    //   value: null
    // });

    // this.projectSelectSettings.options = projectOptions;
    this.isProjectOptionsLoaded = true;
  }, error => {
    console.error('Error fetching project list', error);
  });
}
     
 squareSettings = {
          labelHeader: 'Search',
          formFieldClass: 'cm-square-input',
        
          isDisabled: false
        };
          ContactTypeSettings: Select2Settings = {
  labelHeader: 'Select Contact',
  lableClass: 'form-label',
  formFieldClass: '', 
  appearance: 'fill',
  options: []
};
 onContactTypeSelected(event: any) {
          console.log('Selected Project:', event);
        }

              submit(){
  // this.getFilteredList();
 }

 openDialog() {
            //  const dialogRef = this.dialog.open(ProjectFieldConfigurationFormComponent, {
               
            //    width: '500px', 
                
            //    disableClose: true,  
            //    autoFocus: false,   
            //    data: {}               
            //  });
         
            //  // Optional: handle result
            //  dialogRef.afterClosed().subscribe(result => {
            //    if (result) {
            //      console.log('Dialog result:', result);
                
            //    }
            //  });
   }
    onPageRecordsChange(event:{type:string,perPage: number}) {
              console.log('Records Per Page:', event.perPage);
        }
        onRowClicked(row: any) {
                console.log('Row clicked:', row);
               }
            
        onButtonClicked({ event, data }: { event: any; data: any }) {
  if (event.type === 'edit') {
    this.editRow(data);
    console.log(data);
  } else if (event.type === 'delete') {
    
  }
}

editRow(rowData: any) {
//   const dialogRef = this.dialog.open(ProjectConfigurationFormComponent, {
//     width: '500px',
//  data: {
//   mode: 'edit',
//   record: rowData  
// }
//   });

}

 onPageChange(event:{type:string,pageNo: number}) {
          console.log('Page Changed:', event.pageNo);
        }
       
    

loadContactTypes(Module: string, unit: string) {
  this.PramglobalService.GetAllGlobalValues(Module, unit).subscribe({
    next: (response) => {
      const contactOptions = (response.result || []).map((item: any) => ({
        name: item.apiName,
        value: item.id
      }));
      
      this.ContactType = contactOptions;

      // ✅ Set the options in the settings object after data is fetched
      this.ContactTypeSettings.options = contactOptions;
    },
    error: (error) => {
      console.error('Error while loading API list:', error);
    }
  });
}



}