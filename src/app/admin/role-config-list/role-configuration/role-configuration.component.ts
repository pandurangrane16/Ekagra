import { Component, OnInit ,inject} from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { getErrorMsg } from '../../../utils/utils';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { Router } from '@angular/router';
import { RoleConfigurationService } from '../../../services/admin/role-configuration.service';
import{RoleconfigModule} from '../../../models/admin/roleconfig.module';
import { dateTimeFormat } from 'highcharts'; 
import { ToastrService } from 'ngx-toastr';
import { withLoader } from '../../../services/common/common';
import { LoaderService } from '../../../services/common/loader.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
@Component({
  selector: 'app-role-configuration',
  imports: [MaterialModule, CommonModule,CmSelect2Component, CmInputComponent,CmToggleComponent],
  templateUrl: './role-configuration.component.html',
  styleUrl: './role-configuration.component.css'
})
export class RoleConfigurationComponent implements OnInit {
  loaderService=inject(LoaderService)
   RoleConfigurationService = inject(RoleConfigurationService);
  form: any;
  isProjectOptionsLoaded =false;
    router = inject(Router);
  inputFields = {
    roleName: {
      // labelHeader: 'Description',
      placeholder: 'Role Name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
        roleType: {
      // labelHeader: 'Description',
      placeholder: 'Role Category',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },

    roleDesc: {
      // labelHeader: 'Description',
      placeholder: 'Description',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
  }

    projectSelectSettings = {
    labelHeader: 'Select Category',
    lableClass: 'form-label',
    formFieldClass: '', 
    appearance: 'fill',
    options: [ ]
  };
  isActiveSettings = {

    name: 'isActive',
    formControlName: 'isActive',
    defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

  get f() {
    return this.form.controls;
  }
  
constructor(
    private fb: FormBuilder,
   // private dialogRef: MatDialogRef<MapConfigurationFormComponent>,
    private service :RoleConfigurationService,
     private toast: ToastrService,
   // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required,this.noWhitespaceValidator()]],
      description: ['', [Validators.required,this.noWhitespaceValidator()]],
      displayname: ['', [Validators.required,this.noWhitespaceValidator()]],
      minzoom: ['', Validators.required],
      maxzoom: ['', Validators.required],
      sourceurl: ['', [Validators.required,Validators.pattern(/^(https?:\/\/)[^\s]+$/)]],
      lat: ['', Validators.required],
      long: ['', Validators.required],
      wmslayer :['', [Validators.required,Validators.pattern(/^(https?:\/\/)[^\s]+$/)]],
      isActive: [Validators.required],

      
      
    });
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      // roleId: [],
      roleName: ['', Validators.required],
      roleType: ['', Validators.required],
      roleDesc: ['', Validators.required],
      isActive: [true, Validators.required]
    })

    this.getRoleCategoryList();
  }

    onProjectSelected(event: any) {
    console.log('Selected Project:', event);
  }
  

  getRoleCategoryList() {
    this.service.GetCategoryList().pipe(withLoader(this.loaderService)).subscribe((response:any) => {
      const items = response?.result || [];
  
      const projectOptions = items.map((item: any) => ({
        name: item.prmvalue
        
      }));
  
    
      // projectOptions.unshift({
      //   name: 'All',
      //   value: null
      // });
  
      this.projectSelectSettings.options = projectOptions;
          this.projectSelectSettings.options = projectOptions;
  // this.form.controls['selectedProject'].setValue({
  //   name: 'All',
  //   value: null
  // });
  
  // this.form.controls['selectedStatus'].setValue({
  //   name: 'All',
  //   value: null
  // });
      this.isProjectOptionsLoaded = true;
    }, error => {
      console.error('Error fetching project list', error);
    });
  }

  close() {
     this.router.navigate(['/admin/roleconfigList']);
  }

  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  
  submit() {
    debugger;
  try {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Form is not valid');
      return;
    }

    let _Roleconfigmodel = new RoleconfigModule();

    _Roleconfigmodel.id = this.form.controls['id']?.value || 0;
    _Roleconfigmodel.creationTime = new Date().toISOString();
    _Roleconfigmodel.creatorUserId = Number(sessionStorage.getItem('UserId')) || 0;
    _Roleconfigmodel.lastModificationTime = new Date().toISOString();
    _Roleconfigmodel.lastModifierUserId = Number(sessionStorage.getItem('UserId')) || 0;
    _Roleconfigmodel.isDeleted = false;
    _Roleconfigmodel.deleterUserId = 0;
    _Roleconfigmodel.deletionTime = new Date().toISOString();
    _Roleconfigmodel.tenantId = 1;
    _Roleconfigmodel.name = this.form.controls['roleName'].value;
    _Roleconfigmodel.category = this.form.controls['roleType'].value.name;
    _Roleconfigmodel.displayName = this.form.controls['roleDesc'].value;
    _Roleconfigmodel.IsStatic = true;
    _Roleconfigmodel.IsDefault = false;
    _Roleconfigmodel.NormalizedName = '';
    _Roleconfigmodel.ConcurrencyStamp = '';


    const payload = {
  
   creationTime : _Roleconfigmodel.creationTime,
   concurrencyStamp: _Roleconfigmodel.ConcurrencyStamp,
   deleterUserId :  _Roleconfigmodel.deleterUserId,
   deletionTime : _Roleconfigmodel.deletionTime,
   creatorUserId :  _Roleconfigmodel.creatorUserId,
   displayName: _Roleconfigmodel.displayName,
   isDeleted :false,
   isDefault: _Roleconfigmodel.IsDefault,
   isStatic: _Roleconfigmodel.IsStatic,
   lastModificationTime :_Roleconfigmodel.lastModificationTime,
   lastModifierUserId : _Roleconfigmodel.lastModifierUserId ,
   name: _Roleconfigmodel.name,
   normalizedName: _Roleconfigmodel.NormalizedName,
   tenantId: _Roleconfigmodel.tenantId,
   category:_Roleconfigmodel.category


};

this.service.CreateOrUpdateRole(payload).subscribe({
  next: (res: any) => {
    if (res.success) {
      this.toast.success('Role configuration saved successfully');
      this.router.navigate(['/admin/roleconfigList']);
    } else {
      this.toast.error('Failed to save role configuration');
            const errorMessage =
        res.error?.details || res.error?.message || 'Failed to save role configuration';
      this.toast.error(errorMessage);
    }
  },
  error: (err: any) => {
     console.error('API error:', err);

    // Try to extract the backend error message from err.error
    const backendError =
      err?.error?.error?.details ||
      err?.error?.error?.message ||
      err?.message ||
      'Something went wrong while saving role';

    this.toast.error(backendError);
  }
});

    // this.service.CreateOrUpdateRole(_Roleconfigmodel).subscribe({
    //   next: (res: any) => {
    //     if (res.success) {
    //       this.toast.success('Role configuration saved successfully');
    //       this.router.navigate(['/admin/roleconfigList']);
    //     } else {
    //       this.toast.error('Failed to save role configuration');
    //     }
    //   },
    //   error: (err: any) => {
    //     console.error('API error:', err);
    //     this.toast.error('Something went wrong while saving role');
    //   }
    // });

  } catch (error) {
    console.error('Unexpected error in submit:', error);
    this.toast.error('An unexpected error occurred');
  }
}

}

