import { Component, Inject,ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  title?: string;
  src: string;
  type: 'info' | 'warning' | 'alert' | 'delete';
  // confirmButtonText?: string;
  // cancelButtonText?: string;
}

@Component({
  selector: 'app-cm-dialog',
    standalone: true,
    imports: [CommonModule,MatDialogModule,MatButtonModule,MatIconModule],
  templateUrl: './cm-dialog.component.html',
  styleUrls: ['./cm-dialog.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class CmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

