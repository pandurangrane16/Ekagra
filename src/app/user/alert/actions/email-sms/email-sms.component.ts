


import { CommonModule,} from '@angular/common';
import { Component,Output,EventEmitter,inject, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { Globals } from '../../../../utils/global';
import { ToastrService } from 'ngx-toastr';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { Router } from '@angular/router';
import { alertservice } from '../../../../services/admin/alert.service';
import { SmsActionComponent } from '../sms-action/sms-action.component';
import { EmailActionComponent } from '../email-action/email-action.component';
@Component({
  selector: 'app-email-sms',
  imports: [CommonModule,MaterialModule,EmailActionComponent,SmsActionComponent],
  templateUrl: './email-sms.component.html',
  styleUrl: './email-sms.component.css'
})
export class EmailSMSComponent implements OnInit {
  router = inject(Router);
    selectedAction: string | null = null;
  @Input() task : any;
 @Output() actionCompleted = new EventEmitter<void>();
  loaderService = inject(LoaderService);

    constructor(private alertService: alertservice, private toastr: ToastrService,public globals: Globals) {
      const navigation = this.router.getCurrentNavigation();
      //this.policyData = navigation?.extras?.state?.['data'];
  
    }

  
  data :any;

ngOnInit(): void {
    this.data = {
      userName : "Sujitㅤ♡ㅤShrutika"
    }
  }

onActionSelect() {
  console.log("Selected Action =>", this.selectedAction);
  // You can add more logic if needed when switching action types
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


  let baseAlert = this.globals.alert;


  const updateAlertData = {
    id: baseAlert.id,
    lastModifierUserId: currentUserId,
    currentStatus: "AssignToFieldEngineer",

    // keep all other fields same as original alert
    remarks: baseAlert?.remarks,
    creatorUserId: baseAlert?.creatorUserId,
    policyName: baseAlert?.policyName,
    siteId: baseAlert?.siteId,
    policyId: baseAlert?.policyId,
    response: baseAlert?.response,
    isStatus: baseAlert?.isStatus,
    filePath: baseAlert?.filePath,
    devices: baseAlert?.devices,
    alertSource: baseAlert?.alertSource,
    ticketNo: baseAlert?.ticketNo,
    zoneId: baseAlert?.zoneId,

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

