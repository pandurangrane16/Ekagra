import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmTextareaComponent } from '../../../common/cm-textarea/cm-textarea.component';
import { CmButtonComponent } from '../../../common/cm-button/cm-button.component';
import { Dialog } from '@angular/cdk/dialog';
import { ResolvedByData } from '../resolved-by-itself/resolved-by-itself.component';
import { AlertlogService } from '../../../services/admin/alertlog.service';
import { LoaderService } from '../../../services/common/loader.service';
import { withLoader } from '../../../services/common/common';
@Component({
  selector: 'app-alert-history',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './alert-history.component.html',
  styleUrl: './alert-history.component.css',
})
export class AlertHistoryComponent implements OnInit {
  alertHistory: any[] = [];
  isLoading = false;
  form: FormGroup;
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: ResolvedByData, private fb: FormBuilder, private dialog: Dialog, private alertLogService: AlertlogService
,private loaderService : LoaderService) { }
  ngOnInit(): void {
     this.loadAlertHistory();
    this.form = this.fb.group({
      remarks: ['', Validators.required]
    });
  }
  loadAlertHistory(): void {
    debugger;
    const alertId = this.data?.alertId || this.data?.allData?.alertId || this.data?.id;
    if (!alertId) return;

    this.isLoading = true;
    this.alertLogService.GetAlerthistory(alertId).pipe(withLoader(this.loaderService)).subscribe({
      next: (res: any) => {
        // adapt to API shape: prefer result.items, fallback to result or raw array
        this.alertHistory = res?.result?.items ?? res?.result ?? res ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load alert history', err);
        this.isLoading = false;
      }
    });
  }

  close() {
    this.dialog.closeAll();
  }

  submitAction() {
    
  }
  cancelAction() {

  }
}
