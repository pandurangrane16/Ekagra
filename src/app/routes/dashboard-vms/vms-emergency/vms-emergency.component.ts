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
  _vmdSelected: any[];
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
      labelHeader: 'Unit Value(Minutes)',
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
  alertService = inject(alertservice);
  toast = inject(ToastrService);
  uploadedFile: any;
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
    console.log(this.data);
    this.vmdTypeSettings = this.data.data;
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




  onVMSSelected(evt: any) {
    this._vmdSelected = evt;
    if (evt.length == 0)
      this.isTypeSelected = false;
    else
      this.isTypeSelected = true;
  }
  onUnitSelected(evt: any) {

  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);  // Converts file to Base64 string
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  onFileSelected(evt: any) {
    this.uploadedFile = evt;
  }
  SubmitAction() {
    debugger;
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
        let _durSec = this.form.controls["selectedUnit"].value.name.toLocaleLowerCase() == "minutes" ? duration * 60 : duration;
        var _count = 0;
        this._vmdSelected.forEach(element => {
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
                  if(response.success == true)
                    this.toast.success("Request submitted successfully." + "\n" + response.result);
                  else {
                    console.log(response);
                    this.toast.error("An error occurred." + "\n" + response.result);
                  }
                }
                console.log(response);
              },
              error: (error) => {
                console.error('Error fetching VMD list:', error);
              }
            });
        });
      });
    })
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

  addMinutes(seconds: number) {
    const now = new Date();
    now.setMinutes(now.getSeconds() + seconds);

    const formatted = this.formatDateTime(now);
    console.log(formatted);
    return formatted;
  }


  CancelAction() { }
}

