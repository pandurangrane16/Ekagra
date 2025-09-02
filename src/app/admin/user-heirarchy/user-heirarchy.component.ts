import { Component, inject, OnInit } from '@angular/core';
import { CmSelect2Component } from '../../common/cm-select2/cm-select2.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../Material.module';
import { CmTableComponent } from '../../common/cm-table/cm-table.component';
import { CommonModule } from '@angular/common';
import { UserHierarchyService } from '../../services/admin/userhierarchy.service';
import { ToastrService } from 'ngx-toastr';
import { withLoader } from '../../services/common/common';
import { LoaderService } from '../../services/common/loader.service';
import { userhierarchymodel } from '../../models/admin/userhierarchy.model';

@Component({
  selector: 'app-user-heirarchy',
  imports: [CmSelect2Component, ReactiveFormsModule, MaterialModule, CmTableComponent, CommonModule],
  templateUrl: './user-heirarchy.component.html',
  styleUrl: './user-heirarchy.component.css'
})
export class UserHeirarchyComponent implements OnInit {
   loaderService = inject(LoaderService);
  headerArr: any;
     totalPages: number = 1;
      pager: number = 1;
        MaxResultCount=10;
  SkipCount=0;
  perPage=10;
  pageNo=0;
recordPerPage: number = 10;
processedItems: any[] = [];



  totalRecords: any = 0;
 
  userTypeSettings: any;
  isUserLoaded: boolean = false;
  isManagerLoaded: boolean = false;
  managerSettings: any;
  form: any;
  fb = inject(FormBuilder);
  openDialog() { }
  onUserTypeSelected(evt: any) { }
  onManagerSelected(evt: any) { }
  onPageChange(evt: any) { }
  onRowClicked(evt: any) { }
  onButtonClicked(evt: any) { }
  onPageRecordsChange(evt: any) { }
  items: any;
  headArr: any;
  collectionSize: any;


    constructor(
  
      private service: UserHierarchyService,
      private toast: ToastrService,

    ){}

  ngOnInit(): void {

    this.getUserList();
  
      this.buildHeader();
    this.isUserLoaded = false;
    this.userTypeSettings = {
      labelHeader: 'Select User',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: [],
    };
      this.managerSettings = {
      labelHeader: 'Select Manager',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: []
    };

    this.form = this.fb.group({
      userName: ['', Validators.required],
      manager: ['',Validators.required],
    })


      this.getFilteredList();
  }
        buildHeader() {  
          this.headArr = [
            { header: 'Employee Name', fieldValue: 'employee', position: 1 },
            { header: 'Manager Name', fieldValue: 'manager', position: 2 },
       
          ];
          ;}

        
 getFilteredList() {
    // const selectedProjectId = this.form.controls['selectedProject'].value.value;
    
    //  const search = this.form.controls['searchText'].value
    //     this.MaxResultCount=this.perPage;
    //   this.SkipCount=this.MaxResultCount*this.pager;
    //   this.recordPerPage=this.perPage;
 
    this.service.GetList().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
  const items = response?.result || []; 
  this.items = items;
  this.processedItems=items;
  console.log( "Processed Items:", this.processedItems)
   console.log( "Response:", response)

  if (Array.isArray(items)) {
    items.forEach((element: any) => {
      element.employee = element.employeeName;
      element.manager = element.managerName || null; 

      element.button = [
        { label: 'Edit', icon: 'edit', type: 'edit' },
        { label: 'Delete', icon: 'delete', type: 'delete' }
      ];
    });

 
    const totalCount = items.length;

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

//     onSubmit() {
//   if (this.form.invalid) {
//      this.toast.error('Please select all values.');
//     return; 
//   }

//   const employeeId = this.form.value.userName.value;
//   const managerId = this.form.value.manager.value;

//   if (employeeId === managerId) {
   
//     this.toast.error('Employee and Manager cannot be the same!');
//     return;
//   }

//   else{

//  const existingManager = this.processedItems.find((x: any) => x.employeeId === employeeId && x.managerId !== null);
// if (existingManager && existingManager.managerId !== managerId) {
//   this.toast.error(`Employee ${employeeId} already has Manager ${existingManager.managerId}!`);
//   return;
// }
// else{

//   const isCircular = this.processedItems.find((x: any) => x.employeeId === managerId && x.managerId === employeeId);
// if (isCircular) {
//   this.toast.error(`Employee ${employeeId} and Employee ${managerId} cannot manage each other!`);
//   return;
// }
// else{
//   const model: userhierarchymodel = {
//     employeeId: employeeId,
//     managerId: managerId
//   };

//       this.service.Create(model)
//         .pipe(withLoader(this.loaderService))
//         .subscribe({
//           next: (res: any) => {
//             console.log(res);
//             this.toast.success('Manager  assigned successfully.');
//             this.getFilteredList();
//           },
//           error: (err) => {
//             console.error('Error creating rule engine:', err);
//             this.toast.error('Failed to save Manager. Please try again.');
//           }
//         });
//   }
// }

// }







// }

onSubmit() {
  if (this.form.invalid) {
    this.toast.error('Please select all values.');
    return;
  }

  const employeeId = this.form.value.userName.value;
  const managerId = this.form.value.manager.value;

  if (employeeId === managerId) {
    this.toast.error('Employee and Manager cannot be the same!');
    return;
  }
  else {
  
    const createsCycle = (empId: any, mgrId: any, items: any[]): boolean => {
      let current = mgrId;
      while (current !== null) {
        if (current === empId) {
          return true; // cycle detected
        }
        const next = items.find(x => x.employeeId === current);
        current = next ? next.managerId : null;
      }
      return false;
    };

    if (createsCycle(employeeId, managerId, this.processedItems)) {
    this.toast.error(`They can't manage each other!`);
      return;
    }
    else {

      let managerRecord = this.processedItems.find((x: any) => x.employeeId === managerId);

   const createOrUpdate = (empId: any, mgrId: any) => {
  const record = this.processedItems.find((x: any) => x.employeeId === empId);
  const model: userhierarchymodel = { employeeId: empId, managerId: mgrId };

  if (!record) {
    // Create new record
    this.service.Create(model)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (res: any) => {
          console.log(`Created ${empId} -> ${mgrId}`);
          this.toast.success(`Record ${empId} -> ${mgrId} created successfully.`);
          this.getFilteredList();
          this.form.reset();
          this.form.markAsPristine();
          this.form.markAsUntouched();
        },
        error: (err) => {
          console.error('Error creating record:', err);
          this.toast.error('Failed to save record. Please try again.');
          this.getFilteredList();
          this.form.reset();
          this.form.markAsPristine();
          this.form.markAsUntouched();
        }
      });
  } else if (record.managerId !== mgrId) {
    // Update existing record
    this.service.Update(empId, model) 
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (res: any) => {
          console.log(`Updated ${empId} -> ${mgrId}`);
          this.toast.success(`Record ${empId} -> ${mgrId} updated successfully.`);
          this.getFilteredList();
          this.form.reset();
          this.form.markAsPristine();
          this.form.markAsUntouched();
        },
        error: (err) => {
          console.error('Error updating record:', err);
          this.toast.error('Failed to update record. Please try again.');
          this.getFilteredList();
          this.form.reset();
          this.form.markAsPristine();
          this.form.markAsUntouched();
        }
      });
  } else {
    // Record already exists with the same manager
    console.log(`Record ${empId} -> ${mgrId} already exists. No action taken.`);
    this.toast.error(`Record ${empId} -> ${mgrId} already exists. No changes made.`);
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
};


      if (!managerRecord) {
      
        createOrUpdate(managerId, null);

        setTimeout(() => {
          createOrUpdate(employeeId, managerId);
        }, 500);
      }
      else {
        // Manager exists
        createOrUpdate(employeeId, managerId);
      }
    }
  }
}



    getUserList() {
      this.service.GetUserList().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
        const items = response?.result || [];
  
        const projectOptions = items.map((item: any) => ({
          name: item.name,
          value: item.id
        }));
  
  
  
        this.userTypeSettings.options = projectOptions;
        this.managerSettings.options = projectOptions;
    
  
        this.isUserLoaded = true;
      }, error => {
        console.error('Error fetching user list', error);
      });
    }

}
