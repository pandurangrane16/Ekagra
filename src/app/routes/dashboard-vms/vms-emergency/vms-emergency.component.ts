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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Globals } from '../../../utils/global';
import { FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';

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
  dropdown:any;
  isTypeSelected: boolean = false;
  _vmdSelected: any[];
  actionTypeSettings = {
    labelHeader: 'Select Type',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    placeholder: 'placeholder',
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
    placeholder: 'Select VMD',
    appearance: 'fill',
    // options: {}
     options: [] as any[]
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
    private dialogRef: MatDialogRef<VmsEmergencyComponent>
  ) { }
  ngOnInit(): void {
    console.log(this.data);
    this.vmdTypeSettings = this.data.data;
   
    console.log(this.vmdTypeSettings);
    this.form = this.fb.group({
      
      selectedVmdAction: [''],
     
      selectedUnit: ['', Validators.required],
      unitValue: ['', Validators.required]
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
    const input = evt.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (file.size > maxSize) {
    alert('File size must be less than 5 MB');
    input.value = ''; // reset input
    return;
  }

  // File is valid
  console.log('File accepted:', file);
  }
SubmitAction() {


  if (this.form.invalid) {
    // Mark all controls as touched to trigger the display of validation errors in the UI
    this.form.markAllAsTouched();
    this.toast.error("Please fill all required fields.");
    return; // Exit the function and don't proceed to API calls
  }
  else{
      // 2. Additional check: Ensure at least one VMD is selected (since it's not in the FB group)
  if (!this._vmdSelected || this._vmdSelected.length === 0) {
    this.toast.error("Please select at least one VMD.");
    return;
  }
  else{
      this._common._sessionAPITags().subscribe(res => {
    const rawTag = res.find((x: any) => x.tag == "VMSCommandPublish");
    if (!rawTag) return;

    const outerTemplate = JSON.parse(rawTag.inputRequest);
    const bodyTemplate = JSON.parse(outerTemplate.bodyInputs)[0];

    const file = this.uploadedFile.target.files[0];
    this.convertToBase64(file).then((base64String: string) => {
      
      const duration = Number(this.form.controls["unitValue"].value);
      const isMinutes = this.form.controls["selectedUnit"].value.name.toLocaleLowerCase() === "minutes";
      const _durSec = isMinutes ? duration * 60 : duration;

      let successCount = 0;
      let totalVmds = this._vmdSelected.length;

      // Loop through each VMD and call the API individually
      this._vmdSelected.forEach((vmsId: any) => {
        
        // 1. Prepare the single-command array for this specific VMD
        const singleCommandArray = [{
          ...bodyTemplate,
          vmsid: vmsId,
          publishType: "image",
          textContent: base64String,
          fromTime: this.addMinutes(60),
          toTime: this.addMinutes(_durSec)
        }];

        // 2. Build the payload for THIS specific VMD
        const finalPayload = {
          projectId: outerTemplate.projectId,
          type: outerTemplate.type,
          inputs: outerTemplate.inputs,
          bodyInputs: JSON.stringify(singleCommandArray), // Still stringified, but only 1 item
          seq: outerTemplate.seq
        };

        // 3. Call SiteResponse inside the loop
        this.alertService.SiteResponse(finalPayload)
          .pipe(withLoader(this.loaderService))
          .subscribe({
            next: (response: any) => {
              if (response.success) {
                successCount++;
                // Only show success toast and close dialog when ALL requests are finished
                if (successCount === totalVmds) {
                  this.toast.success(`Successfully broadcasted to all ${totalVmds} VMDs.`);
                  this.dialogRef?.close(response);
                }
              } else {
                this.toast.error(`Failed to update VMD: ${vmsId}`);
              }
            },
            error: (error) => {
              console.error(`Error for VMD ${vmsId}:`, error);
            }
          });
      });
    });
  });
  }


  }


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
    now.setSeconds(now.getSeconds() + seconds);

    const formatted = this.formatDateTime(now);
    console.log(formatted);
    return formatted;
  }


  CancelAction() {
    this.dialogRef.close();
  }
}

