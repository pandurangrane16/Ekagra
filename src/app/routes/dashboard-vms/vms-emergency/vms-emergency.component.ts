import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-vms-emergency',
  imports: [CommonModule, MaterialModule, CmInputComponent,CmSelectCheckComponent, CmSelect2Component],
  templateUrl: './vms-emergency.component.html',
  styleUrl: './vms-emergency.component.css'
})
export class VmsEmergencyComponent implements OnInit {
  loaderService = inject(LoaderService);

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
  isVmdSelected: boolean = true;
  alertService = inject(alertservice);
  toast = inject(ToastrService);
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      selectedAction: ['', Validators.required],
      selectedVmdAction: [],
      remarks: ['', Validators.required],
      isVerified: [false, Validators.required],
      selectedUnit: [],
      unitValue: []
    })
    this.getVMSList();
  }




 GetVmdList() {
  const data = {
    projectId: 2,
    type: 0,
    inputs: "string",
    bodyInputs: "string",
    seq: 4
  };

  this.alertService.SiteResponse(data)
    .pipe(withLoader(this.loaderService))
    .subscribe({
      next: (response: any) => {
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
        }

        // Map to dropdown-compatible format
        const projectOptions = items.map((item: any) => ({
          name: `${item.vmsId} - ${item.description}` || item.vmsId,
          value: item.vmsId,
     
        }));

        // Optional: sort or filter online devices
        // const onlineDevices = projectOptions.filter(p => p.networkStatus === 1);

        this.vmdTypeSettings.options = projectOptions;

        console.log('VMD List:', this.vmdTypeSettings.options);
        // this.isProjectOptionsLoaded = true;
      },
      error: (error) => {
        console.error('Error fetching VMD list:', error);
      }
    });
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
      if(res != undefined) {
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
