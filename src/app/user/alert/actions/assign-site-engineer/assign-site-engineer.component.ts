import { CommonModule,} from '@angular/common';
import { Component,Output,EventEmitter,inject, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { Globals } from '../../../../utils/global';
import { ToastrService } from 'ngx-toastr';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { Router } from '@angular/router';
import { alertservice } from '../../../../services/admin/alert.service';
@Component({
  selector: 'app-assign-site-engineer',
  imports: [CommonModule,MaterialModule],
  templateUrl: './assign-site-engineer.component.html',
  styleUrl: './assign-site-engineer.component.css'
})
export class AssignSiteEngineerComponent implements OnInit {
  router = inject(Router);
  @Input() task : any;
 @Output() actionCompleted = new EventEmitter<void>();
  loaderService = inject(LoaderService);

    constructor(private alertService: alertservice, private toastr: ToastrService,public globals: Globals) {
      const navigation = this.router.getCurrentNavigation();
      //this.policyData = navigation?.extras?.state?.['data'];
  
    }

  ngOnInit(): void {
    
  }


SubmitAction() {
  
  debugger;

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
    currentStatus: "AssignToFieldEngineer",

    // keep all other fields same as original alert
    remarks: baseAlert?.remarks,
  
    creatorUserId: baseAlert?.creatorUserId ?? baseAlert?.createruserid,
    policyName: baseAlert?.policyName,
    siteId: baseAlert?.siteId,
    policyId: baseAlert?.policyId,
    response: baseAlert?.response,
    isStatus: baseAlert?.isStatus,
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
    ActionType: "AssignToFieldEngineer",
    Operation: "AssignToFieldEngineer",
    UserId: currentUserId,
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
