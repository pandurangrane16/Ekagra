import { CommonModule,} from '@angular/common';
import { Component,Output,EventEmitter,inject, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { Globals } from '../../../../utils/global';
import { ToastrService } from 'ngx-toastr';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';
import { alertservice } from '../../../../services/admin/alert.service';
@Component({
  selector: 'app-action-closed',
  imports: [CommonModule,CmTextareaComponent,MaterialModule],
  templateUrl: './action-closed.component.html',
  styleUrl: './action-closed.component.css'
})
export class ActionClosedComponent implements OnInit {
  router = inject(Router);
  form:any;
    inputFields = {
    remarks: {
      labelHeader: '',
      placeholder: 'Remarks',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    }
  }
  @Input() task : any;
 @Output() actionCompleted = new EventEmitter<void>();
  loaderService = inject(LoaderService);

    constructor(private fb: FormBuilder,private alertService: alertservice, private toastr: ToastrService,public globals: Globals) {
      const navigation = this.router.getCurrentNavigation();
      //this.policyData = navigation?.extras?.state?.['data'];
  
    }

  ngOnInit(): void {
       this.form = this.fb.group({
        // selectedAction: ['', Validators.required],
        remarks: ['', Validators.required],
      
      })
  }


SubmitAction() {
  
  debugger;

    if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.toastr.error("Please fill required fields.");
    return;
  }

  else{
    
  // Restore user mapping to get current user
  this.globals.restoreUserMappingFromSession();

  const storedUser = sessionStorage.getItem('userInfo');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;

  const alertId = this.task.id;

  if (!alertId) {
    this.toastr.error("Alert ID not found");
    return;
  }

  // --------------------------
  // 🟢 1. PREPARE ALERT UPDATE
  // --------------------------


  

  let baseAlert: any;

// Case 1: No global alert stored → use task
if (!this.globals.alert) {
  baseAlert = this.task;
}
// Case 2: Global alert exists but ID mismatch → use task
else if (this.globals.alert.id !== this.task.id) {
  baseAlert = this.task;
}
// Case 3: Global alert exists & same ID → use global
else {
  baseAlert = this.globals.alert;
}

  


  const updateAlertData = {
    id: baseAlert.id,
    lastModifierUserId: currentUserId,
    currentStatus: "ActionClosed",

    // keep all other fields same as original alert
    remarks: this.form.value.remarks,
  
    creatorUserId: baseAlert?.creatorUserId ?? baseAlert?.createruserid,
    policyName: baseAlert?.policyName,
    siteId: baseAlert?.siteId,
    policyId: baseAlert?.policyId,
    response: baseAlert?.response,
    isStatus: 4,
    filePath: baseAlert?.filePath,
    devices: baseAlert?.devices,
    alertSource: baseAlert?.alertSource,
    ticketNo: baseAlert?.ticketNo, 
    // zoneId: baseAlert?.zoneId, zoneID
    zoneId: baseAlert?.zoneId ?? baseAlert?.zoneID,
   

    creationTime:baseAlert?.creationTime,
    lastModificationTime: new Date(),
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: null
  };

  console.log("Update data final:", updateAlertData);



  // --------------------------
  // 🟢 2. PREPARE ONE LOG ENTRY
  // --------------------------
  const logEntry = {
    AlertId: alertId,
    ActionType: "ActionClosed",
    Operation: "ActionClosed",
    UserId: currentUserId,
    alertLogRemarks: this.form.value.remarks
  };

  // --------------------------
  // 🔥 STEP 1 → CREATE LOG
  // --------------------------
  this.alertService.AlertLogCreate(logEntry)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: () => {

        // --------------------------
        // 🔥 STEP 2 → UPDATE ALERT
        // --------------------------
        this.alertService.AlertUpdate(updateAlertData)
          .pipe(withLoader(this.loaderService))
          .subscribe({
            next: (res:any) => {
              this.toastr.success("Alert assigned successfully");
        const updatedAlert = res?.result;
        this.globals.saveAlert(updatedAlert);
              this.actionCompleted.emit();
              //this.dialog.closeAll();
             // this.router.navigate(['/alerts']);
            },
            error: (err) => {
              console.error("Alert update failed:", err);
              this.toastr.error("Alert updated failed");
            }
          });
      },
      error: (err) => {
        console.error("Log creation failed:", err);
        this.toastr.error("Failed to create log entry");
      }
    });
  }

}

}

