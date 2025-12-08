
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormArray, FormsModule, FormGroup, Validators, ReactiveFormsModule, } from '@angular/forms';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmToggleComponent } from '../../../common/cm-toggle/cm-toggle.component';
import { CommonModule } from '@angular/common';
import { projconfigservice } from '../../../services/admin/progconfig.service';
import { projconfigmodel } from '../../../models/admin/projconfig.model';
import { getErrorMsg } from '../../../utils/utils';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderService } from '../../../services/common/loader.service';
import { withLoader } from '../../../services/common/common';
import { SOPService } from '../../../services/admin/sop.service';
import { SopAction } from '../../../models/admin/sopaction.model';
import { SopConfig } from '../../../models/admin/sopconfig.model';
import { CmSelect2Component } from '../../../common/cm-select2/cm-select2.component';

import { ToastrService } from 'ngx-toastr';
import { min } from 'lodash';


@Component({
  selector: 'app-sop-form.component',
  imports: [CommonModule, CmSelect2Component, CmInputComponent, MatTooltipModule, MatCardModule, MatIconModule, CmToggleComponent, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './sop-form.component.html',
  styleUrl: './sop-form.component.css',
  standalone: true,
  providers: [ToastrService]
})
export class SopFormComponent {
  loaderService = inject(LoaderService);
  router = inject(Router);
  form!: FormGroup;
  MatButtonToggleChange: any;
  basepath: any;
  ruleEngineStatus: any;
  mapStatus: any;
  previewUrls: { [key: string]: string } = {};
  state: any;
  selectedFilePaths = {
    mapIcon: '',
    projectIcon: ''
  };
  isPolicyOptionLoaded = false;
  isActionOptionLoaded = false;
  inputFields = {
    name: {
      // labelHeader: 'Name',
      placeholder: 'Enter project name',
      restrictToAlphanumeric: true,
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    },
    sequence: {
      // labelHeader: 'Name',
      placeholder: 'Enter Sequence',

      appearance: 'outline',
      isDisabled: false,
      type: 'number',
      min: 1,
      color: 'primary',
      formFieldClass: "w-100"
    },
    sopname: {
      // labelHeader: 'Description',
      placeholder: 'Enter SOP Name',
      appearance: 'outline',
      isDisabled: false,
      color: 'primary',
      formFieldClass: "w-100"
    }
  };
  ActionSettings = {

    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: []
  };
  PolicySettings = {


    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: []
  };
  PolicySettings2 = {


    lableClass: 'form-label',
    formFieldClass: '',
    appearance: 'fill',
    options: []
  };


  isactivetoggle = {

    name: 'isActive',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

  toggleSettingsWithoutHeader = {

    name: 'isActive',
    //defaultValue: true,
    formControlName: 'isActive',
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };


  Maptoggle = {

    name: 'mapEnabled',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };

  Ruleenginetoggle = {

    name: 'ruleEngineEnabled',
    //defaultValue: true,
    data: [
      { value: true, displayName: 'Yes' },
      { value: false, displayName: 'No' }
    ]
  };



  constructor(
    private fb: FormBuilder,
    private service: SOPService,
    private toast: ToastrService,
    //private dialogRef: MatDialogRef<ProjectConfigurationFormComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/), this.noWhitespaceValidator()]],
      description: ['', [Validators.required, this.noWhitespaceValidator()]],
      isActive: [Validators.required],
      actions: this.fb.array([])
    });

  }

  get f() {
    return this.form.controls;
  }

  //   noWhitespaceValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const isWhitespace = (control.value || '').trim().length === 0;
  //     return isWhitespace ? { whitespace: true } : null;
  //   };
  // }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      if (typeof value !== 'string') {
        return null;
      }

      const isWhitespace = value.trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  GetActionList() {
    this.service.GetActionList().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      const items = response?.result || [];

      const projectOptions = items.map((item: any) => ({
        name: item.rfu1,
        value: item.prmidentifier
      }));


      // projectOptions.unshift({
      //   name: 'All',
      //   value: null
      // });

      this.ActionSettings.options = projectOptions;
      // this.form.controls['name'].setValue({
      //   name: 'All',
      //   value: null
      // });


      this.isActionOptionLoaded = true;
      console.log("hello", this.PolicySettings.options)
    }, error => {
      console.error('Error fetching Action list', error);
    });



  }


  GetPolicyList_all() {
    this.service.GetPolicyList_all().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      const items = response?.result || [];

      const projectOptions = items.map((item: any) => ({
        name: item.policyName,
        value: item.id
      }));
      this.PolicySettings2.options = projectOptions;



      if (this.state?.mode === 'edit' && this.state?.record) {


        const selectedProj = (this.PolicySettings2.options as any[]).find(
          proj => proj.name === this.state.record.policyName

        );
        console.log("hello selectedProj");

        //this.editid=this.state.record.id;
        this.form.patchValue({
          sopname: this.state.record.sopName,
          name: selectedProj,
          isActive: this.state.record.isActive,
        });


        this.form.get('name')?.disable();
        this.service.GetSOPActionMasterbySOPId(this.state.record.id)
          .pipe(withLoader(this.loaderService))
          .subscribe((res: any) => {
            const actions = res?.result || [];
            this.patchActions(actions);
          });

      }



      console.log("hello", this.PolicySettings.options)
    }, error => {
      console.error('Error fetching policy list', error);
    });






  }

  patchActions(actions: any[]) {
    this.actions.clear();

    actions.forEach((act, index) => {
      // Find matching dropdown option by value (actionId)
      const selectedAction = (this.ActionSettings?.options as { name: any, value: any }[] || [])
        .find(opt => opt.value === act.actionId);

      const row = this.fb.group({
        actionName: [selectedAction ?? { name: act.actionName, value: act.actionId }, Validators.required],
        sequence: [act.sequence ?? index + 1, Validators.required]
      });

      this.actions.push(row);
    });
  }
  GetPolicyList() {
    this.service.GetPolicyList().pipe(withLoader(this.loaderService)).subscribe((response: any) => {
      const items = response?.result || [];

      const projectOptions = items.map((item: any) => ({
        name: item.policyName,
        value: item.id
      }));
      this.PolicySettings.options = projectOptions;
      this.isPolicyOptionLoaded = true;






      console.log("hello", this.PolicySettings.options)
    }, error => {
      console.error('Error fetching policy list', error);
    });






  }

  ReturnValue($event: any) {
    console.log($event);
  }

  get actions(): FormArray<FormGroup> {
    return this.form.get('actions') as FormArray<FormGroup>;
  }

  removeActionRow(index: number) {
    this.actions.removeAt(index);
  }

  onProjectSelected($event: Event) {

  }


  ngOnInit(): void {

    this.state = history.state;
    const state = this.state;

    this.GetPolicyList();
    this.GetActionList();
    this.GetPolicyList_all();



    this.form = this.fb.group({
      name: ['', [Validators.required,]],
      sopname: ['', [Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.required, this.noWhitespaceValidator()]],
      isActive: [true, Validators.required],
      actions: this.fb.array([])
    });

    this.addActionRow();

  }
  getErrorMessage(_controlName: any, _controlLable: any, _isPattern: boolean = false, _msg: string) {
    return getErrorMsg(this.form, _controlName, _controlLable, _isPattern, _msg);
  }

  addActionRow() {
    const row = this.fb.group({
      actionName: [null, Validators.required],
      sequence: [this.actions.length + 1, Validators.required]
    });
    this.actions.push(row);
  }





  submit() {

    debugger;
    console.log(this.form.controls)

    try {
      if (!this.form.invalid) {


        const actions = this.form.get('actions')?.value || [];
        const totalActions = actions.length;
        const sequences = actions.map((a: any) => Number(a.sequence));
        const invalidRange = sequences.some((seq: any) => seq < 1 || seq > totalActions);
        const uniqueSequences = new Set(sequences);
        const hasDuplicates = uniqueSequences.size !== sequences.length;
        const missingOrExtra = uniqueSequences.size !== totalActions;

        if (invalidRange || hasDuplicates || missingOrExtra) {
          this.toast.error(`Invalid sequence numbers! 
        Sequences must be unique and between 1 and ${totalActions}.`);
          return;
        }




        else {
          if (this.state?.mode === 'edit' && this.state?.record) {
            const sopName = this.form.controls['sopname'].value;

            this.service.CheckSOPNameExist(sopName, this.state.record.id)
              .pipe(withLoader(this.loaderService))
              .subscribe({
                next: (res: any) => {
                  if (res?.result === true) {
                    this.toast.error("This SOP name already exists. Please choose another name.");
                    return;

                  }


                  else {
                    const actions = this.form.get('actions')?.value || [];
                    const actionNames = actions.map((a: any) => a.actionName?.value);
                    const hasDuplicates = new Set(actionNames).size !== actionNames.length;

                  

                    
                      this.form.markAllAsTouched();

                      let _SopConfig = new SopConfig();
                      _SopConfig.policyId = this.form.controls['name'].value.value;
                      _SopConfig.sopName = this.form.controls['sopname'].value;
                      _SopConfig.isActive = this.form.controls['isActive'].value;
                      _SopConfig.creationTime = "2025-06-20T05:32:25.067Z";
                      _SopConfig.creatorUserId = 0;
                      _SopConfig.id = this.state.record.id;

                      this.service.SOPConfigUpdate(_SopConfig)
                        .pipe(withLoader(this.loaderService))
                        .subscribe({
                          next: (response: any) => {
                            if (response?.result?.id) {
                              const sopId = response.result.id;
                              const actions = this.form.get('actions')?.value || [];

                              this.service.SOPActionDelete(sopId)
                                .pipe(withLoader(this.loaderService))
                                .subscribe({
                                  next: () => {

                                    actions.forEach((action: any) => {
                                      let _SopAction = new SopAction();
                                      _SopAction.sopId = sopId;
                                      _SopAction.actionId = action.actionName?.value;
                                      _SopAction.actionTag = action.actionName?.name;
                                      _SopAction.sequence = Number(action.sequence);
                                      _SopAction.creationTime = new Date().toISOString();
                                      _SopAction.creatorUserId = 0;
                                      _SopAction.lastModificationTime = null;
                                      _SopAction.lastModifierUserId = 0;

                                      this.service.SOPActionCreate(_SopAction)
                                        .pipe(withLoader(this.loaderService))
                                        .subscribe({
                                          next: (res: any) => {
                                            console.log("Saved action:", res);
                                          },
                                          error: (err) => {
                                            console.error("Error updating action:", err);
                                            this.toast.error("Failed to update an action");
                                          }
                                        });
                                    });

                                    this.toast.success("SOP and all actions updated!");
                                    this.form.reset();
                                    this.router.navigate(['/admin/sopconfig']);
                                  },
                                  error: (err) => {
                                    console.error("Error deleting old SOP actions:", err);
                                    this.toast.error("Failed to delete old SOP actions");
                                  }
                                });
                            }
                          },
                          error: (err) => {
                            console.error("Error in SOP update:", err);
                            this.toast.error("Failed to update SOP");
                          }
                        });
                    


                  }
                },
                error: (err) => {
                  console.error("Error checking duplicate SOP name:", err);
                  this.toast.error("Failed to validate SOP name");
                }
              });
          }


          else {
            const sopName = this.form.controls['sopname'].value;
            this.service.CheckSOPNameExist(sopName)
              .pipe(withLoader(this.loaderService))
              .subscribe({
                next: (res: any) => {
                  if (res?.result === true) {

                    this.toast.error("This SOP name already exists. Please choose another name.");
                    return;
                  }




                  else {


                    const actions = this.form.get('actions')?.value || [];
                    const actionNames = actions.map((a: any) => a.actionName?.value);
                    const hasDuplicates = new Set(actionNames).size !== actionNames.length;

                   

                    
                      this.form.markAllAsTouched();

                      let _SopConfig = new SopConfig();

                      _SopConfig.policyId = this.form.controls['name'].value.value;
                      _SopConfig.sopName = this.form.controls['sopname'].value;
                      _SopConfig.isActive = this.form.controls['isActive'].value;
                      _SopConfig.creationTime = "2025-06-20T05:32:25.067Z"
                      _SopConfig.creatorUserId = 0




                      this.service.SOPConfigCreate(_SopConfig)
                        .pipe(withLoader(this.loaderService))
                        .subscribe({
                          next: (response: any) => {
                            if (response?.result?.id) {
                              const sopId = response.result.id;


                              const actions = this.form.get('actions')?.value || [];

                              actions.forEach((action: any) => {
                                let _SopAction = new SopAction();
                                _SopAction.sopId = sopId;
                                _SopAction.actionId = action.actionName?.value
                                _SopAction.actionTag = action.actionName?.name
                                _SopAction.sequence = Number(action.sequence);
                                _SopAction.creationTime = new Date().toISOString();
                                _SopAction.creatorUserId = 0;
                                _SopAction.lastModificationTime = null;
                                _SopAction.lastModifierUserId = 0;


                                this.service.SOPActionCreate(_SopAction)
                                  .pipe(withLoader(this.loaderService))
                                  .subscribe({
                                    next: (res: any) => {
                                      console.log("Saved action:", res);
                                    },
                                    error: (err) => {
                                      console.error("Error saving action:", err);
                                      this.toast.error("Failed to save an action");
                                    }
                                  });
                              });

                              this.toast.success("SOP and all actions submitted!");


                              this.form.reset();
                              this.router.navigate(['/admin/sopconfig']);


                            }
                          },
                          error: (err) => {
                            console.error("Error in SOP create:", err);
                            this.toast.error("Failed to create SOP");
                          }
                        });
                    



                  }
                },
                error: (err) => {
                  console.error("Error checking duplicate SOP name:", err);
                  this.toast.error("Failed to validate SOP name");
                }
              });
          }

        }


      }
      else {
        this.form.markAllAsTouched();
        this.toast.error('Form is not valid');
        return;

      }

    }
    catch (error) {
      console.error('Unexpected error in submit:', error);
      this.toast.error('An unexpected error occurred');
    }


  }





  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(controlName)?.setValue(file);
    }
  }




  close() {
    this.router.navigate(['/admin/sopconfig']);
  }




};



























