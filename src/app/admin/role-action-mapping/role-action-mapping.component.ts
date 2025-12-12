

import { AfterViewInit, Component,ElementRef,Inject,inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule,isPlatformBrowser } from '@angular/common';

import { CmSelectComponent } from '../../common/cm-select/cm-select.component';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CmInputComponent } from '../../common/cm-input/cm-input.component';
import { MatDialog } from '@angular/material/dialog';
import { InputRequest } from '../../models/request/inputreq.model';
import { projconfigservice } from '../../services/admin/progconfig.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import {MatButtonModule} from '@angular/material/button';
import { UserZoneMapping } from '../../models/admin/userZoneMapping.model';
import { UserMappingService } from '../../services/admin/usermapping.service';
import { ToastrService } from 'ngx-toastr';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CmConfirmationDialogComponent } from '../../common/cm-confirmation-dialog/cm-confirmation-dialog.component';
import _ from 'lodash';
import { MaterialModule } from "../../Material.module";
import { RoleMappingService } from '../../services/admin/role-action-mapping';
import { AbstractControl, ValidationErrors } from '@angular/forms';
// jQuery declared globally
declare var $: any;

@Component({
   selector: 'app-role-action-mapping',
    standalone: true,
    imports: [
    CommonModule,
   CmTableComponent,
    
   
    MatCardModule, MatButtonModule,
    MaterialModule
],
  templateUrl: './role-action-mapping.component.html',
  styleUrl: './role-action-mapping.component.css'
})

     export class RoleActionMappingComponent implements OnInit, AfterViewInit, OnDestroy {
    
     @ViewChild('selectElement') selectElement!: ElementRef;
  @Input() options: { id: number; text: string }[] = [];
UserOptions = [
  { id: 0, text: 'All' },
 
];
ZoneOptions = [
  { id: 0, text: 'All' },
 
];
RoleOptions = [
  { id: 0, text: 'All' },
 
];
  selectedValue: number | null = null;
     
      loaderService = inject(LoaderService);
router = inject(Router);
      _headerName = 'Project Configuration Table';
      headArr: any[] = [];
      items:any;
      _request: any = new InputRequest();
      totalPages: number = 1;
      pager: number = 0;
        MaxResultCount=10;
  SkipCount=0;
  perPage=10;
  pageNo=0;
      totalRecords!: number;
      recordPerPage: number = 10;
      startId!: number;
      isSearch: boolean = false;
      closeResult!: string;
      searchText!:string;
      selectedProject: any;
      selectedStatus: any;
      form!: FormGroup;
      isEdit=false;
      selectedRecordId:any;
      editingId: number | null = null;

      userMappings: UserZoneMapping[] = [];
     
      collectionSize = 2;
      list!:any;
      isUserOptionsLoaded = false;
      isZoneOptionsLoaded = false;
      isRoleOptionsLoaded = false;
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
      UserSelectSettings = {
          labelHeader: 'Select Role',
          lableClass: 'form-label',
           multiple: true,
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
          ZoneSelectSettings = {
          labelHeader: 'Select Zone',
          lableClass: 'form-label',
           multiple: false,
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        };
          RoleSelectSettings = {
          labelHeader: 'Select Role',
          lableClass: 'form-label',
          formFieldClass: '', 
          appearance: 'fill',
          options: []
        }
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
        private service: RoleMappingService, private toast: ToastrService,
        @Inject(PLATFORM_ID) private platformId: Object
        ) {}
        

     minArrayLength(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (Array.isArray(value) && value.length >= min) {
      return null;
    }
    return { minArrayLength: { requiredLength: min, actualLength: value.length } };
  };
}
        
      ngOnInit(): void {
       this.form = this.fb.group({
  // selectedUser: [null, Validators.required],
  selectedAction: [[], this.minArrayLength(1)],
  // selectedRole: [[], this.minArrayLength(1)]
selectedRole: [null, Validators.required]
});
          this.buildHeader();
         // this.getProjConfigList();
         // this.getUserList();
        //this.GetRoleList();
          this.GetActionList();
          this.getRoleList();
          this.getFilteredList();


            this.form.get('searchText')?.valueChanges
              .pipe(
                debounceTime(300), 
                distinctUntilChanged() 
              )
              .subscribe(value => {
                   if (value && value.length >= 3) {
                       this.perPage=10;
                 this.pager=0;
                this.getFilteredList();
              } else if (!value || value.length === 0) {

                 this.perPage=10;
                 this.pager=0;
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

      onProjectSelected(event: any) {
          console.log('Selected Project:', event);
        }
submit() {
  debugger;
 if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.toast.error('Form is not valid');
    return;
  }

  const roleId = Number(this.form.value.selectedRole.id);
  const actionId = this.form.value.selectedAction
    .map((x: any) => x.id)
    .join(',');

  // ---------- UPDATE FLOW ----------
  if (this.isEdit && this.editingId) {

    let payload = {
      id: this.editingId,
      roleId: roleId,
      actionId: actionId
    };

    this.service.Update(payload)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: () => {
          this.toast.success('Updated successfully!');
          this.getFilteredList();

          this.resetFormState();   // ✅ clear id + reset form
        },
        error: () => {
          this.toast.error('Update failed');
        }
      });

    return;
  }

  // ---------- CREATE FLOW ----------
  let payload = {
    id: 0,
    roleId: roleId,
    actionId: actionId
  };

  this.service.Create2(payload)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: () => {
        this.toast.success('Created successfully!');
        this.getFilteredList();

        this.resetFormState();
      },
      error: () => {
        this.toast.error('Create failed');
      }
    });

}

    resetFormState() {
  this.form.reset({
    selectedRole: null,
    selectedAction: []
  });

  this.isEdit = false;
  this.editingId = null;   // ✅ clear stored id
}

        openDialog() {
      this.router.navigate(['/admin/projform']);   
          
}
        buildHeader() {  
          this.headArr = [
            // { header: 'UserName', fieldValue: 'userName', position: 1 },
            // { header: 'Zone', fieldValue: 'zoneNames', position: 2 },
            { header: 'Role', fieldValue: 'roleNames', position: 1 },
             { header: 'Actions', fieldValue: 'actions', position: 2 },
           
     
            { header: 'Action', fieldValue: 'button', position: 3 }
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

          onPageChange(event:any) {
    console.log(event);
  if (event.type === 'pageChange') {
    this.pager = event.pageNo;
  this.getFilteredList();
  }
}


onPageRecordsChange(event:any ) {
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
     
      this.service.Delete(rowData.id).pipe(withLoader(this.loaderService)).subscribe({
        next: (res:any) => {
          if (res.success) {
            this.getProjConfigList();
            console.log('Deleted successfully');
           
          } else {
            console.error('Delete failed:', res.error);
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
  debugger;
  if (!rowData?.id) {
    this.toast.error('Invalid record', 'Error');
    return;
  }


  this.selectedRecordId=rowData.id;

    this.isEdit = true;
    this.editingId = rowData.id; 
  // Call API using your GetById service
  this.service.GetById(rowData.id)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (response: any) => {
        const result = response?.result;
        if (!result) {
          this.toast.error('No data found', 'Error');
          return;
        }


          let payload = {
            roleId: response.result.roleId,
            actionId: response.result.actionId,
            id: rowData.id
          };


        // Extract IDs and convert comma-separated values to arrays
        // const zoneIds = result.zoneId ? result.zoneId.split(',').map((id: string) => id.trim()) : [];
        // const roleIds = result.roleId ? result.roleId.split(',').map((id: string) => id.trim()) : [];
        const zoneIds = result.zoneId
          ? String(result.zoneId).split(',').map((id: string) => id.trim())
          : [];

            const roleIds = result.roleId
              ? String(result.roleId).split(',').map((id: string) => id.trim())
              : [];

            const actionIds = result.actionId
              ? String(result.actionId).split(',').map((id: string) => id.trim())
              : [];
        const userId =  String(result.userId);

        // Find matching option objects from your dropdown lists
        const selectedActions = this.ZoneOptions?.filter((z: any) => actionIds.includes(String(z.id))) || [];
        const selectedRoles = this.RoleOptions?.filter((r: any) => roleIds.includes(String(r.id))) || [];
        const selectedUser = this.UserOptions?.filter((r: any) => userId.includes(String(r.id))) || [];

        // Patch values into the form

        
        this.form.patchValue({
          selectedUser:  selectedUser || null,
          selectedAction: selectedActions,
          selectedRole: selectedRoles.length > 0 ? selectedRoles[0] : null

        });

        //   this.form.controls['selectedUser'].disable();

      this.toast.success('Record data loaded successfully. You can now edit the record.', 'Edit Mode Activated');

      },
      error: (err) => {
        console.error('Error fetching record:', err);
        this.toast.error('Failed to load record', 'Error');
      }
    });
}
clearActions() {
  this.form.patchValue({ selectedAction: [] });
}
        onActionSelectionChange(event: any) {
  const selectedValues = this.form.value.selectedAction || [];
  const allOption = this.ZoneOptions.find((x: any) => x.text.toLowerCase() === 'all');

  if (!allOption) return;

  const isAllSelected = selectedValues.some((x: any) => x.id === allOption.id);

  // If ALL is selected → select every option **except ALL**
  if (isAllSelected) {
    const allExceptAll = this.ZoneOptions.filter((x: any) => x.id !== allOption.id);

    this.form.patchValue({
      selectedAction: allExceptAll
    });

    return;
  }

  // If user selects anything else → ensure ALL is removed
  const cleaned = selectedValues.filter((x: any) => x.id !== allOption.id);

  this.form.patchValue({
    selectedAction: cleaned
  });
}
        getProjConfigList() {
      this._request.currentPage = this.pager;
      this._request.pageSize = Number(this.recordPerPage);
      this._request.startId = this.startId;
      this._request.searchItem = this.searchText;
      this.service.GetAll().pipe(withLoader(this.loaderService)).subscribe((response:any) => {

         const items = response.result?.items;
         
         this.items=items;
            const totalCount=response.result?.totalCount;







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
  //     getFilteredList() {
  //   // const selectedProjectId = this.form.controls['selectedProject'].value.value;
  //   //  const selectedStatus = this.form.controls['selectedStatus'].value.value;
  //   //  const search = this.form.controls['searchText'].value
  //       this.MaxResultCount=this.perPage;
  //     this.SkipCount=this.MaxResultCount*this.pager;
  //     this.recordPerPage=this.perPage;
 
  //    this.service.GetFilteredList(this.MaxResultCount,this.SkipCount).pipe(withLoader(this.loaderService)).subscribe((response:any) => {
  //   //  const items = response?.result || [];
         
  //   //      this.items=items;
  //        const items = response.result?.items;
  //        this.items=items;
  //          const totalCount=response.result?.totalCount;


  //       if (Array.isArray(items)) {
         
  //          items.forEach((element: any) => {
           

  //           //let _data = JSON.parse(element);
  //            element.name = element.userId;
  //           element.description = element.description;
  //           element.isActive = !!element.isActive; 
  //           element.ruleEngine = !!element.ruleEngine;
  //           element.map =!! element.map;
            
  //             element.button = [
  //   { label: 'Edit', icon: 'edit', type: 'edit' },
  //   { label: 'Delete', icon: 'delete', type: 'delete' }
  // ];




  //                 });
  //             var _length = totalCount / Number(this.recordPerPage);
  //         if (_length > Math.floor(_length) && Math.floor(_length) != 0)
  //           this.totalRecords = Number(this.recordPerPage) * (_length);
  //         else if (Math.floor(_length) == 0)
  //           this.totalRecords = 10;
  //         else
  //           this.totalRecords = totalCount;
  //         this.totalPages = this.totalRecords / this.pager;
  //       }
  //     })
  //   }  


//     getFilteredList() {
//   this.MaxResultCount = this.perPage;
//   this.SkipCount = this.MaxResultCount * this.pager;
//   this.recordPerPage = this.perPage;

//   this.service.GetFilteredList2(this.MaxResultCount, this.SkipCount)
//     .pipe(withLoader(this.loaderService))
//     .subscribe((response: any) => {
//       const items = response.result?.items || [];
     
// this.items = items;


// this.userMappings = items;
// console.log("userMappings",this.userMappings)
//       const totalCount = response.result?.totalCount || 0;

//       if (Array.isArray(items)) {
//         items.forEach((element: any) => {
//           // Convert comma-separated string IDs into arrays
//           const zoneIds = element.zoneId ? element.zoneId.split(',').map((id: string) => id.trim()) : [];
//           const roleIds = element.roleId ? element.roleId.split(',').map((id: string) => id.trim()) : [];

//           // Map Zone Names
//        const zoneNames = zoneIds
//   .map((id: string) => this.ZoneOptions.find((z: any) => String(z.id) === id)?.text)
//   .filter(Boolean)
//   .join(', ');

//           // Map Role Names
//           const roleNames = roleIds
//             .map((id: string) => this.RoleOptions.find((r: any) => String(r.id) === id)?.text)
//             .filter(Boolean)
//             .join(', ');

//           // Map User Name (if you have a user list)
//           const userName = this.UserOptions?.find((u: any) => u.id === element.userId)?.text || element.userId;

//           // Assign readable fields
//           element.zoneNames = zoneNames || 'N/A';
//           element.roleNames = roleNames || 'N/A';
//           element.userName = userName || 'N/A';

      

//           // Add buttons
//           element.button = [
//             { label: 'Edit', icon: 'edit', type: 'edit' },
//             // { label: 'Delete', icon: 'delete', type: 'delete' }
//           ];
//         });

//         // Pagination handling
//         const _length = totalCount / Number(this.recordPerPage);
//         if (_length > Math.floor(_length) && Math.floor(_length) !== 0)
//           this.totalRecords = Number(this.recordPerPage) * (_length);
//         else if (Math.floor(_length) === 0)
//           this.totalRecords = 10;
//         else
//           this.totalRecords = totalCount;

//         this.totalPages = this.totalRecords / this.pager;
//       }

//       // Assign to component variable
//       this.items = items;
//     });
// }
getFilteredList() {
  this.MaxResultCount = this.perPage;
  this.SkipCount = this.MaxResultCount * this.pager;
  this.recordPerPage = this.perPage;

  this.service.GetFilteredList2(this.MaxResultCount, this.SkipCount)
    .pipe(withLoader(this.loaderService))
    .subscribe((response: any) => {

      const items = response.result?.items || [];
      const totalCount = response.result?.totalCount || 0;

      this.userMappings = items;
      console.log("userMappings", this.userMappings);

      if (Array.isArray(items)) {

        items.forEach((element: any) => {

          // -----------------------------
          // ✔ Convert comma-separated Action IDs
          // -----------------------------
          const actionIds = element.actionId
            ? element.actionId.split(',').map((id: string) => id.trim())
            : [];

          // -----------------------------
          // ✔ Convert comma-separated Role ID (single ID but we keep the format)
          // -----------------------------
          const roleIds = element.roleId
            ? element.roleId.toString().split(',').map((id: string) => id.trim())
            : [];

          // -----------------------------
          // ✔ Map Action Names from ActionOptions
          // -----------------------------
          const actionNames = actionIds
            .map((id: string) => this.ZoneOptions.find((a: any) => String(a.id) === id)?.text)
            .filter(Boolean)
            .join(', ');

          // -----------------------------
          // ✔ Map Role Name from RoleOptions
          // -----------------------------
          const roleNames = roleIds
            .map((id: string) => this.RoleOptions.find((r: any) => String(r.id) === id)?.text)
            .filter(Boolean)
            .join(', ');

          // Assign readable names
          element.actions = actionNames || 'N/A';
          element.roleNames = roleNames || 'N/A';

          // Add Edit button
          element.button = [
            { label: 'Edit', icon: 'edit', type: 'edit' },
          ];
        });

        // Pagination
        const _length = totalCount / Number(this.recordPerPage);
        if (_length > Math.floor(_length) && Math.floor(_length) !== 0)
          this.totalRecords = Number(this.recordPerPage) * (_length);
        else if (Math.floor(_length) === 0)
          this.totalRecords = 10;
        else
          this.totalRecords = totalCount;

        this.totalPages = this.totalRecords / this.pager;
      }

      this.items = items;
    });
}


       
GetRoleList() {

  this.service.GetRoleList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
   
      const items = response?.result?.items || [];

     
      const projectOptions = items.map((item: any) => ({
        text: item.name,
        id: item.id
      }));

  
    // projectOptions.unshift({
    //   text: 'All',
    //   id: 0
    // });

    this.UserSelectSettings.options = projectOptions;
    this.UserOptions=projectOptions
// this.form.controls['selectedUser'].setValue({
//   text: 'All',
//   id: 0
// });

// this.form.controls['selectedStatus'].setValue({
//   name: 'All',
//   value: null
// });
    this.isUserOptionsLoaded = true;
  }, error => {
    console.error('Error fetching User list', error);
  });
}

GetActionList() {
  this.service.GetActionList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
   
      
        const items = response?.result || [];

     
        const projectOptions = items.map((item: any) => ({
          text: item.prmvalue,
          id: item.prmidentifier
       
        }));

  
    projectOptions.unshift({
      text: 'All',
      id: 0
    });

    this.ZoneSelectSettings.options = projectOptions;
    this.ZoneOptions=projectOptions
// this.form.controls['selectedAction'].setValue({
//   text: 'All',
//   id: 0
// });

// this.form.controls['selectedStatus'].setValue({
//   name: 'All',
//   value: null
// });
    this.isZoneOptionsLoaded = true;
  }, error => {
    console.error('Error fetching Zone list', error);
  });
}

close(){
    this.form.reset({
    selectedUser: [],      
    selectedAction: [],      
    selectedRole: []        
  });
   this.resetFormState();
}

getRoleList() {

let body = { permissions: null };
  
  this.service.GetRoleList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
   
      
     const items = response?.result?.items || [];

const projectOptions = items.map((item: any) => ({
  text: item.name || 'Unknown',
  id: item.id
}));

  
    // projectOptions.unshift({
    //   text: 'All',
    //   id:0
    // });

    this.RoleSelectSettings.options = projectOptions;
    this.RoleOptions=projectOptions
this.form.controls['selectedRole'].setValue({
  text: 'All',
  id: 0
});

// this.form.controls['selectedStatus'].setValue({
//   name: 'All',
//   value: null
// });
    this.isRoleOptionsLoaded = true;
    this.getFilteredList();
  }, error => {
    console.error('Error fetching Role list', error);
  });
}
     
      ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize select2
      $(this.selectElement.nativeElement).select2();

      // Handle change event
      $(this.selectElement.nativeElement).on('change', (event: any) => {
        this.selectedValue = $(event.target).val();
      });
    }
  }   
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Destroy select2 instance
      $(this.selectElement.nativeElement).select2('destroy');
    }
  }
      
    
      }

      

  
  

 
  
 






