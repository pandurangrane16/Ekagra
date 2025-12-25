import { Component,Inject,Input, inject,OnInit } from '@angular/core';
import { CmTableComponent } from '../../../../common/cm-table/cm-table.component';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { withLoader } from '../../../../services/common/common';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { emailsmsservice } from '../../../../services/emailsms.service';
import { LoaderService } from '../../../../services/common/loader.service'; 
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';

@Component({
  selector: 'app-addressbook',
  imports: [CmTableComponent, MaterialModule, CommonModule, CmInputComponent],
  templateUrl: './addressbook.component.html',
  styleUrl: './addressbook.component.css',
  standalone : true
})
export class AddressbookComponent implements OnInit{
       loaderService = inject(LoaderService);
      // @Input() selectedAction!: string;
   
router = inject(Router);
  headArr: any;
  items: any;
  form: FormGroup;
  totalPages: number = 1;
  pager: number = 1;
  MaxResultCount = 10;
  SkipCount = 0;
  perPage = 10;
  pageNo = 0;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  isSearch: boolean = false;
  collectionSize = 2;
  squareSettings = {
    labelHeader: 'Search',
    formFieldClass: 'cm-square-input',
    placeholder: 'Search (minimum 3 letters)',
    appearance: 'outline',
    isDisabled: false
  };
constructor(private fb :FormBuilder,private service:emailsmsservice,private toastr: ToastrService,
   @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<AddressbookComponent>
) {}
selectedAction:any;
  ngOnInit(): void {
      console.log('Task:', this.data.task);
  console.log('Selected Action:', this.data.selectedAction);

  // this.task = this.data.task;
  this.selectedAction = this.data.selectedAction;

    this.buildHeader();
    // let items = [{
    //   "name" : "Pandurang",
    //   "contact" : "9702944837"
    // },{
    //   "name" : "Shridhar",
    //   "contact" : "9702944837"
    // },{
    //   "name" : "Sujit",
    //   "contact" : "9702944837"
    // },{
    //   "name" : "Ashutosh",
    //   "contact" : "9702944837"
    // },{
    //   "name" : "Anup",
    //   "contact" : "9702944837"
    // },{
    //   "name" : "Harshita",
    //   "contact" : "9702944837"
    // }]
    // this.items = items;

    this.form = this.fb.group({
      searchText : ['']
    })
        this.getFilteredList();
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
  onButtonClicked($event: any) {

  }
  onRowClicked($event: any) {

  }
  onPageRecordsChange($event: { type: string; perPage: number; }) {

  }
  onPageChange($event: { type: string; pageNo: number; }) {

  }


  buildHeader() {
    this.headArr = [
      { header: 'Name', fieldValue: 'name', position: 1 },
      { header: 'Contact', fieldValue: 'contact', position: 2 },
      { header: 'Action', fieldValue: 'check', position: 3 }
    ];
    ;
  }
originalItems: any[] = [];
     getFilteredList() {
      // const selectedProjectId = this.form.controls['selectedProject'].value.value;
      //  const selectedStatus = this.form.controls['selectedStatus'].value.value;
   const search = this.form.get('searchText')?.value ?? '';
          this.MaxResultCount=this.perPage;
        this.SkipCount=this.MaxResultCount*this.pager;
        this.recordPerPage=this.perPage;
   debugger;
       this.service.GetFilteredList(this.data.task?.zoneID,'Field',search).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
      //  const items = response?.result || [];
           
      //      this.items=items;
//          const items = response.result; 
// this.items = items;
const items = response.result; 
this.originalItems = items;  // store full data

this.applyFilter();

// if (Array.isArray(items)) {
//   items.forEach((element: any) => {
             
  
//             element.name = element.userName;
   
//     element.contact = element.phoneNumber;
//         element.check = [
//       {
       
//         type: 'checkbox',
//         checked: false,  
//         phone: element.phoneNumber 
//       }
//     ];

  

//     // element.button = [
//     //   { label: 'Edit', icon: 'edit', type: 'edit' },
//     //   { label: 'Delete', icon: 'delete', type: 'delete' }
//     // ];
  
  
  
  
//                     });
//             //     var _length = totalCount / Number(this.recordPerPage);
//             // if (_length > Math.floor(_length) && Math.floor(_length) != 0)
//             //   this.totalRecords = Number(this.recordPerPage) * (_length);
//             // else if (Math.floor(_length) == 0)
//             //   this.totalRecords = 10;
//             // else
//             //   this.totalRecords = totalCount;
//             // this.totalPages = this.totalRecords / this.pager;
//           }
        })
      }  

      applyFilter() {
  if (!Array.isArray(this.originalItems)) return;

  if (this.selectedAction === 'sms') {
    // Only users where phone exists
    this.items = this.originalItems.filter(x => !!x.phoneNumber);
  } else if (this.selectedAction === 'email') {
    // Only users where email exists
    this.items = this.originalItems.filter(x => !!x.emailAddress);
  }

  // Mapping based on selectedAction
  this.items.forEach((element: any) => {
    element.name = element.userName;

    if (this.selectedAction === 'sms') {
      element.contact = element.phoneNumber;
    } else if (this.selectedAction === 'email') {
      element.contact = element.emailAddress;
    }

    element.check = [
      {
        type: 'checkbox',
        checked: false,
        phone: element.phoneNumber,
        email: element.email,
        value: element.contact // dynamic
      }
    ];
  });
}



  SubmitAction() {
    debugger;
   const selectedContacts = this.items
    .map((item: any) => item.check?.[0])
    .filter((chk: any) => chk?.checked && chk.value)
    .map((chk: any) => chk.value);

      if (!selectedContacts || selectedContacts.length === 0) {
    this.toastr.error("Please select at least one contact!");
    return; // stop execution
  }

else{  console.log("Selected Contacts:", selectedContacts);
   this.dialogRef.close(selectedContacts);}


}


  CancelAction() {
 this.dialogRef.close();
  }
}
