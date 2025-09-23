import { Component } from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SmsActionComponent } from '../../user/alert/actions/sms-action/sms-action.component';
import { EmailActionComponent } from '../../user/alert/actions/email-action/email-action.component';
import { ApiActionComponent } from '../../user/alert/actions/api-action/api-action.component';

interface SopActivity {
  id: string;
  useCase: string;
  activity: string;
  duration: string;
  type: string;
  action : string;
}

interface Sop {
  frsId: string;
  title: string;
  system: string;
  activities: SopActivity[];
}

@Component({
  selector: 'app-sopflow',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, SmsActionComponent,EmailActionComponent,ApiActionComponent],
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
        { id: 'ACT-001', useCase: 'SMS Management', activity: 'If EMS/NMS finds device unhealthy...', duration: 'Instant', type: 'Auto',action : "sms" },
        { id: 'ACT-002', useCase: 'Email Management', activity: 'Incident created automatically', duration: 'Instant', type: 'Auto',action : "email" },
        { id: 'ACT-003', useCase: 'API Management', activity: 'Operator verifies incident', duration: '1-2 mins', type: 'Auto',action : "api" },
      ]
    },
    // {
    //   frsId: 'SOP_ATCS_001',
    //   title: 'Controller Health Alert',
    //   system: 'ATCS',
    //   activities: [
    //     { id: 'ACT-001', useCase: 'Controller health alert', activity: 'System generates health alert...', duration: 'Instant', type: 'Auto' },
    //     { id: 'ACT-002', useCase: 'ICCC creates incident', activity: 'Incident created automatically', duration: 'Instant', type: 'Auto' },
    //     { id: 'ACT-004', useCase: 'Operator acknowledges', activity: 'Operator confirms issue', duration: '2-5 mins', type: 'Manual' },
    //   ]
    // }
  ];
}
