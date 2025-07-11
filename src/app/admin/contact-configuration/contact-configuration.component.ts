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
// import { AppCustomSelectComponent } from '../../common/custom-select/custom-select.component';
import { OnInit } from '@angular/core';
import { projconfigservice } from '../../services/admin/progconfig.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputRequest } from '../../models/request/inputreq.model';
import { PramglobalService } from '../../services/admin/pramglobal.service';
import { ContactConfigService } from '../../services/admin/contact-config.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ContactConfigurationFormComponent } from './contact-configuration-form/contact-configuration-form.component';
import { getErrorMsg } from '../../utils/utils';

@Component({
  selector: 'app-contact-configuration',
  imports: [
    CommonModule,        
    CmInputComponent,
    CmSelect2Component,
    CmTableComponent
    // AppCustomSelectComponent
  ],
  templateUrl: './contact-configuration.component.html',
  styleUrl: './contact-configuration.component.css'
})

export class ContactConfigurationComponent implements OnInit{
  _headerName = 'Contact Configuration Table';
  isContactLoaded : boolean = false;
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
       iscontactOptionsLoaded = false;
squareSettings = {
          labelHeader: 'Search',
          formFieldClass: 'cm-square-input',
        
          isDisabled: false
        };
ContactTypeSettings: Select2Settings = {
  labelHeader: '',
  lableClass: 'form-label',
  formFieldClass: '', 
  appearance: 'fill',
  options: []
};
           constructor(private fb: FormBuilder,
              //  private dialog: MatDialog,
               private service: projconfigservice,
               private PramglobalService:PramglobalService,
                private ContactConfigService:ContactConfigService,
                 private dialog: MatDialog
               ) {}

  ngOnInit(): void {
            this.form = this.fb.group({
                        selectedProject: [''],
                        selectedStatus: [''],
                        searchText: [''],
                         ContactType: ['']
                      });
                      this.loadContactTypes('Contact','Type');
                      this.buildHeader();
                      this.getContactConfigList();
                      this.getContactList();
            
            
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
    const selectedType = this.form.controls['ContactType'].value.value;
    //  const selectedStatus = this.form.controls['selectedStatus'].value.value;
     const search = this.form.controls['searchText'].value
     this.ContactConfigService.GetAllContactMasterPage(selectedType,search).subscribe(response => {
    //  const items = response?.result || [];
         
    //      this.items=items;
         const items = response.result?.items;
         this.items=items;


        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           

            //let _data = JSON.parse(element);
             element.type = element.type;
            element.name = element.name;
             element.contact = element.contact;
            element.isActive = !!element.isActive; 
            // element.ruleEngine = !!element.ruleEngine;
            // element.map =!! element.map;
            
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
              { header: 'Contact Type', fieldValue: 'type', position: 1 },
              { header: 'Name', fieldValue: 'name', position: 2 },
              { header: 'contact', fieldValue: 'contact', position: 3 },
                   { header: 'Status', fieldValue: 'isActive',type:'boolean', position: 4 },
              { header: 'Action', fieldValue: 'button', position: 5 }
          ];
          ;}
      
               getContactConfigList() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      
      // ✅ Get selected type from form control
  const selectedType = this.form.get('ContactType')?.value?.value;
  this._request.type = selectedType || '';

      this.ContactConfigService.GetAll().subscribe(response => {

         const items = response.result?.items;
         
         this.items=items;







        if (Array.isArray(items)) {
         
           items.forEach((element: any) => {
           

            //let _data = JSON.parse(element);
            element.type = element.type;
            element.name = element.name;
            element.contact = element.contact; 
              element.isActive = !!element.isActive; 
            // element.ruleEngine = !!element.ruleEngine;
            // element.map =!! element.map;

                       element.button = [
    { label: 'Edit', icon: 'edit', type: 'edit' },
    { label: 'Delete', icon: 'delete', type: 'delete' }
  ];
                
          });
          
        }
      })
    } 
    getContactList() {
      debugger;
  // this.ContactConfigService.GetAll().subscribe(response => {
  //   const items = response?.result?.items || [];

  //   const contactOptions = items.map((item: any) => ({
  //     name: item.name || item.shortCode,
  //     value: item.id
  //   }));

  //   this.ContactTypeSettings.options = contactOptions;
  //   this.isContactLoaded = true;
  //   console.log('Contact options loaded:', contactOptions);
  //    }, error => {
  //   console.error('Error fetching contact list', error);
  // });
}
     
 

 onContactTypeSelected(event: any) {
          console.log('Selected Project:', event);
        }

              submit(){
   this.getFilteredList();
 }

 openDialog() {
    (document.activeElement as HTMLElement)?.blur();
             const dialogRef = this.dialog.open(ContactConfigurationFormComponent, {
               
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
       
    

// loadContactTypes(Module: string, unit: string) {
//   debugger;
//   this.PramglobalService.GetAllGlobalValues(Module, unit).subscribe({
//     next: (response) => {
//       debugger;
//       const contactOptions = (response.result || []).map((item: any) => ({
//         name: item.rfu1,
//         value: item.prmvalue
//       }));
//       debugger;
//       console.log(contactOptions);
//       this.ContactType = contactOptions;

//       // ✅ Set the options in the settings object after data is fetched
//       // this.ContactTypeSettings.options = contactOptions;
//       this.ContactTypeSettings = {
//   ...this.ContactTypeSettings,
//   options: contactOptions
// };
//     },
//     error: (error) => {
//       console.error('Error while loading API list:', error);
//     }
//   });
// }


loadContactTypes(Module: string, unit: string) {
  debugger;
  this.PramglobalService.GetAllGlobalValues(Module, unit).subscribe(response => {
    const items = response?.result || [];

    const contactOptions = items.map((item: any) => ({
      name: item.rfu1,
      value: item.prmvalue
    }));

  
    // contactOptions.unshift({
    //   name: 'All',
    //   value: null
    // });
    console.log(contactOptions);
    this.ContactTypeSettings.options = contactOptions;
     this.isContactLoaded = true;
  }, error => {
    console.error('Error fetching Contact Type list', error);
  });
}
     
       





}