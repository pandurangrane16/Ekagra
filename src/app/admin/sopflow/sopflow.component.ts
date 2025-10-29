import { Component, inject, OnInit } from '@angular/core';
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
import { AtcsLampFailureComponent } from "../../user/alert/actions/atcs-lamp-failure/atcs-lamp-failure.component";
import { AtcsDetectorFailureComponent } from "../../user/alert/actions/atcs-detector-failure/atcs-detector-failure.component";
import { ItmsCameraFailureComponent } from "../../user/alert/actions/itms-camera-failure/itms-camera-failure.component";
import { ItmsLpuFailureComponent } from "../../user/alert/actions/itms-lpu-failure/itms-lpu-failure.component";
import { ItmsChallanCollectionComponent } from "../../user/alert/actions/itms-challan-collection/itms-challan-collection.component";
import { EnvSensorFailureComponent } from "../../user/alert/actions/env-sensor-failure/env-sensor-failure.component";
import { EnvSensorPollutionComponent } from "../../user/alert/actions/env-sensor-pollution/env-sensor-pollution.component";
import { Router } from '@angular/router';
import { alertservice } from '../../services/admin/alert.service';
import { ToastrService } from 'ngx-toastr';
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
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, SmsActionComponent, EmailActionComponent, ApiActionComponent, PaActionComponent, VmsDeviceFailureComponent, VmsEmergencyPlayComponent, AtcsHealthComponent, AtcsCongestionComponent, AtcsLampFailureComponent, AtcsDetectorFailureComponent, ItmsCameraFailureComponent, ItmsLpuFailureComponent, ItmsChallanCollectionComponent, EnvSensorFailureComponent, EnvSensorPollutionComponent],
  templateUrl: './sopflow.component.html',
  styleUrl: './sopflow.component.css'
})
export class SopflowComponent implements OnInit {
  router = inject(Router);
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

  constructor(private alertService: alertservice, private toastr: ToastrService) {
    const navigation = this.router.getCurrentNavigation();
    this.policyData = navigation?.extras?.state?.['data'];

  }
  ngOnInit(): void {
    this.alertService.getSopActionByAlert(this.policyData.policyId).subscribe(res => {
      if (res != undefined) {
        let sop : Sop;
        //sop.frsId
      } else {
        this.toastr.error("Something went wrong");
      }
    })
  }

  close() {
    this.router.navigate(['/alerts']);
  }
}

