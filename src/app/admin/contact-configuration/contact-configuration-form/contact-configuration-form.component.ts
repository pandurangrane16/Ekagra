import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormsModule,FormGroup, Validators ,ReactiveFormsModule,} from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { CommonModule } from '@angular/common';
import { ContactConfigService } from '../../../services/admin/contact-config.service';
import { getErrorMsg } from '../../../utils/utils';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { projconfigmodel } from '../../../models/admin/projconfig.model';
import { Contactconfigmodel } from '../../../models/admin/contactconfig.model';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';
import { MatIconModule } from '@angular/material/icon';
import { PramglobalService } from '../../../services/admin/pramglobal.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-contact-configuration-form',
  templateUrl: './contact-configuration-form.component.html',
  styleUrls: ['./contact-configuration-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatAutocompleteModule,
  MatFormFieldModule,
    CmSelect2Component, 
     CmSelect2Component,
  CmInputComponent,
  CmToggleComponent,
    MatCardModule
  ],
  providers:[ToastrService]
})
export class ContactConfigurationFormComponent {
form!: FormGroup;
 isContactLoaded : boolean = false;
  MatButtonToggleChange:any;
  state:any;
   inputFields = {
    name: {
      // labelHeader: 'Name',
      placeholder: 'Enter name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    contact: {
      // labelHeader: 'Description',
      placeholder: 'Enter contact',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
       formFieldClass: "w-100"
    }
  };

  // isactivetoggle = {
   
  //   name: 'isActive',
  //   //defaultValue: true,
  //   data: [
  //     { value: true, displayName: 'Yes' },
  //     { value: false, displayName: 'No' }
  //   ]
  // };

isactivetoggle = {
  name: 'isActive',
  formControlName: 'isActive', // 👈 this is used inside cm-toggle component template
  // headerName: 'Is Active',
  data: [
    { value: true, displayName: 'Yes' },
    { value: false, displayName: 'No' }
  ]
};

  constructor(
     private PramglobalService: PramglobalService,
  private fb: FormBuilder,
  private service: ContactConfigService,
  private toast: ToastrService,
    private router: Router

    // private dialogRef: MatDialogRef<ContactConfigurationFormComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ){
   this.form = this.fb.group({
    ContactType: ['', Validators.required],
    name: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9 ]+$/)  // ✅ Allows spaces, uppercase, lowercase, digits
    ]
  ],
    contact: ['', Validators.required],  // Use boolean only if it's a toggle
    isActive: [false, Validators.required],
    selectedProject: [''],
    selectedStatus: [''],
    searchText: ['']
  });
  }
get f() {
  return this.form?.controls || {};
}
 getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

 submit() {
  try {
    debugger;

    const selectedType = this.form.controls['ContactType'].value?.value;

if (selectedType === '1' && !/^\d{10}$/.test(this.form.controls['contact'].value)) {
  this.toast.error('Please enter a valid 10-digit number');
  return;
}

if (selectedType === '2' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.controls['contact'].value)) {
  this.toast.error('Please enter a valid email address');
  return;
}

    this.form.markAllAsTouched();

    if (this.form.valid) {
      let _Contactconfigmodel = new Contactconfigmodel();

      _Contactconfigmodel.type = this.form.controls['ContactType'].value?.value ?? this.form.controls['ContactType'].value ?? '';
      _Contactconfigmodel.name = this.form.controls['name'].value;
      _Contactconfigmodel.contact = this.form.controls['contact'].value;

     const isActiveToggle = this.form.controls['isActive']?.value;
_Contactconfigmodel.isActive = isActiveToggle?.value ?? isActiveToggle ?? true;

      _Contactconfigmodel.isDeleted = false;
      _Contactconfigmodel.id = 0;

       const state = history.state;
    if (state?.mode === 'edit' && state?.record){

    _Contactconfigmodel.id = state.record.id;
   
debugger;
      this.service.ContactUpdate(_Contactconfigmodel).subscribe({
    next: () => {
      console.log('Updated successfully');

       this.toast.success('Updated successfully'); 
       this.router.navigate(['/ContactConf']);
    
    },
    error: (err) => {
      console.error('Update failed:', err);
      this.toast.error('Failed to update Site');
    }
  });

  return;

  }
  else{
      this.service.ContactCreate(_Contactconfigmodel).subscribe({
        next: () => {
          this.toast.success('Contact saved successfully');
          this.router.navigate(['/ContactConf']);
        },
        error: (err) => {
          console.error('Save failed:', err);
          this.toast.error('Failed to save project');
        }
      });
    }
    } else {
      this.toast.error('Form is not valid');
    }

  } catch (ex) {
    console.error('Exception caught:', ex);
    this.toast.error('An unexpected error occurred');
  }
}





    close() {
  this.router.navigate(['/ContactConf']);
  }

  ContactTypeSettings: any = {
   labelHeader: '',
  lableClass: 'form-label',
  formFieldClass: '',
  appearance: 'fill',
  options: []
};
// isContactLoaded: boolean = true; // or controlled via API call

onContactTypeSelected(event: any) {
 console.log('Selected Contact Type:', event);

  const contactControl = this.form.controls['contact'];
  contactControl.clearValidators(); // remove all validators first

  if (event?.value === '1') {
    contactControl.setValidators([
      Validators.required,
      Validators.pattern(/^\d{10}$/) // 10 digit numeric
    ]);
  } else if (event?.value === '2') {
    contactControl.setValidators([
      Validators.required,
      Validators.email // built-in email validator
    ]);
  } else {
    contactControl.setValidators([Validators.required]);
  }

  contactControl.updateValueAndValidity();
}


 ngOnInit(): void {
   this.state = history.state;
  this.loadContactTypes('Contact', 'Type');

  // Enforce UPPERCASE transformation
  // this.form.controls['name'].valueChanges.subscribe((value: string) => {
  //   if (value !== null) {
  //     const transformed = value.replace(/\s+/g, '').toUpperCase();
  //     if (value !== transformed) {
  //       this.form.controls['name'].setValue(transformed, { emitEvent: false });
  //     }
  //   }
  // });
  this.form.controls['name'].valueChanges.subscribe((value: string) => {
  if (value !== null && value !== value.trim()) {
    this.form.controls['name'].setValue(value.trim(), { emitEvent: false });
  }
});
// Handle dynamic contact validation if already in edit mode
  const selectedType = this.form.controls['ContactType'].value?.value;
  if (selectedType) {
    this.onContactTypeSelected(this.form.controls['ContactType'].value);
  }
                    }


loadContactTypes(Module: string, unit: string) {
  debugger;
  this.PramglobalService.GetAllGlobalValues(Module, unit).subscribe(response => {
    const items = response?.result || [];

    const contactOptions = items.map((item: any) => ({
      name: item.rfu1,
      value: item.prmvalue
    }))
  .filter((opt: { name: string; value: string }) => opt.name !== 'All');

    this.ContactTypeSettings.options = contactOptions;
    this.isContactLoaded = true;
 this.form.controls['ContactType'].setValue({
  name: 'Select Type',
  value: null
});
    // Use setTimeout to ensure patchValue runs after DOM and bindings settle
    setTimeout(() => {
      const record = this.state?.record;
      if (this.state?.mode === 'edit' && record) {
// const selectedContactType = contactOptions.find((opt: { name: string; value: string }) => opt.value === record.type);

const selectedContactType = contactOptions.find(
      (opt: { name: string; value: string }) => opt.name === record.type
    );

const selectedIsActive = this.isactivetoggle.data.find((opt: { value: boolean; displayName: string }) => opt.value === record.isActive);

        // this.form.patchValue({
        //   ContactType: selectedContactType || '',
        //   name: record.name,
        //   contact: record.contact,
        //   isActive: selectedIsActive ?? { value: true, displayName: 'Yes' }
        // });
        this.form.patchValue({
  ContactType: selectedContactType || '',
  name: record.name,
  contact: record.contact,
  isActive: record.isActive ?? true  // 👈 PATCH ONLY BOOLEAN
});

        console.log('✅ Patched form after async data load:', this.form.value);
      }
    }, 0); // async patch after options
  }, error => {
    console.error('❌ Error fetching Contact Type list', error);
  });
}






}
