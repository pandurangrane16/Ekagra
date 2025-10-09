import { Component,inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResolvedByData } from '../resolved-by-itself/resolved-by-itself.component';
import { Dialog } from '@angular/cdk/dialog';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { CmTextareaComponent } from '../../../common/cm-textarea/cm-textarea.component';
import { CmButtonComponent } from '../../../common/cm-button/cm-button.component';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { withLoader } from '../../../services/common/common';
import { LoaderService } from '../../../services/common/loader.service';
import { projconfigservice } from '../../../services/admin/progconfig.service';
import { alertservice } from '../../../services/admin/alert.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-alert-transfer',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule,CmTextareaComponent, CmSelect2Component],
  templateUrl: './alert-transfer.component.html',
  styleUrl: './alert-transfer.component.css'
})
export class AlertTransferComponent implements OnInit {
  form: FormGroup;
    router = inject(Router);
  inputFields = {
    remarks : {
      labelHeader: '',
      placeholder: 'Remarks',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    }
  }
  isUserLoaded : boolean = false;
   userSelectSettings = {
    labelHeader: 'Select User',
    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: []
  };
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private fb: FormBuilder,
  private dialog : Dialog, private loaderService : LoaderService,private service: alertservice, private toast: ToastrService,) { }
  
  
  ngOnInit(): void {
    this.form = this.fb.group({
      remarks: ['', Validators.required],
      selectedUser :['',Validators.required]
    });

    let item = [{
      name :"Pandurang",
      value : 1
    }]

    this.GetAllUsers();
  }

    GetAllUsers() {
      this.service.GetAllUsers().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      const items = response?.result?.items || [];

const projectOptions = items.map((item: any) => ({
  name: item.name,
  value: item.id
}));
  
  
        projectOptions.unshift({
          name: 'All',
          value: null
        });
  
        this.userSelectSettings.options = projectOptions;
        this.form.controls['selectedUser'].setValue({
          name: 'All',
          value: null
        });
  
        // this.form.controls['selectedStatus'].setValue({
        //   name: 'All',
        //   value: null
        // });
        this.isUserLoaded = true;
      }, (error:any) => {
        console.error('Error fetching project list', error);
      });
    }
  close() {
    this.dialog.closeAll();
  }



  submitAction() {
  try {
    if (this.form.valid) {
      this.form.markAllAsTouched();


      let alertModel = {
        alertId: this.data.id,
        userId: this.form.controls['selectedUser'].value.value,
        remarks: this.form.controls['remarks'].value
      };

    
      this.service.TransferSOP(alertModel)
        .pipe(withLoader(this.loaderService))
        .subscribe({
          next: () => {
            this.toast.success('Alert submitted successfully');
            
             this.dialog.closeAll();
            this.router.navigate(['/alerts']); 
          },
          error: (err) => {
            console.error('Save failed:', err);
            this.toast.error('Failed to submit alert');
          }
        });

    } else {
      this.form.markAllAsTouched();
      this.toast.error('Form is not valid');
    }

  } catch (error) {
    console.error('Unexpected error in submit:', error);
    this.toast.error('An unexpected error occurred');
  }
}

  cancelAction() {

  }

  onUserSelected(evt : any) {

  }
}
