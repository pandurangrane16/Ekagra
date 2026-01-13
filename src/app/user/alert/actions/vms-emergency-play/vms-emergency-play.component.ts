import { Component, Input, inject,OnInit } from '@angular/core';
import { AddressbookComponent } from '../addressbook/addressbook.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CmTextareaComponent } from '../../../../common/cm-textarea/cm-textarea.component';
import { EmailActionComponent } from '../email-action/email-action.component';
import { SmsActionComponent } from '../sms-action/sms-action.component';
import { CmSelect2Component } from '../../../../common/cm-select2/cm-select2.component';
import { MaterialModule } from '../../../../Material.module';
import { CommonModule } from '@angular/common';
import { CmInputComponent } from "../../../../common/cm-input/cm-input.component";
import { CmSelectCheckComponent } from '../../../../common/cm-select-check/cm-select-check.component';
import { ApiStatusComponent } from '../api-status/api-status.component';
import { SopActionService } from '../../../../services/common/SopAction.service';
import { withLoader } from '../../../../services/common/common';
import { LoaderService } from '../../../../services/common/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vms-emergency-play',
  imports: [MaterialModule, CommonModule, CmSelect2Component,CmSelectCheckComponent,CmInputComponent],
  templateUrl: './vms-emergency-play.component.html',
  styleUrl: './vms-emergency-play.component.css',
  standalone:true
})
export class VmsEmergencyPlayComponent implements OnInit {
  form: any;
  selectedBase64: string = '';
    toast = inject(ToastrService);
  loaderService = inject(LoaderService);
  @Input() task: any;
  isEmail: boolean = false;
  isSMS: boolean = false;
  isTypeSelected: boolean = false;
  isVmdSelected : boolean = true;
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
  vmdTypeSettings = {
    labelHeader: 'Select VMD',
    lableClass: 'form-label',
    formFieldClass: 'w-100',
    appearance: 'fill',
    options: {}
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
    unitValue : {
      labelHeader: 'Unit Value',
      placeholder: 'Unit Value',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    }
  }
  constructor(private fb: FormBuilder, private dialog : MatDialog,private service:SopActionService) { }

  ngOnInit(): void {
    this.GetVmdList();
    if (this.task != null && this.task != undefined) {
      this.isTypeSelected = true;
      this.form = this.fb.group({
        selectedAction: ['', Validators.required],
        remarks: ['', Validators.required],
        selectedVmdAction:['', Validators.required],
        isVerified: [false, Validators.required],
        selectedUnit : [],
        unitValue : [],
        imageFile: [null] 
      })
    }
  }

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
     
      this.selectedBase64 = (reader.result as string).split(',')[1]; 
      console.log('Base64:', this.selectedBase64);
    };

    reader.readAsDataURL(file);
  }
}


   GetVmdList() {
    const data = {
      projectId: 2,
      type: 0,
      inputs: "string",
      bodyInputs: "string",
      seq: 4
    };
  
    this.service.SiteResponse(data)
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

  onActionTypeSelected(evt: any,name:any) {


     this.form.patchValue({
    [name]: evt
  });


    // if (evt.name == 'SMS') {
    //   this.isSMS = true;
    //   this.isEmail = false;
    // } else if (evt.name == 'EMAIL') {
    //   this.isSMS = false;
    //   this.isEmail = true;
    // }
  }
SubmitAction() {
  // Uncomment if validation required
  // if (this.form.invalid) {
  //   this.toast.error('Please fill in all required fields before submitting.', 'Validation Error');
  //   return;
  // }


  const currentTime = new Date();

// Get unit and value from the form
const unit = this.form.value.selectedUnit;
const unitValue = Number(this.form.value.unitValue) || 0;

// Calculate toTime
let toTime = new Date(currentTime); // clone current time

if (unit && unitValue) {
  const unitName = unit.name.toLowerCase();
  if (unitName === 'seconds') {
    toTime.setSeconds(toTime.getSeconds() + unitValue);
  } else if (unitName === 'minutes') {
    toTime.setSeconds(toTime.getSeconds() + unitValue * 60);
  }
}

const fromTime = currentTime.toISOString();
const finalToTime = toTime.toISOString();



  const vmsIds = this.form.value.selectedVmdAction || [];

  if (!vmsIds.length) {
    this.toast.warning('Please select at least one VMS before submitting.', 'Warning');
    return;
  }

  vmsIds.forEach((vmsid: string) => {
    const innerBody = [{
      vmsid: vmsid,  // 👈 single ID each time
      vmscommand: 22,
      vmssubcommand: 0,
      vmsstatus: true,
      xcoordinate: 0,
      ycoordinate: 0,
      textContent: this.selectedBase64,
      foregroundColor: '',
      backgroundColor: '',
      font: '',
      fontStyle: '',
      fontSize: 0,
 fromTime: fromTime,
  toTime: finalToTime,
      blink: this.form.value.blink || 0,
      displayAreaHeight: 0,
      displayAreaWidth: 0,
      arrangementmode: 0,
      scrollingdirection: 0,
      publishType: 'image'
    }];

    const bodyString = JSON.stringify(innerBody);

    const requestData = {
      projectId: 2,
      type: 2,
      apiName: "CommandAllPublish",
      baseURL: "https://172.19.32.51:8025/oocAPI/api/Command/CommandAllPublish",
      requestURL: "https://172.19.32.51:8025/oocAPI/api/Command/CommandAllPublish",
      httpMethod: "POST",
      requestParam: "",
      header: "",
      authReq: false,
      authAPIId: "",
      authenticatioType: "",
      apiSeq: 5,
      authenticationHeader: "",
      commType: 0,
      bodyType: "JSON",
      body: bodyString,
      responseStatusCode: "",
      response: "",
      isActive: true,
      projectName: "",
      dataSource: "",
      isDeleted: false,
      deleterUserId: 0,
      deletionTime: new Date().toISOString(),
      lastModificationTime: new Date().toISOString(),
      lastModifierUserId: 0,
      creationTime: new Date().toISOString(),
      creatorUserId: 0,
      id: 0
    };

    console.log(`Submitting Request for VMSID: ${vmsid}`, requestData);

    this.service.ConsumeResponse(requestData)
      .pipe(withLoader(this.loaderService))
      .subscribe({
        next: (response: any) => {
          console.log(`✅ Success for ${vmsid}`, response);
          this.toast.success(`Action submitted successfully for ${vmsid}!`, 'Success');
       
  this.form.reset();
  this.form.patchValue({
  selectedVmdAction: ''  ,
  imageFile: null
  
});
  this.isVmdSelected = false;
setTimeout(() => this.isVmdSelected = true, 0);
 
  this.selectedBase64 = '';

  
        },
        error: (error) => {
          console.error(`❌ Error for ${vmsid}`, error);
          this.toast.error(`Failed to submit action for ${vmsid}.`, 'Error');
        
  this.form.reset();
  this.form.patchValue({
  selectedVmdAction: ''  ,
  imageFile: null
  
});
  this.isVmdSelected = false;
setTimeout(() => this.isVmdSelected = true, 0);
 
  this.selectedBase64 = '';
        }
      });
  });
}


  CancelAction() { 
  this.form.reset();
  this.form.patchValue({
  selectedVmdAction: ''  ,
  imageFile: null
  
});
  this.isVmdSelected = false;
setTimeout(() => this.isVmdSelected = true, 0);
 
  this.selectedBase64 = '';
    
  }

  ViewOnMap(task: any) {
    const dialogRef = this.dialog.open(ApiStatusComponent, {
      width: '800px',
      height: 'auto',
      //title : "Resolved By Iteself",
      position: { top: '20px' },
      panelClass: 'custom-confirm-dialog',
      data: {
        type: "vms"
      }
    })
  }
}
