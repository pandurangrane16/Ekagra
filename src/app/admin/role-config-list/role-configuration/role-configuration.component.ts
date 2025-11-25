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
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-role-configuration',
  imports: [MaterialModule, CommonModule, CmInputComponent,CmToggleComponent],
  templateUrl: './role-configuration.component.html',
  styleUrl: './role-configuration.component.css'
})
export class RoleConfigurationComponent implements OnInit {
   private destroy$ = new Subject<void>();
  isCheckingRole = false;
   RoleConfigurationService = inject(RoleConfigurationService);
  form: any;
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

    roleDesc: {
      // labelHeader: 'Description',
      placeholder: 'Description',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
  }
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
   private cd: ChangeDetectorRef,
     private fb: FormBuilder,
   // private dialogRef: MatDialogRef<MapConfigurationFormComponent>,
    private service :RoleConfigurationService,
     private toast: ToastrService,
   // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.form = this.fb.group({
    //   roleName: [ [Validators.required, this.noWhitespaceValidator(), this.noSpecialCharValidator()]],
    //   roleDesc: [ [Validators.required, this.noWhitespaceValidator(), this.noSpecialCharValidator()]],
    //   // name: ['', [Validators.required,this.noWhitespaceValidator()]],
    //   // description: ['', [Validators.required,this.noWhitespaceValidator()]],
    //   // displayname: ['', [Validators.required,this.noWhitespaceValidator()]],
    //   // minzoom: ['', Validators.required],
    //   // maxzoom: ['', Validators.required],
    //   // sourceurl: ['', [Validators.required,Validators.pattern(/^(https?:\/\/)[^\s]+$/)]],
    //   // lat: ['', Validators.required],
    //   // long: ['', Validators.required],
    //   // wmslayer :['', [Validators.required,Validators.pattern(/^(https?:\/\/)[^\s]+$/)]],
    //   isActive: [Validators.required],

      
      
    // });
    this.form = this.fb.group({});
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
noSpecialCharValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (typeof value !== 'string') return null;

    // Allow only alphabets, numbers, space, hyphen, underscore
    const valid = /^[a-zA-Z0-9_\- ]*$/.test(value);
    return valid ? null : { specialChars: true };
  };
}
  ngOnInit(): void {
    debugger;
    this.form = this.fb.group({
      roleId: [],
     roleName: ['', [Validators.required, this.noWhitespaceValidator(), this.noSpecialCharValidator()]],
    roleDesc: ['', [Validators.required, this.noWhitespaceValidator(), this.noSpecialCharValidator()]],
      isActive: [true, Validators.required]
    })


    // Subscribe to roleName changes and check uniqueness
    const roleCtrl = this.form.get('roleName');
  
   if (roleCtrl) {
    roleCtrl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: string) => {
        const trimmed = (value || '').trim();

        // skip if empty or only whitespace
        if (!trimmed) {
          this.clearControlError(roleCtrl, 'exists');
          return;
        }

        // call API
        this.isCheckingRole = true;
        this.service.CheckRoleNameExists(trimmed).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
            const exists = !!(res?.result === true || res === true);
            if (exists) {
              roleCtrl.setErrors(Object.assign({}, roleCtrl.errors || {}, { exists: true }));
            } else {
              this.clearControlError(roleCtrl, 'exists');
            }
            this.isCheckingRole = false;
            this.cd.markForCheck();
          },
          error: (err) => {
            console.error('CheckRoleNameExists error', err);
            this.clearControlError(roleCtrl, 'exists');
            this.isCheckingRole = false;
            this.cd.markForCheck();
          }
        });
      });
  }
    
  }

  close() {
     this.router.navigate(['/admin/roleconfigList']);
  }

  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  
  submit() {
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
   tenantId: _Roleconfigmodel.tenantId


};

this.service.CreateOrUpdateRole(payload).subscribe({
  next: (res: any) => {
    if (res.success) {
      this.toast.success('Role configuration saved successfully');
      this.router.navigate(['/admin/roleconfigList']);
    } else {
      this.toast.error('Failed to save role configuration');
    }
  },
  error: (err: any) => {
    console.error('API error:', err);
    this.toast.error('Something went wrong while saving role');
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


private clearControlError(control: any, key: string) {
  if (!control) return;
  const errs = control.errors ? { ...control.errors } : null;
  if (!errs) return;
  if (errs[key]) {
    delete errs[key];
    const hasOther = Object.keys(errs).length > 0;
    control.setErrors(hasOther ? errs : null);
  }
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

