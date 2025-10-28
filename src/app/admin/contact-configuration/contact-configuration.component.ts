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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
// import { AppCustomSelectComponent } from '../../common/custom-select/custom-select.component';
import { inject, OnInit } from '@angular/core';
import { projconfigservice } from '../../services/admin/progconfig.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InputRequest } from '../../models/request/inputreq.model';
import { PramglobalService } from '../../services/admin/pramglobal.service';
import { ContactConfigService } from '../../services/admin/contact-config.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ContactConfigurationFormComponent } from './contact-configuration-form/contact-configuration-form.component';
import { getErrorMsg } from '../../utils/utils';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CmConfirmationDialogComponent } from '../../common/cm-confirmation-dialog/cm-confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-configuration',
  imports: [
    CommonModule,
    CmInputComponent,
    CmSelect2Component,
    CmTableComponent,
    MatCardModule,
    // AppCustomSelectComponent
  ],
  templateUrl: './contact-configuration.component.html',
  styleUrl: './contact-configuration.component.css'
})

export class ContactConfigurationComponent implements OnInit {
  contactTypeMap: { [key: string]: string } = {};
  router = inject(Router);
  _headerName = 'Contact Configuration Table';
  isContactLoaded: boolean = true;
  headArr: any[] = [];
  items: any;
  _request: any = new InputRequest();

  MaxResultCount = 10;
  SkipCount = 0;
  pageNo = 0;

  totalPages: number = 1;
  pager: number = 1;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  isSearch: boolean = false;
  closeResult!: string;
  searchText!: string;
  ContactType: any;
  selectedStatus: any;
  form!: FormGroup;
  perPage = 10;
  collectionSize = 2;
  list!: any;
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
    private PramglobalService: PramglobalService,
    private ContactConfigService: ContactConfigService
    , private dialog: MatDialog
    , private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      selectedProject: [''],
      selectedStatus: [''],
      searchText: [''],
      ContactType: ['']
    });
    this.loadContactTypes('Contact', 'Type');
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
    debugger;
    this.MaxResultCount = this.perPage;
    this.SkipCount = this.MaxResultCount * this.pager;
    this.recordPerPage = this.perPage;
    const selectedProjectId = this.form.controls['selectedProject'].value.value;
    const selectedStatus = this.form.controls['selectedStatus'].value.value;

    const selectedType = this.form.controls['ContactType'].value.value == null ? "" : this.form.controls['ContactType'].value.value;
    //  const selectedStatus = this.form.controls['selectedStatus'].value.value;
    const search = this.form.controls['searchText'].value
    this.ContactConfigService.GetAllContactMasterPage(selectedType, search, this.MaxResultCount, this.SkipCount).subscribe(response => {
      //  const items = response?.result || [];

      //      this.items=items;
      const items = response.result?.items;
      this.items = items;
      console.log(response);
      const totalCount = response.result?.totalCount;
      if (Array.isArray(items)) {

        items.forEach((element: any) => {

          debugger;
          //let _data = JSON.parse(element);
          //element.type = element.type;
          element.type = this.contactTypeMap[element.type] ?? element.type;

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

  buildHeader() {
    this.headArr = [
      { header: 'Contact Type', fieldValue: 'type', position: 1 },
      { header: 'Name', fieldValue: 'name', position: 2 },
      { header: 'contact', fieldValue: 'contact', position: 3 },
      { header: 'Status', fieldValue: 'isActive', type: 'boolean', position: 4 },
      { header: 'Action', fieldValue: 'button', position: 5 }
    ];
    ;
  }

  getContactConfigList() {
    debugger;
    this._request.currentPage = this.pager;
    this._request.pageSize = Number(this.recordPerPage);
    this._request.startId = this.startId;
    this._request.searchItem = this.searchText;

    // ✅ Get selected type from form control
    const selectedType = this.form.get('ContactType')?.value === "" ? 0 : this.form.get('ContactType')?.value;
    this._request.type = selectedType || '';


    this.ContactConfigService.GetAllContactMasterLists().subscribe(response => {
    // this.ContactConfigService.GetAll().subscribe(response => {

      const items = response.result?.items;
      const totalCount = response.result?.totalCount;
      this.items = items;
      console.log(response);
      if (Array.isArray(items)) {

        items.forEach((element: any) => {


          //let _data = JSON.parse(element);
          //element.type = element.type;
          element.type = this.contactTypeMap[element.type] ?? element.type;

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

         if (Array.isArray(items)) {


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

  submit() {
    this.pager = 0;
    this.perPage = 10;
    this.getFilteredList();
  }

  openDialog() {
    try {
      this.router.navigate(['/admin/contactform']);
    } catch (ex) {
      if (ex instanceof Error) {
        console.error(ex.message);
      } else {
        console.error('Unexpected error:', ex);
      }
    }
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
        message: `Are you sure?<div style="margin-top: 8px;">Project: <b>${rowData.name}</b> will be deleted.</div>`,

        type: 'delete',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.ContactConfigService.Delete(rowData.id).subscribe({
          next: (res) => {
            if (res.success) {
              this.getContactConfigList();
              console.log('Deleted successfully');
              this.toast.success('Contact Deleted successfully');
              this.router.navigate(['/ContactConf']);
            } else {
              this.toast.error('Delete failed:', res.error);
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
    this.router.navigate(['/admin/contactform'], {
      state: {
        mode: 'edit',
        record: rowData
      }
    });
    this.router.navigate(['/admin/contactform'], {
      state: {
        mode: 'edit',
        record: rowData
      }
    });
  }

  onPageChange(event: any) {
    console.log(event);
    if (event.type === 'pageChange') {
      this.pager = event.pageNo;
      this.getFilteredList();
    }
  }


  onPageRecordsChange(event: any) {
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

      // Fix: Add type annotations to `map` and `item`
      this.contactTypeMap = contactOptions.reduce((map: { [key: string]: string }, item: { name: string; value: string }) => {
        map[item.value] = item.name;
        return map;
      }, {} as { [key: string]: string });
      console.log(this.contactTypeMap);



      this.form.controls['ContactType'].setValue({
        name: 'ALL',
        value: null
      });
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