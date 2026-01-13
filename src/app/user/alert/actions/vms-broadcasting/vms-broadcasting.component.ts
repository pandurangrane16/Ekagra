import { Component,EventEmitter, Input,Output,ChangeDetectorRef,inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { CmInputComponent } from '../../../../common/cm-input/cm-input.component';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';
import { CmSelectCheckComponent } from '../../../../common/cm-select-check/cm-select-check.component';
import { FormBuilder, Validators } from '@angular/forms';
import { alertservice } from '../../../../services/admin/alert.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common/common.service';
import { Globals } from '../../../../utils/global';

import { LoaderService } from '../../../../services/common/loader.service';
import { withLoader } from '../../../../services/common/common';

@Component({
  selector: 'app-vms-broadcasting',
  imports: [MaterialModule, CommonModule, CmInputComponent, CmSelect2Component, CmSelectCheckComponent],
  templateUrl: './vms-broadcasting.component.html',
  styleUrl: './vms-broadcasting.component.css'
})
export class VmsBroadcastingComponent implements OnInit {
    @Input() task: any;
   @Output() actionCompleted = new EventEmitter<void>();
  loaderService = inject(LoaderService);
    _common = inject(CommonService);

  form: any;
  uploadedFile: any;
  _vmdSelected: any[];
  isTypeSelected: boolean = false;
  actionTypeSettings = {
    labelHeader: 'Select Type',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: [
      { name: 'SMS', value: 0 },
      { name: 'EMAIL', value: 1 },
    ]
  };
  inputFields = {
    remarks: {
      labelHeader: '',
      placeholder: 'Remarks',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    unitValue: {
      labelHeader: 'Unit Value',
      placeholder: 'Unit Value',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    }
  }
  vmdTypeSettings = {
    labelHeader: 'Select VMD',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options:{}
  };
  unitSettings = {
    labelHeader: 'Select Unit',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: [
      { name: 'Seconds', value: 0 },
      { name: 'Minutes', value: 1 },
    ]
  }
  isVmdSelected: boolean = false;
  alertService = inject(alertservice);
  toast = inject(ToastrService);
  constructor(private fb: FormBuilder,private globals:Globals,private cd: ChangeDetectorRef,private toastr: ToastrService) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      selectedAction: ['', Validators.required],
      selectedVmdAction: [],
      remarks: ['', Validators.required],
      isVerified: [false, Validators.required],
      selectedUnit: [],
      unitValue: []
    })
    this.GetVmdList();
  }
    onFileSelected(evt: any) {
    this.uploadedFile = evt;
    debugger;
  }




//  GetVmdList() {
//   const data = {
//     projectId: 2,
//     type: 0,
//     inputs: "string",
//     bodyInputs: "string",
//     seq: 4
//   };

//   this.alertService.SiteResponse(data)
//     .pipe(withLoader(this.loaderService))
//     .subscribe({
//       next: (response: any) => {
//         // Parse result safely
//         let items: any[] = [];

//         if (response?.result) {
//           try {
//             items = typeof response.result === 'string'
//               ? JSON.parse(response.result)
//               : response.result;
//           } catch (err) {
//             console.error('Error parsing result JSON:', err);
//           }
//         }

//         // Map to dropdown-compatible format
//         const projectOptions = items.map((item: any) => ({
//           name: `${item.vmsId} - ${item.description}` || item.vmsId,
//           value: item.vmsId,
     
//         }));

//         // Optional: sort or filter online devices
//         // const onlineDevices = projectOptions.filter(p => p.networkStatus === 1);

//         this.vmdTypeSettings.options = projectOptions;

//         console.log('VMD List:', this.vmdTypeSettings.options);
//         // this.isProjectOptionsLoaded = true;
//       },
//       error: (error) => {
//         console.error('Error fetching VMD list:', error);
//       }
//     });
// }


  GetVmdList() {
    this._common._sessionAPITags().subscribe((res:any) => {
      console.log(res);
      let _inputTag = res.find((x: any) => x.tag == "GetVMSDetails");
      const data = _inputTag.inputRequest;

      this.alertService.SiteResponse(JSON.parse(data))
        .pipe(withLoader(this.loaderService))
        .subscribe({
          next: (response: any) => {
            this.loaderService.showLoader();
            // Parse result safely
            let items: any[] = [];

            if (response?.result) {
              try {
                items = typeof response.result === 'string'
                  ? JSON.parse(response.result)
                  : response.result;
              } catch (err) {
                console.error('Error parsing result JSON:', err);
              }
              this.loaderService.hideLoader();
            }

            // Map to dropdown-compatible format
            const projectOptions = items.map((item: any) => ({
              name: `${item.vmsId} - ${item.description}` || item.vmsId,
              value: item.vmsId,

            }));

            // Optional: sort or filter online devices
            // const onlineDevices = projectOptions.filter(p => p.networkStatus === 1);
            console.log(this.vmdTypeSettings);
            this.vmdTypeSettings.options = projectOptions;
            this.isVmdSelected = true;
            this.cd.detectChanges();
            this.loaderService.hideLoader();
          },
          error: (error) => {
            console.error('Error fetching VMD list:', error);
          }
        });
    });
  }
    onUnitSelected(evt: any) {

  }

 
    onActionTypeSelected(evt: any) {
    this._vmdSelected = evt;
    if (evt.length == 0)
      this.isTypeSelected = false;
    else
      this.isTypeSelected = true;
  }

  getVMSList() {
    let data = {
      "projectId": 2,
      "type": 0,
      "inputs": "string",
      "bodyInputs": "string",
      "seq": 4
    }
    this.alertService.SiteResponse(data).subscribe(res => {
      if(res != undefined) {
        let deviceData = JSON.parse(res.result);
        console.log(deviceData);
      } else {
        this.toast.error("Something went wrong");
      }
    });
  }
    convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);  // Converts file to Base64 string
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
    addMinutes(seconds: number) {
    const now = new Date();
    now.setMinutes(now.getSeconds() + seconds);

    const formatted = this.formatDateTime(now);
    console.log(formatted);
    return formatted;
  }
    formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
  debugger;

  // 1️⃣ FORM VALIDATION (FIRST)
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.toastr.error("Please fill required fields.");
    return;
  }
  else{
     // 2️⃣ FILE VALIDATION (SECOND)
  if (!this.uploadedFile) {
    this.toastr.error("Please upload an attachment.");
    return;
  }
  else{
      // 3️⃣ SITE RESPONSE API (THIRD)
  this._common._sessionAPITags().subscribe(res => {
    let _inputTag = res.find((x: any) => x.tag == "VMSCommandPublish");
    let _inputRequest = JSON.parse(JSON.parse(_inputTag.inputRequest).bodyInputs);
    console.log(_inputRequest);

    let _input = _inputRequest[0];
    let _request: any[] = [];

    this.convertToBase64(this.uploadedFile.target.files[0]).then((base64: string) => {
      let base64String = base64;
      console.log(_input);

      let duration = Number(this.form.controls["unitValue"].value);
      let _durSec = this.form.controls["selectedUnit"].value.name.toLocaleLowerCase() == "minutes"
        ? duration * 60
        : duration;

      var _count = 0;

      this._vmdSelected.forEach((element: any) => {
        _input.vmsid = element;
        _input.publishType = "image";
        _input.textContent = base64String;
        _input.fromTime = this.addMinutes(60);
        _input.toTime = this.addMinutes(_durSec);

        _inputTag.inputRequest = JSON.stringify(_input);

        this.alertService.SiteResponse(_inputTag)
          .pipe(withLoader(this.loaderService))
          .subscribe({
            next: (response: any) => {
              _count = _count + 1;

              if (_count == this._vmdSelected.length) {

                if (response.success == true)
                  {
                     this.toast.success("Request submitted successfully." + "\n" + response.result);
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
                 const logEntry = {
    AlertId: alertId,
    ActionType: "VMSEmergencyPublish",
    Operation: "VMSEmergencyPublish",
    UserId: currentUserId,
  };

  // --------------------------
  // 🔥 STEP 1 → CREATE LOG
  // --------------------------
  this.alertService.AlertLogCreate(logEntry)
    .pipe(withLoader(this.loaderService))
    .subscribe({
        next: (res: any) => {
                      this.toastr.success("Alert log submitted successfully!");
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
  const updatePayload = {
    id: baseAlert?.id,
    currentStatus: "VMSEmergencyPublish",   
    lastModifierUserId: this.globals?.user?.id,
    remarks:baseAlert?.remarks,
    creatorUserId: baseAlert?.creatorUserId ?? baseAlert?.createruserid,
    policyName: baseAlert?.policyName,
    siteId: baseAlert?.siteId,
    policyId: baseAlert?.policyId,
    response:baseAlert?.response,
    isStatus:baseAlert?.isStatus,
    filePath: baseAlert?.filePath,
    devices: baseAlert?.devices,
    alertSource:baseAlert?.alertSource,
    ticketNo: baseAlert?.ticketNo,
     zoneId: baseAlert?.zoneId ?? baseAlert?.zoneID,

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
                      this.actionCompleted.emit();
                    },
      error: (err) => {
        console.error("Log creation failed:", err);
        this.toastr.error("Failed to create log entry");
      }
    });
               

              
                  }
                 
                else {
                  console.log(response);
                  this.toast.error("An error occurred." + "\n" + response.result);
                }

              }
            },
            error: (error) => {
              console.error('Error fetching VMD list:', error);
              this.toastr.error("Failed to send VMS request.");
            }
          });
      });
    });
  });
  }



  }

 

}

  CancelAction() { }
}
