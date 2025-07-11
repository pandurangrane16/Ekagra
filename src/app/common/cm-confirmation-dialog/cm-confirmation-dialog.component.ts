import { Component, Inject,ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title?: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'delete';
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'app-cm-confirmation-dialog',
    standalone: true,
    imports: [CommonModule,MatDialogModule,MatButtonModule,MatIconModule],
  templateUrl: './cm-confirmation-dialog.component.html',
  styleUrls: ['./cm-confirmation-dialog.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class CmConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CmConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

