import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmTableComponent } from '../common/cm-table/cm-table.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';


@Injectable({
  providedIn:'root'
})

@NgModule({
  declarations: [
   
  ],
  imports: [
   
    HttpClientModule,
    CommonModule,
    ToastrModule
  ]
})
export class AdminModule { }
