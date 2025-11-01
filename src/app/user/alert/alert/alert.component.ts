import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CmTableComponent } from '../../../common/cm-table/cm-table.component';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { MatCardModule } from '@angular/material/card';
import { withLoader } from '../../../services/common/common';
import { LoaderService } from '../../../services/common/loader.service';
import { Router } from '@angular/router';
import { InputRequest } from '../../../models/request/inputreq.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { projconfigservice } from '../../../services/admin/progconfig.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CmConfirmationDialogComponent } from '../../../common/cm-confirmation-dialog/cm-confirmation-dialog.component';
import { ResolvedByItselfComponent } from '../resolved-by-itself/resolved-by-itself.component';
import { AlertTransferComponent } from '../alert-transfer/alert-transfer.component';
import { alertservice } from '../../../services/admin/alert.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AlertHistoryComponent } from '../alert-history/alert-history.component';

@Component({
  selector: 'app-alert',
  imports: [CommonModule,
    CmTableComponent,
    CmInputComponent, MatDatepickerModule, MatDatepickerModule,
    CmSelect2Component, MatFormFieldModule, MatFormFieldModule,
    MatCardModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  providers: [provideNativeDateAdapter()],
  standalone: true


})
export class AlertComponent implements OnInit {
  loaderService = inject(LoaderService);
  router = inject(Router);
  _headerName = 'Project Configuration Table';
  headArr: any[] = [];
  clickedRow: any;
  items: any;
  _request: any = new InputRequest();
  totalPages: number = 1;
  pager: number = 0;
  MaxResultCount = 10;
  SkipCount = 0;
  perPage = 10;
  pageNo = 0;
  totalRecords!: number;
  recordPerPage: number = 10;
  startId!: number;
  isSearch: boolean = false;
  closeResult!: string;
  searchText!: string;
  selectedProject: any;
  selectedStatus: any;
  form!: FormGroup;
  startDate: Date | null = null;
  endDate: Date | null = null;

  collectionSize = 2;
  list!: any;
  isProjectOptionsLoaded = false;
  gridArr = [
    {
      name: 'Alpha Project',
      status: 'as',
      ruleEngine: 'as',
      description: 'as',
      map: 'Active',
      action: ''

    },
  ];
  projectSelectSettings = {
    labelHeader: 'Select Project',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: []
  };
  statusSelectSettings = {
    labelHeader: 'Select Ticket Type',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: [
      { name: 'Open Tickets', value: '0' },
      { name: 'My Tickets', value: '1' },
      { name: 'All Tickets', value: '2' }
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
    private service: alertservice,
  ) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      selectedProject: [''],
      selectedStatus: [''],
      searchText: ['']
    });
    this.buildHeader();
    //// this.getProjConfigList();
    //// this.getProjList();
    this.getFilteredList();

    this.getFilteredList();



    this.form.get('searchText')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length >= 3) {
          this.perPage = 10;
          this.pager = 0;
          this.getFilteredList();
        } else if (!value || value.length === 0) {

          this.perPage = 10;
          this.pager = 0;
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


  DateWiseFilter(evtData: any, category: string) {
    if (category == "start") {
      this.startDate = evtData.value;
      console.log("Start Date : " + evtData.value);
    }
    else {
      this.endDate = evtData.value;
      console.log("End Date : " + evtData.value);
    }
  }

  onProjectSelected(event: any) {
    console.log('Selected Project:', event);
  }
  submit() {
    this.pager = 0;
    this.perPage = 10;
    this.getFilteredList();
  }


  openDialog() {
    this.router.navigate(['/admin/projform']);

  }
  buildHeader() {
    this.headArr = [
      { header: 'Action', fieldValue: 'buttonlist', position: 1 },
      { header: 'Ticket Id', fieldValue: 'ticketid', position: 2 },
      { header: 'Policy Name', fieldValue: 'policyname', position: 3 },
      { header: 'Category', fieldValue: 'category', position: 4 },
      { header: '[Alert Date]', fieldValue: 'alertdate', position: 5 },
      { header: 'Handeled By', fieldValue: 'handledby', position: 6 },
      { header: 'Devices', fieldValue: 'devices', position: 7 }
    ];
  }

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


  onRowClicked(row: any) {
    this.clickedRow = row;
    console.log(this.clickedRow);
  }

  onButtonClicked({ event, data }: { event: any; data: any }) {
    if (event.type === 'edit') {
      this.editRow(data);
      console.log(data);
    } else if (event.type === 'delete') {
      // this.deleteRow(data);
    } else if (event.type === 'resolved') {
      const dialogRef = this.dialog.open(ResolvedByItselfComponent, {
        width: '800px',
        height: 'auto',
        //title : "Resolved By Iteself",
        position: { top: '20px' },
        panelClass: 'custom-confirm-dialog',
        data: {
          policyName: data.policyname,
          allData: data
        }
      })
    } else if (event.type === 'transfer') {
      const dialogRef = this.dialog.open(AlertTransferComponent, {
        width: '800px',
        height: 'auto',
        //title : "Resolved By Iteself",
        position: { top: '20px' },
        panelClass: 'custom-confirm-dialog',
        data: {
          policyName: data.policyname,
          id: data.id,
          allData: data
        }
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getFilteredList();
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getFilteredList();
        }
      });
    } else if (event.type === 'perform') {
      this.router.navigate(['user/sopflow'], {
        state: {data: this.clickedRow}
      });
    } else if (event.type === 'history') {
      const dialogRef = this.dialog.open(AlertHistoryComponent, {
        width: '800px',
        height: 'auto',
        //title : "Resolved By Iteself",
        position: { top: '20px' },
        panelClass: 'custom-confirm-dialog',
        data: {
          policyName: data.policyname,
          id: data.id
        }
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getFilteredList();
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.getFilteredList();
            }
          });
        }
      });
    }
  }

  editRow(rowData: any) {
    this.router.navigate(['/admin/projform'], {
      state: {
        mode: 'edit',
        record: rowData
      }
    });
  }

  getFilteredList() {
    const selectedProjectId = this.form.controls['selectedProject'].value.value;
    const selectedStatus = this.form.controls['selectedStatus'].value.value;
    const search = this.form.controls['searchText'].value
    this.MaxResultCount = this.perPage;
    this.SkipCount = this.MaxResultCount * this.pager;
    this.recordPerPage = this.perPage;

    console.log(this.startDate, this.endDate)

    const formattedStart = this.startDate?.toISOString();
    const formattedEnd = this.endDate?.toISOString();


    this.service.GetFilteredList(formattedStart, formattedEnd, selectedStatus, search, this.MaxResultCount, this.SkipCount).pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      console.log(this.startDate, this.endDate)
      const items = response.result?.items;
      this.items = items;
      const totalCount = response.result?.totalCount;


      if (Array.isArray(items)) {

        items.forEach((element: any) => {


          //let _data = JSON.parse(element);
          element.ticketid = element.ticketNo;
          element.policyname = element.policyName;
          element.category = element.category === 0 ? 'Low' :
            element.category === 1 ? 'Medium' :
              element.category === 2 ? 'High' : '';
          element.alertdate = element.creationTime;
          element.handledby = element.handledUser;
          element.devices = element.devices

          // element.button = [
          //   { label: 'Edit', icon: 'edit', type: 'edit' },
          //   { label: 'Delete', icon: 'delete', type: 'delete' }
          // ];
          element.ticketid = element.ticketNo;
          element.policyname = element.policyName;
          element.category = element.category === 0 ? 'Low' :
            element.category === 1 ? 'Medium' :
              element.category === 2 ? 'High' : '';
          element.alertdate = element.creationTime;
          element.handledby = element.handledUser;
          element.devices = element.devices

          // element.button = [
          //   { label: 'Edit', icon: 'edit', type: 'edit' },
          //   { label: 'Delete', icon: 'delete', type: 'delete' }
          // ];

          element.buttonlist = [
            { label: 'Transfer', icon: 'output', type: 'transfer', disabled: false },
            { label: 'Perform', icon: 'schedule', type: 'perform', disabled: false },
            { label: 'Resolved By Itself', icon: 'check_circle', type: 'resolved', disabled: false },
            { label: 'History', icon: 'history', type: 'history', disabled: false },
            // { label: 'Transfer', icon: 'output', type: 'transfer' },
          ]



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
    });
  }

  updateAlertStatus(data: any) {
    this.service.updateAlert(data).subscribe(res => {
      if (res != null && res != undefined) {

      }
    })
  }
}