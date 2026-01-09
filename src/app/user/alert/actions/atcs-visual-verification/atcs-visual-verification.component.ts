
import { Component,Output, EventEmitter,inject,Input,OnInit } from '@angular/core';
import { MaterialModule} from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../services/common/common.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../../../services/common/loader.service';
import { withLoader } from '../../../../services/common/common';
import { PaDashboardService } from '../../../../services/Pa/pa_dashboard.service';
import { Globals } from '../../../../utils/global';
import { SessionService } from '../../../../services/common/session.service';


import { ToastrService } from 'ngx-toastr'; 
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';

@Component({
  selector: 'app-atcs-visual-verification',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, CmSelect2Component],
  templateUrl: './atcs-visual-verification.component.html',
  styleUrl: './atcs-visual-verification.component.css'
})
export class AtcsVisualVerificationComponent implements OnInit {
  form: any;
    loaderService = inject(LoaderService);
    _common = inject(CommonService);
    @Input() task: any;
    @Output() actionCompleted = new EventEmitter<void>();
  isApiLoaded: boolean = false;
  isAudioLoaded: boolean = false;
    isJunctionLoaded: boolean = false;
  audioSettings: any;
  junctionSettings: any;
  requestTypeSettings = {
    labelHeader: 'Request Type',
    formFieldClass: 'cm-square-input',
    placeholder: 'Request Type',
    appearance: 'outline',
    isDisabled: true
  };
  inputFields = {
    requestBodySettings: {
      labelHeader: 'Request Body',
      placeholder: 'Request Body(Request Type is Query String, placed values in comma separated.)',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    },
    responseBodySettings: {
      labelHeader: 'Response Body',
      placeholder: 'Response Body',
      appearance: 'outline',
      isDisabled: true,
      color: 'primary',
      formFieldClass: "w-100"
    }
  }
  constructor(private fb: FormBuilder, private Service: PaDashboardService,private toast: ToastrService,private globals: Globals,private session: SessionService) {
    this.audioSettings = {
      labelHeader: 'Select Audio',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: [],
    };

    this.junctionSettings = {
      labelHeader: 'Select Junction',
      lableClass: 'form-label',
      formFieldClass: '',
      appearance: 'fill',
      options: [],
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      audioId: ['', Validators.required],
      junctionId: ['', Validators.required],
    })

        const projectCodesStr = this.session._getSessionValue("projectCodes");
    const projectCodes = projectCodesStr ? JSON.parse(projectCodesStr) : [];
    const currentProject = "vms";

    const project = projectCodes.find(
      (p: any) => p.name.toLowerCase() === currentProject.toLowerCase()
    );

    if (!project) {
      console.error(`⚠️ Project "${currentProject}" not found in config.`);
      return;
    }

    const projectId = Number(project.value);
  }
  onManagerSelected(evt: any) { }

GetJunctionNames(){
             this.Service.GetNearbySites("Sample_001",500,3)
                .pipe(withLoader(this.loaderService))
                .subscribe({
                  next: (response: any) => {
if (response?.result) {
  const siteList = response.result; // directly use result array

  this.junctionSettings.options = siteList.map((site: any) => ({
    name: site.siteName,   // what user sees
    value: site.siteId     // value to send to server
  }));

  this.isJunctionLoaded = true;
  console.log("Dropdown Options:", this.audioSettings.options);
}
                  },
                  error: (error) => {
                    console.error('Error fetching Audio Files:', error);
                  }
                });
}
  

  GetAudio() {
    debugger;
       this._common._sessionAPITags().subscribe((res:any) => {
          let _inputTag = res.find((x: any) => x.tag == "GetAudioFiles");
          let requestBody = JSON.parse(_inputTag.inputRequest);
          // let _inputRequest = JSON.parse(JSON.parse(_inputTag.inputRequest).bodyInputs);
          // console.log(_inputRequest);
          // let _input = _inputRequest[0];
          // let _request: any[] = [];
           this.Service.SiteResponse(requestBody)
                .pipe(withLoader(this.loaderService))
                .subscribe({
                  next: (response: any) => {
                   if (response?.result) {
    const parsed = JSON.parse(response.result);
    const audioNames: string[] = parsed.data || [];

    this.audioSettings.options = audioNames.map(name => ({
     name: name,
      value: name
     
    }));
   this.isAudioLoaded = true;
   this.GetJunctionNames();
    console.log("Dropdown Options:", this.audioSettings.options);
  }
                  },
                  error: (error) => {
                    console.error('Error fetching Audio Files:', error);
                  }
                });
        })
   }

   SubmitAction() {

    if(this.form.invalid){
      this.toast.error("Please select Audio and Junction");
      return;
    }
    else{
          this._common._sessionAPITags().subscribe((res:any) => {
        let _inputTag = res.find((x: any) => x.tag == "Announce");
let requestBody = JSON.parse(_inputTag.inputRequest);

const audioId = this.form.get('audioId')?.value.name;
const junctionId = this.form.get('junctionId')?.value.name;

// 👈 Convert to comma-separated format
requestBody.inputs = `${audioId},${junctionId}`;

console.log("Updated Request:", requestBody);
           this.Service.SiteResponse(requestBody)
                .pipe(withLoader(this.loaderService))
                .subscribe({
                  next: (response: any) => {
                   if (response?.result) {

                    const fullResult = JSON.parse(response.result);

                      this.globals.restoreUserMappingFromSession();

  const storedUser = sessionStorage.getItem('userInfo');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;

  const alertId = this.task.id;

  // if (!alertId) {
  //   this.toast.error("Alert ID not found");
  //   return;
  // }

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
    currentStatus: "PABroadcasting",

    // keep all other fields same as original alert
    remarks: fullResult,
  
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
    ActionType: "PABroadcasting",
    Operation: "PABroadcasting",
    UserId: currentUserId,
    alertLogRemarks: `PA Announced with Audio: ${audioId} at Junction: ${junctionId} and response: ${fullResult}`
  };

  // --------------------------
  // 🔥 STEP 1 → CREATE LOG
  // --------------------------
  this.Service.AlertLogCreate(logEntry)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: () => {

        // --------------------------
        // 🔥 STEP 2 → UPDATE ALERT
        // --------------------------
        this.Service.AlertUpdate(updateAlertData)
          .pipe(withLoader(this.loaderService))
          .subscribe({
            next: (res:any) => {
              this.toast.success("Alert assigned successfully");
        const updatedAlert = res?.result;
        this.globals.saveAlert(updatedAlert);
              this.actionCompleted.emit();
              //this.dialog.closeAll();
             // this.router.navigate(['/alerts']);
            },
            error: (err) => {
              console.error("Alert update failed:", err);
              this.toast.error("Alert updated failed");
            }
          });
      },
      error: (err) => {
        console.error("Log creation failed:", err);
        this.toast.error("Failed to create log entry");
      }
    });
  
  

  }
                  },
                  error: (error) => {
                    console.error('Error in Public Annoucement', error);
                    this.toast.error('Error in Public Annoucement',error)
                  }
                });
        })
    }
        
     
   }
}
