import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../common/cm-table/cm-table.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [
   
  ],
  imports: [
   
    HttpClientModule,
    CommonModule,
  ]
})
export class AdminModule { }
