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
  CmToggleComponent
  ],
  providers:[ToastrService]
})
export class ContactConfigurationFormComponent {
form!: FormGroup;
 isContactLoaded : boolean = false;
  MatButtonToggleChange:any;

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

  isactivetoggle = {
   
    name: 'isActive',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

  constructor(
    private PramglobalService:PramglobalService,
    private fb: FormBuilder,
    private service: ContactConfigService,
    private toast: ToastrService,
    private dialogRef: MatDialogRef<ContactConfigurationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
   this.form = this.fb.group({
    ContactType: ['', Validators.required],
    name: ['', Validators.required],
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

debugger;
    this.toast.success("chgdgsf")
  if (!this.form.invalid) {
    this.form.markAllAsTouched(); 
     
      let _Contactconfigmodel = new Contactconfigmodel();

// _Contactconfigmodel.type=this.form.controls['ContactType'].value;
_Contactconfigmodel.type=this.form.controls['ContactType'].value?.value ?? this.form.controls['ContactType'].value ?? '';
_Contactconfigmodel.name = this.form.controls['name'].value;
_Contactconfigmodel.contact = this.form.controls['contact'].value;
_Contactconfigmodel.isActive=this.form.controls['isActive'].value?.value ?? this.form.controls['isActive'].value.value ?? true;
// _Contactconfigmodel.isActive=true;
_Contactconfigmodel.isDeleted=false;
// _Contactconfigmodel.deleterUserId=0;
// _Contactconfigmodel.deletionTime="2025-06-20T05:32:25.067Z";
// _Contactconfigmodel.lastModificationTime="2025-06-20T05:32:25.067Z";
// _Contactconfigmodel.lastModifierUserId="2";
// _Contactconfigmodel.creationTime="2025-06-20T05:32:25.067Z";
// _Contactconfigmodel.creatorUserId=0;
_Contactconfigmodel.id=0



 


  this.service.ContactCreate(_Contactconfigmodel).subscribe({
    next: () => {
      console.log('Saved successfully');

           this.toast.success('Contact saved successfully'); 
      this.dialogRef.close(this.form.value);
    
      this.toast.success('Contact saved successfully');
      
    },
    error: (err) => {
      console.error('Save failed:', err);
      this.toast.error('Failed to save project');
    }
  });



  }
  else {
      this.form.markAllAsTouched(); 
  this.toast.error('Form is not valid');
  return;
    
  }


  }


    close() {
    this.dialogRef.close();
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
}


 ngOnInit(): void {
            // this.form = this.fb.group({
            //             selectedProject: [''],
            //             selectedStatus: [''],
            //             searchText: [''],
            //              ContactType: ['']
            //           });
                      this.loadContactTypes('Contact','Type');

                    }


loadContactTypes(Module: string, unit: string) {
  debugger;
  this.PramglobalService.GetAllGlobalValues(Module, unit).subscribe(response => {
    const items = response?.result || [];

    const contactOptions = items.map((item: any) => ({
      name: item.rfu1,
      value: item.prmvalue
    }));

  
    // contactOptions.unshift({
    //   name: 'All',
    //   value: null
    // });
    console.log(contactOptions);
    this.ContactTypeSettings.options = contactOptions;
     this.isContactLoaded = true;
  }, error => {
    console.error('Error fetching Contact Type list', error);
  });
}






}
