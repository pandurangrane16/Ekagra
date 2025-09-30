import { Component } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SmsActionComponent } from '../../user/alert/actions/sms-action/sms-action.component';
import { EmailActionComponent } from '../../user/alert/actions/email-action/email-action.component';
import { ApiActionComponent } from '../../user/alert/actions/api-action/api-action.component';
import { PaActionComponent } from "../../user/alert/actions/pa-action/pa-action.component";
import { VmsDeviceFailureComponent } from "../../user/alert/actions/vms-device-failure/vms-device-failure.component";
import { VmsEmergencyPlayComponent } from "../../user/alert/actions/vms-emergency-play/vms-emergency-play.component";
import { AtcsHealthComponent } from "../../user/alert/actions/atcs-health/atcs-health.component";
import { AtcsCongestionComponent } from "../../user/alert/actions/atcs-congestion/atcs-congestion.component";

interface SopActivity {
  id: string;
  useCase: string;
  activity: string;
  duration: string;
  type: string;
  action: string;
  sequence: number;
  hasAccess: boolean;
}

interface Sop {
  frsId: string;
  title: string;
  system: string;
  activities: SopActivity[];
}

@Component({
  selector: 'app-sopflow',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, SmsActionComponent, EmailActionComponent, ApiActionComponent, PaActionComponent, VmsDeviceFailureComponent, VmsEmergencyPlayComponent, AtcsHealthComponent, AtcsCongestionComponent],
  templateUrl: './sopflow.component.html',
  styleUrl: './sopflow.component.css'
})
export class SopflowComponent {
  sops: Sop[] = [
    {
      frsId: 'SOP_VMS_001',
      title: 'Device Failure Detection',
      system: 'VMS',
      activities: [
        // { id: 'ACT-001', useCase: 'SMS Management', activity: 'If EMS/NMS finds device unhealthy...', duration: 'Instant', type: 'Auto',action : "sms" },
        // { id: 'ACT-002', useCase: 'Email Management', activity: 'Incident created automatically', duration: 'Instant', type: 'Auto',action : "email" },
        // { id: 'ACT-003', useCase: 'API Management', activity: 'Operator verifies incident', duration: '1-2 mins', type: 'Auto',action : "api" },
        // { id: 'ACT-004', useCase: 'PA Management', activity: 'Public Announcement', duration: 'Instant', type: 'Auto',action : "pa" },
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'VMS Device Failure', duration: 'Instant', type: 'Auto', action: "vmsdevicefailure", sequence: 0, hasAccess: true },
        { id: 'ACT-002', useCase: 'Fixed the problem', activity: 'VMS Device Failure', duration: 'Instant', type: 'Auto', action: "vmsdevicefailure", sequence: 1, hasAccess: true },
        // { id: 'ACT-003', useCase: 'Close the activity', activity: 'VMS Device Failure', duration: 'Instant', type: 'Auto',action : "vmsdevicefailure",sequence : 2,hasAccess : true },
      ]
    },
    {
      frsId: 'SOP_VMS_002',
      title: 'VMD Emergency Message Publish',
      system: 'VMS',
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'VMD Emergency Message Publish', duration: 'Instant', type: 'Auto', action: "vmsemergency", sequence: 0, hasAccess: true },
        { id: 'ACT-002', useCase: 'Publish Emergency Message', activity: 'VMD Emergency Message Publish', duration: 'Instant', type: 'Auto', action: "vmsemergency", sequence: 1, hasAccess: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'VMD Emergency Message Publish', duration: 'Instant', type: 'Auto', action: "vmsemergency", sequence: 2, hasAccess: true },
      ]
    },
    {
      frsId: 'SOP_ATCS_001',
      title: 'ATCS Controller health',
      system: 'ATCS',
      activities: [
        { id: 'ACT-001', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "atcshealth", sequence: 0, hasAccess: true },
        { id: 'ACT-002', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "atcshealth", sequence: 1, hasAccess: true },
        { id: 'ACT-003', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "atcshealth", sequence: 2, hasAccess: true },
      ]
    },
    {
      frsId: 'SOP_ATCS_002',
      title: 'ATCS Congestion',
      system: 'ATCS',
      activities: [
        { id: 'ACT-001', useCase: 'Visual Verification', activity: 'Conduct visual verification by opening camera', duration: 'Instant', type: 'Auto', action: "atcscongestion", sequence: 0, hasAccess: true },
        { id: 'ACT-002', useCase: 'Assign to field engineer', activity: 'Assign To Field Personel', duration: 'Instant', type: 'Auto', action: "atcscongestion", sequence: 1, hasAccess: true },
        { id: 'ACT-003', useCase: 'Address the issue', activity: 'Address the issue and fixed', duration: 'Instant', type: 'Auto', action: "atcscongestion", sequence: 2, hasAccess: true },
        { id: 'ACT-004', useCase: 'Verification and Completion', activity: 'Verify health status and closed ticket', duration: 'Instant', type: 'Auto', action: "atcscongestion", sequence: 3, hasAccess: true },
      ]
    }
  ];
}
