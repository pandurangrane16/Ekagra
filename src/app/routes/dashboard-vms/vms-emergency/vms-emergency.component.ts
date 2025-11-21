import { Component, Inject, inject, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/common/loader.service';
import { alertservice } from '../../../services/admin/alert.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { withLoader } from '../../../services/common/common';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../Material.module';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmCheckboxGroupComponent } from '../../../common/cm-checkbox-group/cm-checkbox-group.component';
import { CmSelectCheckComponent } from '../../../common/cm-select-check/cm-select-check.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { VmsBroadcastingComponent } from "../../../user/alert/actions/vms-broadcasting/vms-broadcasting.component";
import { SessionService } from '../../../services/common/session.service';
import { CommonService } from '../../../services/common/common.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vms-emergency',
  imports: [CommonModule, MaterialModule, CmInputComponent, CmSelectCheckComponent, CmSelect2Component],
  templateUrl: './vms-emergency.component.html',
  styleUrl: './vms-emergency.component.css'
})
export class VmsEmergencyComponent implements OnInit {
  loaderService = inject(LoaderService);
  _common = inject(CommonService);
  form: any;
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
    labelHeader: 'Select VMD(Controller)',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: {}
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
  isVmdSelected: boolean = true;
  alertService = inject(alertservice);
  toast = inject(ToastrService);
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
    console.log(this.data);
    this.form = this.fb.group({
      selectedAction: ['', Validators.required],
      selectedVmdAction: [],
      remarks: ['', Validators.required],
      isVerified: [false, Validators.required],
      selectedUnit: [],
      unitValue: []
    })
    //this.GetVmdList();
  }




  onActionTypeSelected(evt: any) {
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
      if (res != undefined) {
        let deviceData = JSON.parse(res.result);
        console.log(deviceData);
      } else {
        this.toast.error("Something went wrong");
      }
    });
  }
  SubmitAction() { }
  CancelAction() { }
}
