
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
  selector: 'app-flashmode',
  imports: [CommonModule,MaterialModule],
  templateUrl: './flashmode.component.html',
  styleUrl: './flashmode.component.css'
})
export class FlashmodeComponent implements OnInit {
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

  this.globals.restoreUserMappingFromSession();
  const storedUser = sessionStorage.getItem('userInfo');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;
  const alertId = this.task.id;

  if (!alertId) {
    this.toastr.error("Alert ID not found");
    return;
  }

  let baseAlert = this.globals.alert;

  const updateAlertData = {
    id: baseAlert.id,
    lastModifierUserId: currentUserId,
    currentStatus: "FlashMode",
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
    creationTime: baseAlert?.creationTime,
    lastModificationTime: new Date(),
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: null
  };

  const logEntry = {
    AlertId: alertId,
    ActionType: "FlashMode",
    Operation: "FlashMode",
    UserId: currentUserId,
  };


  const requestBody = {
    projectId: 3,
    type: 1,
    inputs:"",
    bodyInputs: "",
    seq: 8
  };

  this.alertService.SiteResponse(requestBody)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: () => {

     
        this.alertService.AlertLogCreate(logEntry)
          .pipe(withLoader(this.loaderService))
          .subscribe({
            next: () => {

             
              this.alertService.AlertUpdate(updateAlertData)
                .pipe(withLoader(this.loaderService))
                .subscribe({
                  next: (res: any) => {
                    this.toastr.success("Alert updated to Flash Mode successfully");
                    const updatedAlert = res?.result;
                    this.globals.saveAlert(updatedAlert);

                    this.actionCompleted.emit();
                  },
                  error: (err) => {
                    console.error("Alert update failed:", err);
                    this.toastr.error("Alert update failed");
                  }
                });

            },
            error: (err) => {
              console.error("Log creation failed:", err);
              this.toastr.error("Failed to create log entry");
            }
          });

      },
      error: (err) => {
        console.error("SiteResponse failed:", err);
        this.toastr.error("Failed to execute Flash Mode action");
      }
    });
}


}

