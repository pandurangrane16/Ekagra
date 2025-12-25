import { Component, Inject, OnInit, QueryList,ViewChildren,ElementRef, } from '@angular/core';
import { MaterialModule } from '../../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmInputComponent } from '../../../common/cm-input/cm-input.component';
import { CmTextareaComponent } from '../../../common/cm-textarea/cm-textarea.component';
import { CmButtonComponent } from '../../../common/cm-button/cm-button.component';
import { Dialog } from '@angular/cdk/dialog';
import{alertservice} from '../../../services/admin/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ResolvedByData {
  id: number;
  allData?: any;  
  alertId?: string;
  policyName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'app-resolved-by-itself',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule,CmTextareaComponent],
  templateUrl: './resolved-by-itself.component.html',
  styleUrl: './resolved-by-itself.component.css'
})
export class ResolvedByItselfComponent implements OnInit {
readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 10 MB
  form: FormGroup;

  // Holds all file slots with file data
  fileSlots: { files: File[]; names: string }[] = [{ files: [], names: '' }];

  @ViewChildren('fileInputRef') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

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
  fileName: string;
  constructor( private _snackBar: MatSnackBar,
  private alertService: alertservice,@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,private dialog : Dialog) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      remarks: ['', Validators.required]
    });
  }
  close() {
    this.dialog.closeAll();
  }


   // ✅ Add a new file input slot
  addFileSlot(): void {
    this.fileSlots.push({ files: [], names: '' });
  }

  // ✅ Remove a file input slot
  removeFileSlot(index: number): void {
    this.fileSlots.splice(index, 1);
  }

  // ✅ Handle file selection
  // onFileSelected(event: Event, index: number): void {
  //   const input = event.target as HTMLInputElement;
  //   if (!input?.files?.length) return;

  //   const selectedFiles = Array.from(input.files);
  //   this.fileSlots[index].files = selectedFiles;
  //   this.fileSlots[index].names = selectedFiles.map(f => f.name).join(', ');
  //   input.value = ''; // reset for next upload
  // }

  onFileSelected(event: Event, index: number): void {
  const input = event.target as HTMLInputElement;
  if (!input?.files?.length) return;

  const selectedFiles = Array.from(input.files);
  const validFiles: File[] = [];
  const rejectedFiles: string[] = [];

  selectedFiles.forEach(file => {
    if (file.size <= this.MAX_FILE_SIZE) {
      validFiles.push(file);
    } else {
      rejectedFiles.push(file.name);
    }
  });

  // ❌ Show error if any file exceeds size
  if (rejectedFiles.length > 0) {
    this._snackBar.open(
      `File size should not exceed 5 MB. Rejected: ${rejectedFiles.join(', ')}`,
      'Close',
      {
        duration: 4000,
        panelClass: ['snackbar-error']
      }
    );
  }

  // ✅ Assign only valid files
  this.fileSlots[index].files = validFiles;
  this.fileSlots[index].names = validFiles.map(f => f.name).join(', ');

  // Reset input so same file can be reselected
  input.value = '';
}

  // ✅ Trigger the hidden input click
  triggerFileInput(index: number): void {
    const inputEl = this.fileInputs.get(index);
    if (inputEl) {
      inputEl.nativeElement.click();
    }
  }

  // ✅ Submit form + files
  submitAction(): void {
   const formData = new FormData();
debugger;
    // append other payload fields required by API
    formData.append('AlertId', String(this.data?.allData?.alertId || this.data?.allData?.id || 0));
    formData.append('Remarks', this.form?.get('remarks')?.value || '');
    formData.append('ActionType', 'ResolvedByItself');
    formData.append('Operation', 'ResolvedByItselfWithFileUpload');
    formData.append('Status', String(4));
    formData.append('UserId', sessionStorage.getItem('UserId') || '0');

    // append files from slots
    this.fileSlots.forEach((slot) => {
      slot.files.forEach((file) => {
        formData.append('Files', file, file.name); // backend expects Files[] via [FromForm]
      });
    });

this.alertService.ResolvedByItselfWithFileUpload(formData).subscribe({
  next: (res: any) => {
    console.log('Upload response:', res);
    if (res.result === 1 || res?.result === 1) {
      // ✅ Successfully resolved
      this.close();
    } else {
      // ❌ API returned failure
      this._snackBar.open('Error occurred while resolving alert.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  },
  error: (err) => {
    console.error('Upload failed', err);
    this._snackBar.open('An error occurred while uploading files.', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }
});
  }

  cancelAction() {

  }


}
