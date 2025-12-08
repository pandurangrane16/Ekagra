import { Component,inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResolvedByData } from '../resolved-by-itself/resolved-by-itself.component';
import { Dialog } from '@angular/cdk/dialog';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { CmTextareaComponent } from '../../../common/cm-textarea/cm-textarea.component';
import { CmButtonComponent } from '../../../common/cm-button/cm-button.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { withLoader } from '../../../services/common/common';
import { LoaderService } from '../../../services/common/loader.service';
import { projconfigservice } from '../../../services/admin/progconfig.service';
import { alertservice } from '../../../services/admin/alert.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Globals } from '../../../utils/global';
import { AlertlogService } from '../../../services/admin/alertlog.service';
  

@Component({
  selector: 'app-alert-transfer',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule,CmTextareaComponent, CmSelect2Component],
  templateUrl: './alert-transfer.component.html',
  styleUrl: './alert-transfer.component.css'
})
export class AlertTransferComponent implements OnInit {
  form: FormGroup;
    router = inject(Router);
  inputFields = {
    remarks : {
      labelHeader: '',
      placeholder: 'Remarks',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    }
  }
  isUserLoaded : boolean = false;
   userSelectSettings = {
    labelHeader: 'Select User',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: []
  };
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private fb: FormBuilder,
  private dialog : Dialog, private loaderService : LoaderService,private globals:Globals,private service: alertservice, private toast: ToastrService,
  private alertLogService: AlertlogService) { }
  
  
  ngOnInit(): void {
    this.form = this.fb.group({
      remarks: ['', Validators.required],
      selectedUser :['',Validators.required]
    });

    debugger;
    // 🔥 Auto-trim remarks whenever user types
      this.form.get('remarks')?.valueChanges.subscribe(value => {
        if (value !== null && value !== undefined) {
          const trimmed = value.trimStart();
          if (trimmed !== value) {
            this.form.get('remarks')?.setValue(trimmed, { emitEvent: false });
          }
        }
      });

      this.globals.restoreUserMappingFromSession();

  // 🔥 Get category of current user
  const mapping = this.globals.userMapping;

  if (mapping) {
    console.log("User Role Category:", mapping.category);
    console.log("Role ID:", mapping.roleId);
    console.log("Zone ID:", mapping.zoneId);
    console.log("User ID:", mapping.userId);
  } else {
    console.warn("⚠ No mapping found… make sure you called fetchUserRoleDetails after login");
  }

    let item = [{
      name :"Pandurang",
      value : 1
    }]
    console.log(this.data);
    this.GetAlertTransferUserlist();
  }

    GetAlertTransferUserlist() {
          const storedUser = sessionStorage.getItem('userInfo');
    const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;
      this.service.GetAlertTransferUserlist(currentUserId).pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      const items = response?.result?.items || [];

const projectOptions = items.map((item: any) => ({
  name: item.userName,
  value: item.id
}));
  
  
        projectOptions.unshift({
          name: 'All',
          value: null
        });
  
        this.userSelectSettings.options = projectOptions;
        this.form.controls['selectedUser'].setValue({
          name: 'All',
          value: null
        });
  
        // this.form.controls['selectedStatus'].setValue({
        //   name: 'All',
        //   value: null
        // });
        this.isUserLoaded = true;
      }, (error:any) => {
        console.error('Error fetching project list', error);
      });
    }
  close() {
    this.dialog.closeAll();
  }



//   submitAction() {
//   try {
//     if (this.form.valid) {
//       this.form.markAllAsTouched();


//       let alertModel = {
//         alertId: this.data.id,
//         userId: this.form.controls['selectedUser'].value.value,
//         remarks: this.form.controls['remarks'].value
//       };

//     debugger;
//       this.service.TransferSOP(alertModel)
//         .pipe(withLoader(this.loaderService))
//         .subscribe({
//           next: () => {
//             this.toast.success('Alert submitted successfully');
            
//             var AlertLogRemark=this.form.controls['remarks'].value;
//             alert(AlertLogRemark);
//                 // ✅ Create FormData for AlertLog
//             const logData = {
//                 AlertId: this.data?.allData?.alertId || this.data?.allData?.id || 0,
//                 alertLogRemarks: AlertLogRemark +' (Transfered to: ' + this.form.controls['selectedUser'].value.name +')'|| '',
//                 ActionType: 'Transfer',
//                 Operation: 'Transfer',
//                 Status: 4,
//                 UserId: Number(sessionStorage.getItem('UserId')) || 0
//               };

//             // ✅ Call AlertLog create API
//             this.alertLogService.AlertLogCreate(logData)
//               .pipe(withLoader(this.loaderService))
//               .subscribe({
//                 next: () => {
//                   this.toast.success('Alert log created successfully');
//                   this.dialog.closeAll();
//                   this.router.navigate(['/alerts']);
//                 },
//                 error: (err) => {
//                   console.error('Failed to create alert log:', err);
//                   this.toast.error('Alert transferred, but failed to log entry');
//                 }
//               });


//           },
//           error: (err) => {
//             console.error('Save failed:', err);
//             this.toast.error('Failed to submit alert');
//           }
//         });

//     } else {
//       this.form.markAllAsTouched();
//       this.toast.error('Form is not valid');
//     }

//   } catch (error) {
//     console.error('Unexpected error in submit:', error);
//     this.toast.error('An unexpected error occurred');
//   }
// }

// submitAction2() {

//   debugger;
//   try {
//     if (!this.form.valid) {
//       this.form.markAllAsTouched();
//       this.toast.error('Form is not valid');
//       return;
//     }
//     else{
//           this.globals.restoreUserMappingFromSession();
//     const mapping = this.globals.userMapping;

//     if (!mapping) {
//       this.toast.error('User category not found. Please re-login.');
//       return;
//     }

// else {

//   const userCategory = mapping.category?.toLowerCase() || '';

//   const AlertLogRemark = this.form.controls['remarks'].value;
//   const selectedUser = this.form.controls['selectedUser'].value;

//   const storedUser = sessionStorage.getItem('userInfo');
//   const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;

//   let actionType = '';
//   let actionType2 = '';
//   let actionType3 = '';
//   let currentStatus = '';

//   switch (userCategory) {
//     case 'iccc':
//       actionType = 'TransferToICCC';
//       actionType2 = 'TransferByICCC';
//       actionType3 = 'ICCAcknowledgement';
//       currentStatus = 'TransferToICCC';
//       break;

//     case 'field':
//       actionType = 'TransferToSiteEngineer';
//       actionType3 = 'FieldEngineerAcknowledgement';
//       actionType2 = 'TransferBySiteEngineer';
//       currentStatus = 'TransferToSiteEngineer';
//       break;

//     case 'client':
//       actionType = 'TransferByClient';
//       currentStatus = 'TransferByClient';
//       break;

//     default:
//       actionType = 'Transfer';
//       currentStatus = 'Transferred';
//       break;
//   }

//   const alertId = this.data?.allData?.alertId
//   const createrId = this.data?.allData?.createruserid
//   const creatorUserIdToSend =
//   createrId && createrId !== 0 ? createrId : currentUserId;
    




//   // ----------------------------------------------------
//   // 🟢 ENTRY 1 → Log entry for the person TRANSFERRING
//   // ----------------------------------------------------
//   const logEntry1 = {
//     AlertId: alertId,
//     alertLogRemarks: `${AlertLogRemark} (Transferred to: ${selectedUser.value})`,
//     ActionType: actionType2,   // fixed action type
//     Operation: actionType2,
//     Status: 0,
//     UserId: currentUserId
//   };

//   // ----------------------------------------------------
//   // 🟢 ENTRY 2 → Log entry for the person RECEIVING
//   // ----------------------------------------------------
//   const logEntry2 = {
//     AlertId: alertId,
//     alertLogRemarks: `${AlertLogRemark} (Transferred from: User ${currentUserId})`,
//     ActionType: actionType,  
//     Operation: actionType,
//     Status: 0,
//     UserId: selectedUser.value   
//   };


//   // ----------------------------------------------------
//   // 🔄 STEP 1: Create FIRST log entry
//   // ----------------------------------------------------
//   this.alertLogService.AlertLogCreate(logEntry1)
//     .pipe(withLoader(this.loaderService))
//     .subscribe({
//       next: () => {
//         console.log("Entry 1 created");

//         // ----------------------------------------------------
//         // 🔄 STEP 2: Create SECOND log entry
//         // ----------------------------------------------------
//         this.alertLogService.AlertLogCreate(logEntry2)
//           .pipe(withLoader(this.loaderService))
//           .subscribe({
//             next: () => {
//               console.log("Entry 2 created");

//               // ----------------------------------------------------
//               // 🔄 STEP 3: Update main Alert status
//               // ----------------------------------------------------
//               const updateData = {
//                 id: alertId,
//                 lastModifierUserId: selectedUser.value ,
//                 currentStatus: currentStatus,
//                 remarks: `${AlertLogRemark} (Transferred to: ${selectedUser.text})`,
//                 creatorUserId:creatorUserIdToSend,

//                 creationTime: "2025-11-20T05:08:45.499Z",
//                 lastModificationTime: "2025-11-20T05:08:45.499Z",
//                 isDeleted:false,
//                 deleterUserId: 0,
//                 deletionTime: "2025-11-20T05:08:45.499Z",
//                 policyName: this.data?.allData?.policyName,
//                 siteId: this.data?.allData?.siteId,
//                 policyId: this.data?.allData?.policyId,
//                 response: this.data?.allData?.response,
//                 isStatus: 0,
//                 filePath: this.data?.allData?.filePath,
//                 devices:  this.data?.allData?.devices,
//                 alertSource: 0,
//                 ticketNo: this.data?.allData?.ticketNo,
//                 zoneId: this.data?.allData?.zoneID,

//               };

//               this.alertLogService.AlertUpdate(updateData)
//                 .pipe(withLoader(this.loaderService))
//                 .subscribe({
//                   next: () => {
//                     this.toast.success('Alert transferred successfully');
//                     this.dialog.closeAll();
//                     this.router.navigate(['/alerts']);
//                   },
//                   error: (err) => {
//                     console.error('Failed to update alert:', err);
//                     this.toast.error('Log created but alert update failed');
//                   }
//                 });
//             },
//             error: (err) => {
//               console.error('Failed to create second log entry', err);
//               this.toast.error('Failed to create receiver log entry');
//             }
//           });
//       },
//       error: (err) => {
//         console.error('Failed to create first log entry', err);
//         this.toast.error('Failed to create transfer log entry');
//       }
//     });
// }

//     }




//   } catch (error) {
//     console.error('Unexpected error:', error);
//     this.toast.error('Unexpected error occurred');
//   }
// }



submitAction() {

  if (!this.form.valid) {
    this.form.markAllAsTouched();
    this.toast.error('Form is not valid');
    return;
  }

  else{
  this.globals.restoreUserMappingFromSession();
  const mapping = this.globals.userMapping;

  if (!mapping) {
    this.toast.error('User category not found. Please re-login.');
    return;
  }
  else{
  const userCategory = mapping.category?.toLowerCase() || '';
  const remark = this.form.controls['remarks'].value;
  const selectedUser = this.form.controls['selectedUser'].value;

  const storedUser = sessionStorage.getItem('userInfo');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;
  const currentUserName = storedUser ? JSON.parse(storedUser).name :0 ;

  const alertId = this.data?.allData?.id;
  const creatorId = this.data?.allData?.createruserid;
  const currentAlertStatus = this.data?.allData?.currentStatus;
  const AlertLogRemark = this.form.controls['remarks'].value;

  // -----------------------------
  // 🔵 PART 1: Prepare UPDATE DATA for ALERT TABLE
  // -----------------------------
  let updateData: any = {
    id: alertId,
    lastModifierUserId: 0,
    creatorUserId: creatorId,
    currentStatus: this.data?.allData?.currentStatus,
    remarks: remark,
    policyName: this.data?.allData?.policyName,
    siteId: this.data?.allData?.siteId,
    policyId: this.data?.allData?.policyId,
    response: this.data?.allData?.response,
    isStatus: this.data?.allData?.isStatus,
    filePath: this.data?.allData?.filePath,
    devices: this.data?.allData?.devices,
    alertSource: this.data?.allData?.alertSource,
    ticketNo: this.data?.allData?.ticketNo,
    zoneId: this.data?.allData?.zoneID,
    creationTime: this.data?.allData?.creationTime,
    lastModificationTime: new Date(),
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: null
  };

  // -----------------------------
  // ⚡ CASE 1 → FIELD ROLE
  // -----------------------------
  if (userCategory === 'field') {
    updateData.lastModifierUserId = selectedUser.value; // ✔ selected user
    updateData.currentStatus = "TransferToSiteEngineer"; // ✔ fixed
    updateData.remarks= `${AlertLogRemark} (Transfer to: ${selectedUser.name})`;
    updateData.isStatus=1
  }

  // -----------------------------
  // ⚡ CASE 2 → ICCC ROLE
  // -----------------------------
  if (userCategory === 'iccc') {
    updateData.lastModifierUserId = currentUserId;   // ✔ current user
    updateData.creatorUserId = selectedUser.value;   // ✔ receiver
    updateData.currentStatus = "TransferToICCC";     // ✔ fixed
    updateData.remarks= `${AlertLogRemark} (Transfer to: ${selectedUser.name})`;
    updateData.isStatus=1
  }

  // -----------------------------
  // 🔵 PART 2: Prepare ALERT LOG ENTRIES
  // -----------------------------
  let logEntries: any[] = [];

  // -----------------------------
  // ⚡ FIELD ROLE LOGIC
  // -----------------------------
  if (userCategory === 'field') {

    if (currentAlertStatus === 'AssignToFieldEngineer') {
      // CASE A — 3 entries
      logEntries.push(
        { AlertId: alertId,alertLogRemarks: `FieldEngineerAcknowledgement By ${currentUserName}`,Operation:"FieldEngineerAcknowledgement",ActionType: "FieldEngineerAcknowledgement", UserId: currentUserId },
        { AlertId: alertId, alertLogRemarks:remark,Operation:"TransferBySiteEngineer", ActionType: "TransferBySiteEngineer", UserId: currentUserId},
        { AlertId: alertId, alertLogRemarks: `Transfer To ${selectedUser.name}`,Operation:"TransferToSiteEngineer", ActionType: "TransferToSiteEngineer", UserId: selectedUser.value}
      );
    } else {
      // CASE B — 2 entries
      logEntries.push(
        { AlertId: alertId, alertLogRemarks:remark, Operation:"TransferBySiteEngineer", ActionType: "TransferBySiteEngineer", UserId: currentUserId },
        { AlertId: alertId,alertLogRemarks: `Transfer To ${selectedUser.name}`, Operation:"TransferToSiteEngineer", ActionType: "TransferToSiteEngineer", UserId: selectedUser.value }
      );
    }
  }

  // -----------------------------
  // ⚡ ICCC ROLE LOGIC
  // -----------------------------
  if (userCategory === 'iccc') {

    if (!creatorId || creatorId === 0) {
      // CREATORID NULL → 3 entries
      logEntries.push(
        { AlertId: alertId,alertLogRemarks: `ICCAcknowledgement By ${currentUserName}`,Operation:"ICCAcknowledgement",  ActionType: "ICCAcknowledgement", UserId: currentUserId },
        { AlertId: alertId, alertLogRemarks:remark, Operation:"TransferByICCC", ActionType: "TransferByICCC", UserId: currentUserId},
        { AlertId: alertId,alertLogRemarks: `Transfer To ${selectedUser.name}`, Operation:"TransferToICCC", ActionType: "TransferToICCC", UserId: selectedUser.value}
      );
    } else {
      // CREATORID NOT NULL → 2 entries
      logEntries.push(
        { AlertId: alertId, alertLogRemarks:remark, Operation:"TransferByICCC", ActionType: "TransferByICCC", UserId: currentUserId},
        { AlertId: alertId,alertLogRemarks: `Transfer To ${selectedUser.name}`, Operation:"TransferToICCC", ActionType: "TransferToICCC", UserId: selectedUser.value}
      );
    }
  }

  // -----------------------------
  // 🔥 SAVE ALL LOG ENTRIES (SEQUENTIAL)
  // -----------------------------
  const createLogsSequentially = (i: number) => {
    if (i >= logEntries.length) {
      // After all log entries → Update main alert
      this.alertLogService.AlertUpdate(updateData)
        .pipe(withLoader(this.loaderService))
        .subscribe({
          next: (res:any) => {
            this.toast.success("Alert updated successfully");
        const updatedAlert = res?.result;
        this.globals.saveAlert(updatedAlert);
            this.dialog.closeAll();
            this.router.navigate(['/alerts']);
          },
          error: () => this.toast.error("Alert update failed")
        });
      return;
    }

    this.alertLogService.AlertLogCreate(logEntries[i])
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: () => createLogsSequentially(i + 1),
        error: () => this.toast.error("Failed to create alert log")
      });
  };

  createLogsSequentially(0);
  }

  
  }

 
}




  cancelAction() {

  }

  onUserSelected(evt : any) {

  }
}
