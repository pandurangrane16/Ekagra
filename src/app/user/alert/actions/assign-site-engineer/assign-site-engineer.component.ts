import { CommonModule} from '@angular/common';
import { Component,inject, Input, OnInit } from '@angular/core';
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
  const updateAlertData = {
    id: alertId,
    lastModifierUserId: currentUserId,
    currentStatus: "AssignToFieldEngineer",

    // keep all other fields same as original alert
    remarks: this.task?.remarks,
    creatorUserId: this.task?.createruserid,
    policyName: this.task?.policyName,
    siteId: this.task?.siteId,
    policyId: this.task?.policyId,
    response: this.task?.response,
    isStatus: this.task?.isStatus,
    filePath: this.task?.filePath,
    devices: this.task?.devices,
    alertSource: this.task?.alertSource,
    ticketNo: this.task?.ticketNo,
    zoneId: this.task?.zoneID,

    creationTime:this.task?.creationTime,
    lastModificationTime: new Date(),
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: null
  };

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
            next: () => {
              this.toastr.success("Alert assigned successfully");
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
