import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { debug } from 'node:console';
import { RoleConfigurationService } from '../../services/admin/role-configuration.service'; 
// jQuery declared globally
declare var $: any;

@Component({
    selector: 'app-user-mappings',
    standalone: true,
    imports: [
    CommonModule,
   CmTableComponent,
   CmSelect2Component,
    CmInputComponent,
   
    MatCardModule, MatButtonModule,
    MaterialModule
],
   templateUrl: './user-mappings.component.html',
  styleUrl: './user-mappings.component.css',
})

     export class UserMappingsComponent implements OnInit, AfterViewInit, OnDestroy {
      StartDate: string | null = null;
      EndDate: string | null = null;
      SiteName: string | null = null;
      ProjectId: number | null = null;
      Type: string | null = null;
      IsActive: boolean | null = null;
      Filter: string | null = null;
      Sorting: string | null = null;

    

    private destroy$ = new Subject<void>();
  userAlreadyMappedMessage = '';
  isCheckingUser = false;
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
RoleOptions2 = [
  { id: 0, text: 'All' },
 
];
  projectSelectSettings = {
    labelHeader: 'Select Role Category',
    lableClass: 'form-label',
    formFieldClass: '', 
    appearance: 'fill',
    options: [ ]
  };
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
      userMappings: UserZoneMapping[] = [];
     
      collectionSize = 2;
      list!:any;
      isUserOptionsLoaded = false;
      isZoneOptionsLoaded = false;
      isRoleOptionsLoaded = false;
      isProjectOptionsLoaded=false;
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
          labelHeader: 'Select User',
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
        private service: UserMappingService, private toast: ToastrService,
         private RoleService: RoleConfigurationService,
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
        private searchSubject = new Subject<string>();

      ngOnInit(): void {
        debugger;
  this.searchSubject
    .pipe(debounceTime(400))
    .subscribe((value) => {
      this.pager = 0;
      this.getFilteredList();
    });

       
       this.form = this.fb.group({
  
  selectedUser: [null, Validators.required],
  selectedZone: [[null], this.minArrayLength(1)],
  selectedRole: [[], this.minArrayLength(1)],
  selectedCategory: [null],   
  searchText: ['']
});
          this.buildHeader();
        //  this.getProjConfigList();
        this.getRoleList_All();
         this.getUserList();
          this.getZoneList();
           this.getRoleCategoryList();
          this.getFilteredList();
         
        
         


            this.form.get('searchText')?.valueChanges
              .pipe(
                debounceTime(300), 
                distinctUntilChanged() 
              )
              .subscribe(value => {
                debugger;
                   if (value && value.length >= 3) {
                       this.perPage=10;
                 this.pager=0;
                 this.searchText=value;
                this.getFilteredList();
              } else if (!value || value.length === 0) {

                 this.perPage=10;
                 this.pager=0;
                 this.searchText="";
                 this.getFilteredList();
              }
              });
       

                // Subscribe to selectedUser changes
    const userCtrl = this.form.get('selectedUser');
    if (userCtrl) {
      userCtrl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged((prev, curr) => {
            // compare user IDs if they're objects
            const prevId = Array.isArray(prev) ? prev.map((p: any) => p.id || p) : [prev?.id || prev];
            const currId = Array.isArray(curr) ? curr.map((c: any) => c.id || c) : [curr?.id || curr];
            return JSON.stringify(prevId) === JSON.stringify(currId);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe((selectedUsers: any) => {
          this.userAlreadyMappedMessage = '';

          if (!selectedUsers || selectedUsers.length === 0) {
            return;
          }

          // get the first selected user (or handle multiple as needed)
          const user = Array.isArray(selectedUsers) ? selectedUsers[0] : selectedUsers;
          const userId = user?.id || user;

          if (!userId) return;


           //  DO NOT CHECK IF USER IS IN EDIT MODE
      if (this.isEdit) {
        console.log("Edit mode → skipping GetRoleCategeoryOnUserId call");
        return; 
      }

          this.isCheckingUser = true;
          this.service.GetRoleCategeoryOnUserId(userId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
              debugger;
              // const hasMapping = !!(res?.result && (Array.isArray(res.result) ? res.result.length > 0 : res.result));
            const hasMapping =
              res?.result &&
              Array.isArray(res.result.items) &&
              res.result.items.length > 0;
              if (hasMapping) {
                this.userAlreadyMappedMessage = `User "${user.text || userId}" is already mapped. You can edit and update the mapping.`;
                // optionally disable the form or show warning
                // this.form.get('selectedZone')?.disable();
                // this.form.get('selectedRole')?.disable();
              } else {
                this.userAlreadyMappedMessage = '';
                this.form.get('selectedZone')?.enable();
                this.form.get('selectedRole')?.enable();
              }
              this.isCheckingUser = false;
            },
            error: (err) => {
              console.error('GetRoleCategeoryOnUserId error', err);
              this.userAlreadyMappedMessage = '';
              this.isCheckingUser = false;
            }
          });
        });
    }


        }

        
// onSearchChange() {
//   // const value = this.form.get('searchText')?.value;

//   // if (!value || value.length >= 2) {
//   //   this.searchSubject.next(value);
//   // }
//    const value = this.form.value.searchText;
//   this.searchSubject.next(value);
//   alert(value); 
// }
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
      //  if (this.isEdit) return;   // <-- FIX
      this.isRoleOptionsLoaded = false;
      this.getRoleList(event.name);
        }


          getRoleCategoryList() {
    this.service.GetCategoryList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
      const items = response?.result || [];
  
      const projectOptions = items.map((item: any) => ({
        name: item.prmvalue
        
        
      }));
  
    
      // projectOptions.unshift({
      //   name: 'All',
      //   value: null
      // });
  

this.projectSelectSettings = JSON.parse(JSON.stringify({
  ...this.projectSelectSettings,
  options: projectOptions
}));
  // this.form.controls['selectedProject'].setValue({
  //   name: 'All',
  //   value: null
  // });
  
  // this.form.controls['selectedStatus'].setValue({
  //   name: 'All',
  //   value: null
  // });
      this.isProjectOptionsLoaded = true;
    }, error => {
      console.error('Error fetching project list', error);
    });
  }
  submit() {





        if (!this.form.invalid) {
            this.form.markAllAsTouched();
    

    const zones = this.form.value.selectedZone.map((z: any) => z.id).join(',');
    const roles = this.form.value.selectedRole.map((z: any) => z.id).join(',');
    const user = this.form.value.selectedUser.map((z: any) => z.id).join(',');

    // this.toast.success(zones || 'No zones selected', 'Zones');
    //  this.toast.success(roles || 'No zones selected', 'Zones');
    //   this.toast.success(user || 'No zones selected', 'Zones');

 if (this.form.value.selectedUser.length > 1) {
  this.toast.error('Please select only one user at a time', 'Multiple Users Selected');
  return; // stop execution if multiple users selected
}
else{
     if (!this.form.invalid) {
      this.form.markAllAsTouched();

      let _UserZoneMapping = new UserZoneMapping();

      _UserZoneMapping.creationTime="2025-06-16 12:45:23.982"
      _UserZoneMapping.creatorUserId=0
      _UserZoneMapping.deleterUserId=0
      _UserZoneMapping.deletionTime="2025-06-16 12:45:23.982"
      _UserZoneMapping.isDeleted=false
      _UserZoneMapping.lastModificationTime="2025-06-16 12:45:23.982"
      _UserZoneMapping.lastModifierUserId=0
      _UserZoneMapping.roleId=roles
      _UserZoneMapping.userId=user
      _UserZoneMapping.zoneId=zones

        if (this.isEdit && this.selectedRecordId) {
    _UserZoneMapping.id = this.selectedRecordId;
  }



   console.log("hi", _UserZoneMapping);

  const selectedUserId = Number(this.form.value.selectedUser[0].id);
const existingMapping = this.userMappings?.find((m: any) => m.userId === selectedUserId);


if(existingMapping){
   _UserZoneMapping.id = existingMapping.id;
  {this.service.Update(_UserZoneMapping)
  .pipe(withLoader(this.loaderService))
  .subscribe({
    next: () => {
      console.log('Updated successfully');
      this.toast.success('UserMapping Updated successfully');
        this.isEdit = false;
      this.getFilteredList();
        this.form.reset({
    selectedUser: [],      
    selectedZone: [],      
    selectedRole: []        
  });
      // this.router.navigate(['/admin/projfieldconfig']);
    },
    error: (err) => {
      console.error('Save failed:', err);
           this.form.reset({
    selectedUser: [],      
    selectedZone: [],      
    selectedRole: []        
  });
      // Optionally show a toast
      this.toast.error('Failed to save UserMapping');
        this.isEdit = false;
    }
  });
}

}

else{  if(this.isEdit)
  {this.service.Update(_UserZoneMapping)
  .pipe(withLoader(this.loaderService))
  .subscribe({
    next: () => {
      console.log('Updated successfully');
      this.toast.success('UserMapping Updated successfully');
        this.isEdit = false;
      this.getFilteredList();
        this.form.reset({
    selectedUser: [],      
    selectedZone: [],      
    selectedRole: []        
  });
      // this.router.navigate(['/admin/projfieldconfig']);
    },
    error: (err) => {
      console.error('Save failed:', err);
           this.form.reset({
    selectedUser: [],      
    selectedZone: [],      
    selectedRole: []        
  });
      // Optionally show a toast
      this.toast.error('Failed to save UserMapping');
        this.isEdit = false;
    }
  });
}


   else{this.service.Create(_UserZoneMapping)
  .pipe(withLoader(this.loaderService))
  .subscribe({
    next: () => {
      console.log('Saved successfully');
      this.toast.success('UserMapping saved successfully');
      this.getFilteredList();
        this.form.reset({
    selectedUser: [],      
    selectedZone: [],      
    selectedRole: []        
  });
      // this.router.navigate(['/admin/projfieldconfig']);
    },
    error: (err) => {
      console.error('Save failed:', err);
           this.form.reset({
    selectedUser: [],      
    selectedZone: [],      
    selectedRole: []        
  });
      // Optionally show a toast
      this.toast.error('Failed to save UserMapping');
    }
  });
}
}












    }
    else {
      this.form.markAllAsTouched();
       this.toast.error('Form is not valid');
      return;

    }
}
    










    }
    else {
      this.form.markAllAsTouched();
       this.toast.error('Form is not valid');
      return;

    }


    



 


  }
    

        openDialog() {
      this.router.navigate(['/admin/projform']);   
          
}
        buildHeader() {  
          this.headArr = [
            { header: 'UserName', fieldValue: 'userName', position: 1 },
            { header: 'Zone', fieldValue: 'zoneNames', position: 2 },
            { header: 'Role', fieldValue: 'roleNames', position: 3 },
            { header: 'Category', fieldValue: 'category', position: 4 }, 
             { header: 'Action', fieldValue: 'button', position: 5 }
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
// editRow(rowData: any) {
//   if (!rowData?.id) {
//     this.toast.error('Invalid record', 'Error');
//     return;
//   }

//   this.selectedRecordId=rowData.id;

//     this.isEdit = true;
 
//   // Call API using your GetById service
//   this.service.GetById(rowData.id)
//     .pipe(withLoader(this.loaderService))
//     .subscribe({
//       next: (response: any) => {
//         const result = response?.result;
//         if (!result) {
//           this.toast.error('No data found', 'Error');
//           return;
//         }
// debugger;
//       // this.isRoleOptionsLoaded = false;
//       // this.getRoleList(result.Category);

//         // Extract IDs and convert comma-separated values to arrays
//         const zoneIds = result.zoneId ? result.zoneId.split(',').map((id: string) => id.trim()) : [];
//         const roleIds = result.roleId ? result.roleId.split(',').map((id: string) => id.trim()) : [];
//         const userId =  String(result.userId);

//         // Find matching option objects from your dropdown lists
//         const selectedZones = this.ZoneOptions?.filter((z: any) => zoneIds.includes(String(z.id))) || [];
//         const selectedRoles = this.RoleOptions?.filter((r: any) => roleIds.includes(String(r.id))) || [];
//         const selectedUser = this.UserOptions?.filter((r: any) => userId.includes(String(r.id))) || [];


//   // using rolei find out category  

//   const firstRoleId = roleIds.length > 0 ? roleIds[0] : null;

//     if (firstRoleId) {
//       this.RoleService.GetAllRoles().subscribe((roleRes: any) => {
//         const allRoles = roleRes?.result?.items || [];
//         const matchedRole = allRoles.find((r: any) => String(r.id) === String(firstRoleId));
//         const category = matchedRole?.category || null;
//         this.projectSelectSettings = category;
//         console.log("Matched Category: ", category);
      
//       });
//     }

//         // Patch values into the form

        
//         this.form.patchValue({
//           selectedUser:  selectedUser || null,
//           selectedZone: selectedZones,
//           selectedRole: selectedRoles,
//           selectedCategory: this.projectSelectSettings  || null  
//         });

//         //   this.form.controls['selectedUser'].disable();

//       this.toast.success('Record data loaded successfully. You can now edit the record.', 'Edit Mode Activated');

//       },
//       error: (err) => {
//         console.error('Error fetching record:', err);
//         this.toast.error('Failed to load record', 'Error');
//       }
//     });
// }

editRow(rowData: any) {

  this.selectedRecordId = rowData.id;
  this.isEdit = true;

  this.service.GetById(rowData.id)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (response: any) => {

        const result = response?.result;
        if (!result) {
          this.toast.error('No data found', 'Error');
          return;
        }
debugger;
        const zoneIds = result.zoneId?.split(',') || [];
        const roleIds = result.roleId?.split(',') || [];
        // const userId = result.userId?.split(',') || [];  // ⬅️ FIXED
        const userId = String(result.userId).split(',').map(x => x.trim());


        // Step 1: GET FIRST ROLE ID
        const firstRoleId = roleIds.length > 0 ? Number(roleIds[0]) : null;
        if (!firstRoleId) {
          console.warn("No role available in record");
          return;
        }

        // Step 2: Load ALL roles → find category based on roleId
        this.RoleService.GetAllRoles().subscribe((roleRes: any) => {

          const allRoles = roleRes?.result?.items || [];
          const matchedRole = allRoles.find((r: any) => r.id === firstRoleId);

          if (!matchedRole) {
            console.warn("Role not found in role list");
            return;
          }

          const category = matchedRole.category;
          
          // Step 3: Bind Category to dropdown
          this.form.patchValue({
            selectedCategory: { name: category }
          });

          // Step 4: Load roles of this category
          this.getRoleList(category);

          setTimeout(() => {
            const selectedRoles = this.RoleOptions?.filter((r: any) =>
              roleIds.includes(String(r.id))
            ) || [];

            const selectedZones = this.ZoneOptions?.filter((z: any) =>
              zoneIds.includes(String(z.id))
            ) || [];

            const selectedUser = this.UserOptions?.filter((u: any) =>
              userId.includes(String(u.id))
            ) || [];

            this.form.patchValue({
              selectedUser: selectedUser,
              selectedZone: selectedZones,
              selectedRole: selectedRoles
            });

            this.toast.success('Record loaded — Edit Mode Active');
          }, 300); // delay ensures RoleOptions are loaded
        });
      },

      error: () => {
        this.toast.error('Failed to load record', 'Error');
      }
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

//   this.service.GetFilteredList(this.MaxResultCount, this.SkipCount)
//     .pipe(withLoader(this.loaderService))
//     .subscribe((response: any) => {
//       const items = response.result?.items || [];
     
// this.items = items;
// debugger;

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
//             .map((id: string) => this.RoleOptions2.find((r: any) => String(r.id) === id)?.text)
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
  debugger;

  this.MaxResultCount = this.perPage;
  this.SkipCount = this.MaxResultCount * this.pager;

  // const search = this.form.get('searchText')?.value; // ✅ FIXED
const search = this.searchText;
  this.service.GetUserMappingList(
    this.StartDate ?? undefined,
    this.EndDate ?? undefined,
    this.SiteName ?? undefined,
    this.ProjectId ?? undefined,
    this.Type ?? undefined,
    this.IsActive ?? undefined,
    search,
    this.Sorting ?? undefined,
    this.MaxResultCount ?? undefined,
    this.SkipCount ?? undefined
  )
    .pipe(withLoader(this.loaderService))
    .subscribe((response: any) => {
      const items = response.result?.items || [];
      const totalCount = response.result?.totalCount || 0;

      items.forEach((element: any) => {
        const zoneIds = element.zoneId?.split(',').map((x:any) => x.trim()) || [];
        const roleIds = element.roleId?.split(',').map((x:any) => x.trim()) || [];

        element.zoneNames = element.zoneNames || 'N/A';
        element.roleNames = element.roleNames || 'N/A';
        element.userName = element.name || 'N/A';
        element.category = element.category || 'N/A';
        element.button = [
          { label: 'Edit', icon: 'edit', type: 'edit' }
        ];
      });

      const pages = totalCount / Number(this.perPage);
      this.totalRecords = pages > Math.floor(pages)
        ? Number(this.perPage) * pages
        : totalCount;

      this.items = items;
      this.userMappings = items;
    });
}
onActionSelectionChange(event: any) {
  const selectedValues = this.form.value.selectedZone || [];
  const allOption = this.ZoneOptions.find((x: any) => x.text.toLowerCase() === 'all');

  if (!allOption) return;

  const isAllSelected = selectedValues.some((x: any) => x.id === allOption.id);

  // If ALL is selected → select every option **except ALL**
  if (isAllSelected) {
    const allExceptAll = this.ZoneOptions.filter((x: any) => x.id !== allOption.id);

    this.form.patchValue({
      selectedZone: allExceptAll
    });

    return;
  }

  // If user selects anything else → ensure ALL is removed
  const cleaned = selectedValues.filter((x: any) => x.id !== allOption.id);

  this.form.patchValue({
    selectedZone: cleaned
  });
}
clearActions() {
  this.form.patchValue({ selectedZone: [] });
}
       
// getUserList() {

//   this.service.GetUserList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
   
//       const items = response?.result?.items || [];

     
//       const projectOptions = items.map((item: any) => ({
//         text: item.userName || 'Unknown',
//         id: item.id
//       }));

  
//     projectOptions.unshift({
//       text: 'All',
//       id: 0
//     });

//     this.UserSelectSettings.options = projectOptions;
//     this.UserOptions=projectOptions
//     this.UserOptions = response.result.filter((x:any) => x.text !== 'All');

// // this.form.controls['selectedUser'].setValue({
// //   text: 'All',
// //   id: 0
// // });

// // this.form.controls['selectedStatus'].setValue({
// //   name: 'All',
// //   value: null
// // });
//     this.isUserOptionsLoaded = true;
//   }, error => {
//     console.error('Error fetching User list', error);
//   });
// }
getUserList() { 
  debugger;
  this.service.GetUserList()
    .pipe(withLoader(this.loaderService))
    .subscribe((response: any) => {

      const items = response?.result?.items || [];

      // Convert API response → Dropdown array
      let projectOptions = items.map((item: any) => ({
        text: item.userName || 'Unknown',
        id: item.id
      }));

      // ❌ Do NOT add "All"  
      // ❌ Do NOT unshift All
      // projectOptions.unshift({ text: 'All', id: 0 });

      // ✔ Remove if API accidentally sends "All"
    projectOptions = projectOptions.filter(((x:any) => x.text !== 'All'));

      // ✔ Assign clean array
      this.UserOptions = projectOptions;
      this.UserSelectSettings.options = projectOptions;

      this.isUserOptionsLoaded = true;

    }, error => {
      console.error('Error fetching User list', error);
    });
}

getZoneList() {
  this.service.GetZoneList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
   
      debugger;
        const items = response?.result || [];

     
        const projectOptions = items.map((item: any) => ({
          text: (item.zoneName || '').trim() || 'Unknown',
          id: item.id
        }));

  
    projectOptions.unshift({
      text: 'All',
      id: 0
    });

    this.ZoneSelectSettings.options = projectOptions;
    this.ZoneOptions=projectOptions
if (!this.isEdit) {
  this.form.controls['selectedRole'].setValue({
    text: 'All',
    id: 0
  });
}

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
    selectedZone: [],      
    selectedRole: []        
  });
}

// getRoleList(type: any) {
//   this.service.GetRoleByCategory(type)
//     .pipe(withLoader(this.loaderService))
//     .subscribe((response: any) => {

//       const items = response?.result?.items || [];

//       const projectOptions = items.map((item: any) => ({
//         text: item.name || 'Unknown',
//         id: item.id
//       }));

//       projectOptions.unshift({ text: 'All', id: 0 });

//       this.RoleOptions = projectOptions;
//       this.isRoleOptionsLoaded = true;
//       this.RoleOptions = response.result.filter((x:any) => x.text !== 'All');

//       // 🛑 FIX: do not override selectedRole in edit mode
//       if (!this.isEdit) {
//         this.form.controls['selectedRole'].setValue([{ text: 'All', id: 0 }]);
//       }

//     }, error => {
//       console.error('Error fetching Role list', error);
//     });
// }

getRoleList(type: any) { 
  this.service.GetRoleByCategory(type)
    .pipe(withLoader(this.loaderService))
    .subscribe((response: any) => {

      const items = response?.result?.items || [];

      let projectOptions = items.map((item: any) => ({
        text: item.name || 'Unknown',
        id: item.id
      }));

      // ❌ Do NOT add "All"
      // projectOptions.unshift({ text: 'All', id: 0 });

      // ✔ Remove All if API contains it
      projectOptions = projectOptions.filter((x:any)   => x.text !== 'All');

      this.RoleOptions = projectOptions;
      this.isRoleOptionsLoaded = true;

      // 🛑 Keep old role only if NOT editing
      if (!this.isEdit) {
        this.form.controls['selectedRole'].setValue(null);
      }

    }, error => {
      console.error('Error fetching Role list', error);
    });
}

getRoleList_All() {
  debugger;

let body = { permissions: null };
  
  this.service.GetRoleList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
   
      
     const items = response?.result?.items || [];

const projectOptions = items.map((item: any) => ({
  text: item.displayName || 'Unknown',
  id: item.id
}));

  
    projectOptions.unshift({
      text: 'All',
      id:0
    });

   // this.RoleSelectSettings.options = projectOptions;
    this.RoleOptions2=projectOptions
// this.form.controls['selectedRole'].setValue({
//   text: 'All',
//   id: 0
// });

// this.form.controls['selectedStatus'].setValue({
//   name: 'All',
//   value: null
// });
  //  this.isRoleOptionsLoaded = true;
    //this.getFilteredList();
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
     this.destroy$.next();
    this.destroy$.complete();
    if (isPlatformBrowser(this.platformId)) {
      // Destroy select2 instance
      $(this.selectElement.nativeElement).select2('destroy');
    }
  }
      
    
      }

      

  
  

 
  
 





