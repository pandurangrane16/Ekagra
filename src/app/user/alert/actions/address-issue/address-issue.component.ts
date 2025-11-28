import { CommonModule } from '@angular/common';
import { Component,Output, inject,Input,EventEmitter, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { ToastrService } from 'ngx-toastr';
import { alertservice } from '../../../../services/admin/alert.service';
import { Globals } from '../../../../utils/global';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';

@Component({
  selector: 'app-address-issue',
  imports: [CommonModule, MaterialModule,CmTextareaComponent],
  templateUrl: './address-issue.component.html',
  styleUrl: './address-issue.component.css'
})
export class AddressIssueComponent implements OnInit {
  @Input() task: any;
   @Output() actionCompleted = new EventEmitter<void>();
 loaderService = inject(LoaderService);
  isTypeSelected: boolean = false;
  selectedFile: File | null = null;
  form: any;
  roleActions:any;
  sopActions:any;
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
  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private alertService: alertservice, private toastr: ToastrService,
    public globals: Globals) { }
  async ngOnInit() {
    if (this.task != null && this.task != undefined) {
      this.isTypeSelected = true;
      this.form = this.fb.group({
        // selectedAction: ['', Validators.required],
        remarks: ['', Validators.required],
        isVerified: [false, Validators.required],
      })
    }

  await this.loadSopActions(this.task.id);
await this.loadRoleActions(Number(this.globals?.user?.id));
  }

  onFileChange(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
    console.log("Selected File:", this.selectedFile);
  }
}




async handleCase2_AutoCreatePendingActions() {



  // 1️⃣ Find "Address the Incident" sequence using prmValue
  const currentSeq = this.sopActions.find(
    (x: any) => x.prmValue?.toLowerCase() === 'addressincident'
  )?.sequence || 0;

  console.log("Current Seq (AddressIncident):", currentSeq);

  // 2️⃣ All remaining actions AFTER AddressIncident
  const remainingActions = this.sopActions.filter((x: any) => x.sequence > currentSeq);

  console.log("Remaining Actions:", remainingActions);

  // 3️⃣ Validate permissions → roleActions contains lowercase action names
  const canAutoComplete = remainingActions.every((a: any) =>
    this.roleActions.includes(a.prmValue.toLowerCase())
  );

 

 if (!canAutoComplete) {

  console.warn("Some actions are not allowed — processing allowed ones only.");

  // 1️⃣ Identify allowed & skipped actions
  const allowedActions = remainingActions.filter((a: any) =>
    this.roleActions.includes(a.prmValue.toLowerCase())
  );

  const skippedActions = remainingActions.filter((a: any) =>
    !this.roleActions.includes(a.prmValue.toLowerCase())
  );

  console.log("Allowed Actions:", allowedActions);
  console.log("Skipped Actions:", skippedActions);

  // 2️⃣ Create LOG entries + UPDATE alert table for ALL allowed actions
  for (let act of allowedActions) {

    // ------- CREATE ALERT LOG ENTRY -------
    const payload = {
      actionType: act.prmValue,
      operation: act.prmValue,
      alertId: this.task?.id || 0,
      userId: Number(this.globals?.user?.id),
      remarks: `Auto-entry: ${act.rfu1}`,
      status: 0,
      isDeleted: false
    };

    console.log("Creating log entry (partial auto):", payload);

    await new Promise(resolve => {
      this.alertService.AlertLogCreate(payload)
        .pipe(withLoader(this.loaderService))
        .subscribe({
          next: () => resolve(true),
          error: () => resolve(false)
        });
    });


    // ------- UPDATE ALERT TABLE FOR THIS ACTION -------
      let baseAlert = this.globals.alert;
    const updatePayload = {
      id: baseAlert?.id,
      currentStatus: act.prmValue,
      lastModifiedUserId: Number(this.globals?.user?.id),

      remarks: baseAlert?.remarks,
      creatorUserId: baseAlert?.createruserid,
      policyName: baseAlert?.policyName,
      siteId: baseAlert?.siteId,
      policyId: baseAlert?.policyId,
      response: baseAlert?.response,
      isStatus:baseAlert?.isStatus,
      filePath: baseAlert?.filePath,
      devices: baseAlert?.devices,
      alertSource: baseAlert?.alertSource,
      ticketNo: baseAlert?.ticketNo,
      zoneId: baseAlert?.zoneID,
      creationTime: baseAlert?.creationTime,
      lastModificationTime: new Date(),
      isDeleted: false,
      deleterUserId: 0,
      deletionTime: null
    };

    console.log("Updating alert table (partial auto):", updatePayload);

    await new Promise(resolve => {
      this.alertService.AlertUpdate(updatePayload)
        .pipe(withLoader(this.loaderService))
        .subscribe({
             next: (res: any) => {
        const updatedAlert = res?.result;
        this.globals.saveAlert(updatedAlert);  // ← store in globals
        resolve(true);
      },
          
          error: () => resolve(false)
        });
    });
  }

  this.toastr.success("Allowed actions auto-created and updated. Some actions were skipped.");
  this.actionCompleted.emit();
  return; 
}


else {

  // 4️⃣ Auto-create alert log entries for each remaining action (JSON body, NOT FormData)
  for (let act of remainingActions) {

    const payload = {
      actionType: act.prmValue,
      operation: act.prmValue,
      alertId: this.task?.id || 0,
      userId: Number(this.globals?.user?.id),
      remarks: `Auto-completed: ${act.rfu1}`,
      status: 0,            // completed
      isDeleted: false
    };

    console.log("Auto-creating entry (JSON):", payload);

    await new Promise(resolve => {
      this.alertService.AlertLogCreate(payload)   
        .pipe(withLoader(this.loaderService))
        .subscribe({
          next: () => resolve(true),
          error: () => resolve(false),
        });
    });
  }

  // 5️⃣ UPDATE ALERT TABLE with FINAL action
  const lastAction = remainingActions[remainingActions.length - 1];

    let baseAlert = this.globals.alert;

  const updatePayload = {
    id:baseAlert?.id,
    currentStatus: lastAction.prmValue,
    lastModifiedUserId: Number(this.globals?.user?.id),
   


    remarks:baseAlert?.remarks,
    creatorUserId: baseAlert?.createruserid,
    policyName: baseAlert?.policyName,
    siteId: baseAlert?.siteId,
    policyId:baseAlert?.policyId,
    response: baseAlert?.response,
    isStatus:4,
    filePath: baseAlert?.filePath,
    devices: baseAlert?.devices,
    alertSource: baseAlert?.alertSource,
    ticketNo:baseAlert?.ticketNo,
    zoneId: baseAlert?.zoneID,

    creationTime:baseAlert?.creationTime,
    lastModificationTime: new Date(),
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: null


  };

  console.log("Updating alert table with:", updatePayload);

  await new Promise(resolve => {
    this.alertService.AlertUpdate(updatePayload)
      .pipe(withLoader(this.loaderService))
      .subscribe({
           next: (res: any) => {
        const updatedAlert = res?.result;
        this.globals.saveAlert(updatedAlert);  // ← store in globals
        resolve(true);
      },
        error: () => resolve(false)
      });
  });

  this.toastr.success("All remaining actions auto-completed successfully (Case 2)");
  this.actionCompleted.emit();
}



}


loadRoleActions(userId: number): Promise<void> {
  return new Promise((resolve) => {
    this.alertService.GetRoleActionMappingById(userId)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (res: any) => {

          const items = res?.result || [];

          if (Array.isArray(items) && items.length > 0) {

            let allActions: string[] = [];

            items.forEach(item => {
              if (item.actionNames) {
                let actions = item.actionNames
                  .split(',')
                  .map((a: any) => a.trim().toLowerCase());

                allActions.push(...actions);
              }
            });

            // remove duplicates
            this.roleActions = [...new Set(allActions)];

            console.log("🔵 Role Actions Loaded:", this.roleActions);
          } else {
            this.roleActions = [];
            console.warn("⚠ No role actions found for user");
          }

          resolve(); // ✅ Resolve even when no actions found
        },

        error: (err: any) => {
          console.error("❌ Failed to load role action mapping:", err);
          this.roleActions = [];
          resolve(); // ❗ Still resolve on error (to avoid hanging await)
        }
      });
  });
}

loadSopActions(policyId: number): Promise<void> {
  return new Promise((resolve) => {
    this.alertService.getSopActionByAlert(policyId)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (res: any) => {
          this.sopActions = res?.result?.result?.actions || [];
          console.log("SOP Actions Loaded:", this.sopActions);
          resolve(); // ✅ VERY important
        },
        error: (err: any) => {
          console.error("Failed to load SOP actions", err);
          this.sopActions = [];
          resolve(); // resolve even on error
        }
      });
  });
}

updateAlertStatusAfterSubmit() {
   let baseAlert = this.globals.alert;
  const updatePayload = {
    id: baseAlert?.id,
    currentStatus: "AddressIncident",   
    lastModifiedUserId: this.globals?.user?.id,
    remarks:baseAlert?.remarks,
    creatorUserId: baseAlert?.createruserid,
    policyName: baseAlert?.policyName,
    siteId: baseAlert?.siteId,
    policyId: baseAlert?.policyId,
    response:baseAlert?.response,
    isStatus:baseAlert?.isStatus,
    filePath: baseAlert?.filePath,
    devices: baseAlert?.devices,
    alertSource:baseAlert?.alertSource,
    ticketNo: baseAlert?.ticketNo,
    zoneId: baseAlert?.zoneID,

    creationTime:baseAlert?.creationTime,
    lastModificationTime: new Date(),
    isDeleted: false,
    deleterUserId: 0,
    deletionTime: null
  };

  console.log("Updating alert status:", updatePayload);

  this.alertService.AlertUpdate(updatePayload)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (res: any) => {
                const updatedAlert = res?.result;
        this.globals.saveAlert(updatedAlert);
        this.toastr.success("Alert status updated.");
        this.actionCompleted.emit();
      },
      error: (err: any) => {
        console.error("Failed to update status", err);
        this.toastr.error("Could not update alert status.");
      }
    });
}


 SubmitAction() {

  debugger;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.toastr.error("Please fill required fields.");
    return;
  }

  else{
    if (!this.selectedFile) {
    this.toastr.error("Please upload an attachment.");
    return;
  }
  else{
    const formData = new FormData();

  // 🔹 Your form fields
  formData.append('Alert.AlertLogRemarks', this.form.value.remarks);


  // 🔹 Task fields (coming from SOP actions)
  formData.append('Alert.ActionType',"AddressIncident");
  formData.append('Alert.Operation', "AddressIncident");
  formData.append('Alert.AlertId', (this.task?.id || 0).toString());
  formData.append('Alert.Id', '0'); 
   formData.append('Alert.Status', '0'); 


  formData.append('Alert.UserId', this.globals?.user?.id?.toString() || '0');
  formData.append('Alert.IsDeleted', 'false');


  formData.append('Files', this.selectedFile);

 console.log("Payload FormData:", formData);


  this.alertService.CreateAlertlogWithFileUpload(formData)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (res: any) => {
        this.toastr.success("Alert log submitted successfully!");
      if (!this.form.value.isVerified) {
        debugger;
        this.updateAlertStatusAfterSubmit();
      } else {
        debugger;
      this.handleCase2_AutoCreatePendingActions();
      }
       
      },
      error: (err: any) => {
        console.error("❌ Failed to submit", err);
        this.toastr.error("Failed to submit alert log.");
      }
    });
  }

  
  }
}

  CancelAction() {}
}
