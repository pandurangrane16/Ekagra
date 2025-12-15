import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VmsBroadcastingComponent } from '../../user/alert/actions/vms-broadcasting/vms-broadcasting.component';
import { SmsActionComponent } from '../../user/alert/actions/sms-action/sms-action.component';
import { EmailActionComponent } from '../../user/alert/actions/email-action/email-action.component';
import { ApiActionComponent } from '../../user/alert/actions/api-action/api-action.component';
import { PaActionComponent } from "../../user/alert/actions/pa-action/pa-action.component";
import { VmsDeviceFailureComponent } from "../../user/alert/actions/vms-device-failure/vms-device-failure.component";
import { VmsEmergencyPlayComponent } from "../../user/alert/actions/vms-emergency-play/vms-emergency-play.component";
import { AtcsHealthComponent } from "../../user/alert/actions/atcs-health/atcs-health.component";
import { AtcsCongestionComponent } from "../../user/alert/actions/atcs-congestion/atcs-congestion.component";
import { AtcsLampFailureComponent } from "../../user/alert/actions/atcs-lamp-failure/atcs-lamp-failure.component";
import { AtcsDetectorFailureComponent } from "../../user/alert/actions/atcs-detector-failure/atcs-detector-failure.component";
import { ItmsCameraFailureComponent } from "../../user/alert/actions/itms-camera-failure/itms-camera-failure.component";
import { ItmsLpuFailureComponent } from "../../user/alert/actions/itms-lpu-failure/itms-lpu-failure.component";
import { ItmsChallanCollectionComponent } from "../../user/alert/actions/itms-challan-collection/itms-challan-collection.component";
import { EnvSensorFailureComponent } from "../../user/alert/actions/env-sensor-failure/env-sensor-failure.component";
import { EnvSensorPollutionComponent } from "../../user/alert/actions/env-sensor-pollution/env-sensor-pollution.component";
import { Router } from '@angular/router';
import { EmailSMSComponent } from '../../user/alert/actions/email-sms/email-sms.component';

import { alertservice } from '../../services/admin/alert.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../utils/global';
import { ActionClosedComponent } from '../../user/alert/actions/action-closed/action-closed.component';
import { LoaderService } from '../../services/common/loader.service';
import { withLoader } from '../../services/common/common';
import { FlashmodeComponent } from '../../user/alert/actions/flashmode/flashmode.component';
import { IccOperatorAckComponent } from "../../user/alert/actions/icc-operator-ack/icc-operator-ack.component";
import { AssignSiteEngineerComponent } from '../../user/alert/actions/assign-site-engineer/assign-site-engineer.component';
import { AddressIssueComponent } from "../../user/alert/actions/address-issue/address-issue.component";
import { TaskCompletionComponent } from "../../user/alert/actions/task-completion/task-completion.component";
interface SopActivity {
  id: string;
  useCase: string;
  activity: string;
  duration: string;
  type: string;
  action: string;
  sequence: number;
  hasAccess: boolean;
  status: boolean;
}

interface Sop {
  frsId: string;
  title: string;
  system: string;
  status: boolean;
  activities: SopActivity[];
}

@Component({
  selector: 'app-sopflow',
  imports: [MaterialModule,ActionClosedComponent, CommonModule, EmailSMSComponent,ReactiveFormsModule, SmsActionComponent, EmailActionComponent, ApiActionComponent, PaActionComponent, VmsDeviceFailureComponent, VmsEmergencyPlayComponent, AtcsHealthComponent, AtcsCongestionComponent, AtcsLampFailureComponent, AtcsDetectorFailureComponent, ItmsCameraFailureComponent, ItmsLpuFailureComponent,
    ItmsChallanCollectionComponent,VmsBroadcastingComponent, FlashmodeComponent,EnvSensorFailureComponent, EnvSensorPollutionComponent, IccOperatorAckComponent, AssignSiteEngineerComponent,
    AddressIssueComponent, TaskCompletionComponent],
  templateUrl: './sopflow.component.html',
  styleUrl: './sopflow.component.css'
})
export class SopflowComponent implements OnInit {
  router = inject(Router);
   loaderService = inject(LoaderService);
   currentAlertStatus: string = '';
  sops: Sop[] = [
    {
      frsId: 'SOP_VMS_001',
      title: 'DEVICE FAILURE DETECTION',
      system: 'VMS',
      status: false,
      activities: [
        // { id: 'ACT-001', useCase: 'SMS Management', activity: 'If EMS/NMS finds device unhealthy...', duration: 'Instant', type: 'Auto',action : "sms" },
        // { id: 'ACT-002', useCase: 'Email Management', activity: 'Incident created automatically', duration: 'Instant', type: 'Auto',action : "email" },
        // { id: 'ACT-003', useCase: 'API Management', activity: 'Operator verifies incident', duration: '1-2 mins', type: 'Auto',action : "api" },
        // { id: 'ACT-004', useCase: 'PA Management', activity: 'Public Announcement', duration: 'Instant', type: 'Auto',action : "pa" },
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'VMS Device Failure', duration: 'Instant', type: 'Auto', action: "vmsdevicefailure", sequence: 0, hasAccess: true, status: false },
        { id: 'ACT-002', useCase: 'Fixed the problem', activity: 'VMS Device Failure', duration: 'Instant', type: 'Auto', action: "vmsdevicefailure", sequence: 1, hasAccess: true, status: false },
        // { id: 'ACT-003', useCase: 'Close the activity', activity: 'VMS Device Failure', duration: 'Instant', type: 'Auto',action : "vmsdevicefailure",sequence : 2,hasAccess : true },
      ]
    },
    {
      frsId: 'SOP_VMS_002',
      title: 'VMD EMERGENCY MESSAGE PUBLISH',
      system: 'VMS',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'VMD Emergency Message Publish', duration: 'Instant', type: 'Auto', action: "vmsemergency", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Publish Emergency Message', activity: 'VMD Emergency Message Publish', duration: 'Instant', type: 'Auto', action: "vmsemergency", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'VMD Emergency Message Publish', duration: 'Instant', type: 'Auto', action: "vmsemergency", sequence: 2, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ATCS_001',
      title: 'ATCS CONTROLLER HEALTH',
      system: 'ATCS',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "atcshealth", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "atcshealth", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "atcshealth", sequence: 2, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ATCS_002',
      title: 'ATCS CONGESTION',
      system: 'ATCS',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Visual Verification', activity: 'Conduct visual verification by opening camera', duration: 'Instant', type: 'Auto', action: "atcscongestion", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "atcscongestion", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "atcscongestion", sequence: 2, hasAccess: true, status: true },
        { id: 'ACT-004', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "atcscongestion", sequence: 3, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ATCS_003',
      title: 'ATCS LAMP FAILURE',
      system: 'ATCS',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "atcslampfailure", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "atcslampfailure", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "atcslampfailure", sequence: 2, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ATCS_004',
      title: 'ATCS DETECTOR FAILURE',
      system: 'ATCS',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "atcsdetectorfailure", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "atcsdetectorfailure", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "atcsdetectorfailure", sequence: 2, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ITMS_001',
      title: 'ITMS CAMERA FAILURE',
      system: 'ITMS',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "itmscamerafailure", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "itmscamerafailure", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "itmscamerafailure", sequence: 2, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ITMS_002',
      title: 'ITMS LPU FAILURE',
      system: 'ITMS',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "itmslpufailure", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "itmslpufailure", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "itmslpufailure", sequence: 2, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ITMS_003',
      title: 'ITMS CHALLAN COLLECTION',
      system: 'ITMS',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "itmschallancollection", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "itmschallancollection", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "itmschallancollection", sequence: 2, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ENV_001',
      title: 'ENVIRONMENT SENSOR FAILURE',
      system: 'ENV',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "envsensorfailure", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "envsensorfailure", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "envsensorfailure", sequence: 2, hasAccess: true, status: true },
      ]
    },
    {
      frsId: 'SOP_ENV_002',
      title: 'ENVIRONMENT SENSOR POLLUTION',
      system: 'ENV',
      status: true,
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "envsensorpollution", sequence: 0, hasAccess: true, status: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "envsensorpollution", sequence: 1, hasAccess: true, status: true },
        { id: 'ACT-003', useCase: 'Publish Message on VMD\'s', activity: 'Publish environment message on vmd', duration: 'Instant', type: 'Auto', action: "envsensorpollution", sequence: 2, hasAccess: true, status: true },
      ]
    }
  ];

  policyData: any;
  creatorUserId:any;
  creatorUserName:any;
  Acknowledgedname:any;
  roleActions:any;
  Acknowledgedname_Field:any;

   

  constructor(private alertService: alertservice, private toastr: ToastrService,public globals: Globals) {
    const navigation = this.router.getCurrentNavigation();
    this.policyData = navigation?.extras?.state?.['data'];

  }
  async ngOnInit() {

debugger;
    const storedUser = sessionStorage.getItem('userInfo');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;

   await this.loadAlertCurrentStatus(this.policyData.id);
await this.loadSopActions(this.policyData.id);
  await this.loadRoleActions(currentUserId);
   await  this.loadAlertHistory(this.policyData.id);

        if (!this.globals.user) {
      const storedUser = sessionStorage.getItem('userInfo');
      if (storedUser) {
        this.globals.user = JSON.parse(storedUser);
     
        
        console.log('✅ User restored from sessionStorage:', this.globals.user);
      } else {
        console.warn('⚠️ No user info found in sessionStorage.');
      }
    }


this.globals.restoreUserMappingFromSession();
debugger;
const mapping = this.globals.userMapping;

if (!mapping) {
  this.toastr.error("User category not found. Please re-login.");
  return;
}
  

  if (!this.policyData) {
    this.router.navigate(['/alerts']);
    return;
  }

  // ⬇️ FETCH creator user ID FROM CLICKED ROW



const userCategory = mapping.category?.toLowerCase() || '';
 
  const creatorUserId = this.policyData.createruserid;
const creatorUserName = this.policyData.userName || "N/A";

this.creatorUserId = creatorUserId;
this.creatorUserName = creatorUserName;

  console.log("Creator User ID:", creatorUserId);
   console.log("User Category:", userCategory);
debugger;
if (
  userCategory === 'iccc' && 
  (creatorUserId === null || creatorUserId === undefined || creatorUserId === 0)
) {
  console.warn("CASE 1 triggered → creatorUserId is null/undefined/0");
  this.insertInitialAlertEntries();
}

if (
  userCategory === 'iccc' &&
  creatorUserId !== null &&
  creatorUserId !== undefined &&
  creatorUserId !== 0
) {
  console.warn("CASE 2 triggered → creatorUserId has some ID");
  this.insertEntriesForExistingCreator();   // METHOD B
}



if (userCategory === 'field') {
  debugger;
  console.warn("CASE 2 triggered → creatorUserId will alwaays have some value.");
  this.Case_RoleCategory_Field();
}

    if(this.policyData == undefined) 
     
      this.router.navigate(['alerts']);
    
    this.alertService.getSopActionByAlert(this.policyData.id).subscribe(res => {
      if (res != undefined) {
        let data = res.result.result;
        let sop: any = {
          frsId: data.ticketNo,
          title: data.description,
          system: data.policyName,
          status: true,
          activities: data.actions.map((ele: any) => ({
            id: ele.actionId,
            useCase: ele.actionTag,
            activity: ele.actionTag,
            duration: "Instant",
            type: "Auto",
            action: ele.prmValue.toLowerCase(),
            sequence: ele.sequence,
            hasAccess: true,
            status:true
          }))
        };
        this.sops = [];
        this.sops.push(sop);
        //sop.frsId
      } else {
        this.toastr.error("Something went wrong");
      }
    })
  }

onPanelOpen(act: any, broadcastComp?: any) {
  if (broadcastComp && broadcastComp.loadVmdList) {
      broadcastComp.loadVmdList(); // Call API now
  }
}



loadAlertCurrentStatus(alertId: number): Promise<void> {
  return new Promise((resolve) => {
    this.alertService.GetAlertsByid(alertId)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (res: any) => {
          this.currentAlertStatus = res?.result?.currentStatus || '';
          console.log("Current Alert Status Loaded:", this.currentAlertStatus);
          resolve(); // 👈 IMPORTANT
        },
        error: (err: any) => {
          console.error("Failed to fetch current alert status", err);
          this.currentAlertStatus = '';
          resolve(); // 👈 still resolve, so await doesn't hang
        }
      });
  });
}



sopActions: any[] = [];  // store SOP action flow

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




  close() {
    this.router.navigate(['/alerts']);
  }
insertInitialAlertEntries() {
 debugger;
    const storedUser = sessionStorage.getItem('userInfo');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;
   const currentUserName = storedUser ? JSON.parse(storedUser).name :0 ;
   this.Acknowledgedname=currentUserName;
  debugger;
  const alertUpdateModel = {
  


                id: this.policyData.id,
                lastModifierUserId: currentUserId,
                currentStatus: "ICCAcknowledgement",
                creatorUserId:currentUserId,
                isStatus: 1,


                remarks: this.policyData.remarks,
                creationTime: "2025-11-20T05:08:45.499Z",
                lastModificationTime: "2025-11-20T05:08:45.499Z",
                isDeleted:false,
                deleterUserId: 0,
                deletionTime: "2025-11-20T05:08:45.499Z",
                policyName: this.policyData.policyName,
                siteId: 0,
                policyId: this.policyData.policyId,
                response: this.policyData.response,
                
                filePath: this.policyData.filePath,
                devices:  this.policyData.devices,
                alertSource: 0,
                ticketNo: this.policyData.ticketNo,
                zoneId: this.policyData.zoneID,
  };

  // 1️⃣ First API → UPDATE ALERT TABLE
  this.alertService.AlertUpdate(alertUpdateModel)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (res: any) => {
        this.refreshAfterAction();
        console.log("Alert table updated:", res);
        const updatedAlert = res?.result;
        this.globals.saveAlert(updatedAlert);

        // 2️⃣ Now call ALERT LOG API
        const alertLogModel = {
    AlertId: this.policyData.id,
    ActionType: "ICCAcknowledgement",
    Operation: "ICCAcknowledgement",
    alertLogRemarks: `ICCAcknowledgement By ${currentUserName}`,
    Status: 0,
    UserId: currentUserId
        };

        this.alertService.AlertLogCreate(alertLogModel)
          .pipe(withLoader(this.loaderService))
          .subscribe({
            next: (logRes: any) => {
              console.log("Alert log inserted:", logRes);
              this.toastr.success("Alert initialized successfully");
            },
            error: (logErr: any) => {
              console.error("Failed to insert alert log entry", logErr);
              this.toastr.error("Failed to insert alert log");
            }
          });

      },
      error: (err: any) => {
        console.error("Failed to update alert table", err);
        this.toastr.error("Failed to initialize alert");
      }
    });
}

alertHistory: any[] = [];
loadAlertHistory(alertId: number): Promise<void> {
  return new Promise((resolve) => {
    this.alertService.GetAlerthistory(alertId)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (res: any) => {
          this.alertHistory = res?.result || [];
          console.log("Alert History Loaded:", this.alertHistory);
          resolve();
        },
        error: (err) => {
          console.error("Failed to load alert history:", err);
          this.alertHistory = [];
          resolve(); // still resolve so await doesn't hang
        }
      });
  });
}
getWorkflowStatus(act: any): 'completed' | 'pending' {
  const action = act.action?.toLowerCase() || '';

  const isCompleted = this.alertHistory?.some(
    h => h.actionName?.toLowerCase() === action
  );

  return isCompleted ? 'completed' : 'pending';
}


async insertEntriesForExistingCreator() {
  // No entry in DB

  const name = await this.getIcccAcknowledgedUser(this.policyData.id);

  this.Acknowledgedname = name || '';   // assign returned name

  console.log("Assigned Name from ICCC Acknowledgement:", this.Acknowledgedname);
}
async getIcccAcknowledgedUser(alertId: number): Promise<string | null> {
  return new Promise(resolve => {

    debugger;

    this.alertService.GetAlerthistory(alertId).subscribe({
      next: (res: any) => {

        const history = res?.result || [];

        if (!history.length) {
          resolve(null);
          return;
        }

        // Find the entry with actionName = ICCAcknowledgement
        const icccEntry = history.find((x: any) =>
          x.actionName?.toLowerCase() === 'iccacknowledgement'
        );

        if (!icccEntry) {
          resolve(null);
          return;
        }

        const remark = icccEntry.alertLogRemarks || '';

        // Expected format: "ICCAcknowledgement By USERNAME"
        // Extract the name after "By "
        const parts = remark.split('By ');

        if (parts.length > 1) {
          const extractedName = parts[1].trim();
          resolve(extractedName);
        } else {
          resolve(null);
        }
      },

      error: () => resolve(null)
    });

  });
}

async getSiteAcknowledgedUser(alertId: number): Promise<string | null> {
  return new Promise(resolve => {

    this.alertService.GetAlerthistory(alertId).subscribe({
      next: (res: any) => {

        const history = res?.result || [];

        if (!history.length) {
          resolve(null);
          return;
        }

        // Find the entry with actionName = fieldengineeracknowledgement
        const icccEntry = history.find((x: any) =>
          x.actionName?.toLowerCase() === 'fieldengineeracknowledgement'
        );

        if (!icccEntry) {
          resolve(null);
          return;
        }

        const remark = icccEntry.alertLogRemarks || '';

        // Expected format: "ICCAcknowledgement By USERNAME"
        // Extract the name after "By "
        const parts = remark.split('By ');

        if (parts.length > 1) {
          const extractedName = parts[1].trim();
          resolve(extractedName);
        } else {
          resolve(null);
        }
      },

      error: () => resolve(null)
    });

  });
}


// Case_RoleCategory_Field() {

//   const storedUser = sessionStorage.getItem('userInfo');
//   const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;
//   const currentUserName = storedUser ? JSON.parse(storedUser).name : 0;

//   this.Acknowledgedname = this.creatorUserName;

//   const alertId = this.policyData.id;

//   // 🟢 STEP 1: First call API to fetch the current status of the alert
//   this.alertService.GetAlertsByid(alertId)
//     .pipe(withLoader(this.loaderService))
//     .subscribe({
//       next: (res: any) => {

//         const currentStatus =  res?.result?.currentStatus || '';
        

//         // ❌ If status is NOT "AssignToSiteEngineer", stop everything
//         if (currentStatus == "AssignToFieldEngineer") {

//           this.Acknowledgedname_Field=currentUserName;
//              // 🟢 STEP 2: Safe to proceed → Build update model
//         const alertUpdateModel = {
//           id: alertId,
//           lastModifierUserId: currentUserId,
//           currentStatus: "FieldEngineerAcknowledgement",
//           creatorUserId:  this.creatorUserId,
//           remarks: this.policyData.remarks,
//           creationTime: new Date().toISOString(),
//           lastModificationTime: new Date().toISOString(),
//           isDeleted: false,
//           deleterUserId: 0,
//           deletionTime: new Date().toISOString(),
//           policyName: this.policyData.policyName,
//           siteId: 0,
//           policyId: this.policyData.policyId,
//           response: this.policyData.response,
//           isStatus: 0,
//           filePath: this.policyData.filePath,
//           devices: this.policyData.devices,
//           alertSource: 0,
//           ticketNo: this.policyData.ticketNo,
//           zoneId: this.policyData.zoneId,
//         };

//         // 🟢 STEP 3: Insert Alert Log FIRST
//         const alertLogModel = {
//           AlertId: alertId,
//           ActionType: "FieldEngineerAcknowledgement",
//           Operation: "FieldEngineerAcknowledgement",
//           Status: 0,
//           UserId: currentUserId
//         };

//         this.alertService.AlertLogCreate(alertLogModel)
//           .pipe(withLoader(this.loaderService))
//           .subscribe({
//             next: (logRes: any) => {

//               console.log("Alert log inserted:", logRes);

//               // 🟢 STEP 4: Now update Alert Table
//               this.alertService.AlertUpdate(alertUpdateModel)
//                 .pipe(withLoader(this.loaderService))
//                 .subscribe({
//                   next: (updateRes: any) => {
//                     console.log("Alert table updated:", updateRes);
//                     this.toastr.success("Alert acknowledged successfully");
//                   },
//                   error: (updateErr: any) => {
//                     console.error("Failed to update alert table", updateErr);
//                     this.toastr.error("Failed to update alert status");
//                   }
//                 });

//             },
//             error: (logErr: any) => {
//               console.error("Failed to insert alert log entry", logErr);
//               this.toastr.error("Failed to insert alert log");
//             }
//           });
//         }

//         else{


//           return;
//         }

   

//       },
//       error: (err: any) => {
//         console.error("Failed to fetch alert status", err);
//         this.toastr.error("Unable to verify alert status");
//       }
//     });
// }


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

Case_RoleCategory_Field() {
  debugger;

  const storedUser = sessionStorage.getItem('userInfo');
  const currentUserId = storedUser ? JSON.parse(storedUser).id : 0;
  const currentUserName = storedUser ? JSON.parse(storedUser).name : 0;

  const alertId = this.policyData.id;
  const status = this.currentAlertStatus?.toLowerCase() || '';

  // ============================================================
  // CASE 1 → currentStatus = TransferToICCC
  // ============================================================
  if (status === 'transfertositeengineer') {

    // ICCC Name

    this.getIcccAcknowledgedUser(alertId).then((icccName) => {
      this.Acknowledgedname = icccName || '';
    });

    // Field Name
    this.getSiteAcknowledgedUser(alertId).then((fieldName) => {
      this.Acknowledgedname_Field = fieldName || '';
    });

    return; // STOP HERE → Do not insert anything
  }

  else{
     // ============================================================
  // CASE 2 → NOT TransferToICCC
  // ============================================================

  this.getAlertHistory(alertId).then((history) => {

    const hasFieldAck = history.some(
      h => h.actionName?.toLowerCase() === 'fieldengineeracknowledgement'
    );

    // ---------------------------------------------------------
    // CASE 2A → FieldEngineerAcknowledgement already exists
    // ---------------------------------------------------------
    if (hasFieldAck) {

      this.getIcccAcknowledgedUser(alertId).then((icccName) => {
        this.Acknowledgedname = icccName || '';
      });

      this.getSiteAcknowledgedUser(alertId).then((fieldName) => {
        this.Acknowledgedname_Field = fieldName || '';
      });

      return; // STOP → no new DB insert needed
    }


    // ---------------------------------------------------------
    // CASE 2B → NO FieldEngineerAcknowledgement → INSERT NOW
    // ---------------------------------------------------------
else{
      this.Acknowledgedname = this.creatorUserName;   // ICCC
    this.Acknowledgedname_Field = currentUserName;  // FIELD

    // 🟢 STEP 1 — Insert into Log table
    const alertLogModel = {
      AlertId: alertId,
      ActionType: "FieldEngineerAcknowledgement",
      Operation: "FieldEngineerAcknowledgement",
      alertLogRemarks: `FieldEngineerAcknowledgement By ${currentUserName}`,
      Status: 0,
      UserId: currentUserId
    };

    this.alertService.AlertLogCreate(alertLogModel)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (logRes: any) => {
          console.log("Log inserted (FieldEngineerAcknowledgement):", logRes);

          // 🟢 STEP 2 — Update alert table
          const alertUpdateModel = {
            id: alertId,
            lastModifierUserId: currentUserId,
            currentStatus: "FieldEngineerAcknowledgement",
            creatorUserId: this.creatorUserId,
            remarks: this.policyData.remarks,
            creationTime: new Date().toISOString(),
            lastModificationTime: new Date().toISOString(),
            isDeleted: false,
            deleterUserId: 0,
            deletionTime: new Date().toISOString(),
            policyName: this.policyData.policyName,
            siteId: 0,
            policyId: this.policyData.policyId,
            response: this.policyData.response,
            isStatus: this.policyData.isStatus,
            filePath: this.policyData.filePath,
            devices: this.policyData.devices,
            alertSource: 0,
            ticketNo: this.policyData.ticketNo,
            zoneId: this.policyData.zoneID,
          };
 debugger;
          this.alertService.AlertUpdate(alertUpdateModel)
            .pipe(withLoader(this.loaderService))
            .subscribe({
              next: (updateRes: any) => {
                this.refreshAfterAction();
                console.log("Alert table updated:", updateRes);
                        const updatedAlert = updateRes?.result;
        this.globals.saveAlert(updatedAlert);
                this.toastr.success("Alert acknowledged successfully");
              },
              error: (updateErr: any) => {
                console.error("Failed to update alert", updateErr);
                this.toastr.error("Failed to update alert status");
              }
            });

        },
        error: (err) => {
          console.error("Failed to insert log", err);
          this.toastr.error("Failed to insert alert log");
        }
      });
}


  }); // END of getAlertHistory()

  }


 
}





getFallbackSequenceFromHistory(alertId: number): Promise<number | null> {
  return new Promise((resolve) => {
    this.alertService.getSopActionByAlert(alertId).subscribe({
      next: (res: any) => {
        const history = res?.result || [];

        if (!history.length) {
          resolve(null);
          return;
        }

        // Sort DESC (latest first)
        const sorted = history.sort((a: any, b: any) => b.id - a.id);

        // Start from second entry because last entry is "current"
        for (let i = 1; i < sorted.length; i++) {
          const actionName = sorted[i].actionName?.toLowerCase();

          // Try to match actionName with SOP prmValue
          const sopMatch = this.sopActions.find(a =>
            a.prmValue?.toLowerCase() === actionName
          );

          if (sopMatch) {
            resolve(Number(sopMatch.sequence));  // FOUND MATCH
            return;
          }
        }

        resolve(null);  // No match found even after checking entire history
      },

      error: () => resolve(null)
    });
  });
}

async getAlertHistory(alertId: number): Promise<any[]> {
  return new Promise(resolve => {
    this.alertService.GetAlerthistory(alertId).subscribe({
      next: (res) => resolve(res?.result || []),
      error: () => resolve([])
    });
  });
}


canAccessAction(act: any, currentStatus: string): boolean {

  const action = act.action?.toLowerCase() || '';
  const current = currentStatus?.toLowerCase() || '';

  // -------------------------------------------------
  // 1️⃣ CHECK ROLE ACTION MAPPING
  // -------------------------------------------------
  if (!this.roleActions || this.roleActions.length === 0) return false;
  else if (!this.roleActions.includes(action)) return false;
  else{
      // -------------------------------------------------
  // 2️⃣ CASE A: currentStatus is NULL/EMPTY
  //    → ALLOW role-mapped actions that exist in SOP
  // -------------------------------------------------
  if (!current || current.trim() === '') {
    const targetSop = this.sopActions.find(
      x => x.prmValue?.toLowerCase() === action
    );
    return !!targetSop;
  }
  else{
      // -------------------------------------------------
  // 3️⃣ TRY NORMAL SOP MATCH
  // -------------------------------------------------
  const currentSop = this.sopActions.find(
    x => x.prmValue?.toLowerCase() === current
  );

  // -------------------------------------------------
  // 4️⃣ CASE B: currentStatus NOT IN SOP → FALLBACK
  // -------------------------------------------------
  if (!currentSop) {
    if (!this.alertHistory || this.alertHistory.length === 0) return false;

    let lastValidSop = null;

    for (let i = this.alertHistory.length - 1; i >= 0; i--) {
      const histAction = this.alertHistory[i].actionName?.toLowerCase();

      const sopMatch = this.sopActions.find(
        x => x.prmValue?.toLowerCase() === histAction
      );

      if (sopMatch) {
        lastValidSop = sopMatch;
        break;
      }
    }

    if (!lastValidSop) return false;

    const fallbackSeq = Number(lastValidSop.sequence);

    const targetSop = this.sopActions.find(
      x => x.prmValue?.toLowerCase() === action
    );
    if (!targetSop) return false;

   return Number(targetSop.sequence) === fallbackSeq + 1;
  }
  else{
      // -------------------------------------------------
  // 5️⃣ CASE C: NORMAL SOP LOGIC
  // -------------------------------------------------
  const currentSeq = Number(currentSop.sequence);

  const targetSop = this.sopActions.find(
    x => x.prmValue?.toLowerCase() === action
  );
  if (!targetSop) return false;

  const targetSeq = Number(targetSop.sequence);

  return targetSeq === currentSeq + 1;
  }


  }


  }


}


async refreshAfterAction() {
  console.log("Child action completed → refreshing SOP access logic");

  // Reload the currentStatus
 await this.loadAlertCurrentStatus(this.policyData.id);

  // Reload history if needed
 await  this.loadAlertHistory(this.policyData.id);

  // 🔥 FORCE change detection of canAccessAction()
  this.recalculateAllActionAccess();
  
}

recalculateAllActionAccess() {
  this.sops?.forEach(s => {
    s.activities.forEach(a => {
      a.hasAccess = this.canAccessAction(a, this.currentAlertStatus);
      this.getWorkflowStatus(a); 
    });
  });
}














}

