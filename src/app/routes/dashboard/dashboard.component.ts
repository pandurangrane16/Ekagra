import { MatMenuModule } from '@angular/material/menu';
import { Component, ElementRef, inject, OnInit, viewChild,OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { WidgetComponent } from '../../widget/widget.component';
import { DashboardService } from '../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { wrapGrid } from 'animate-css-grid';
import {CdkDragDrop, CdkDropList, moveItemInArray, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/common/session.service';


@Component({
    selector: 'app-dashboard',
    imports: [WidgetComponent, MatButtonModule, MatIcon, MatMenuModule, CdkDropList, CdkDropListGroup, CommonModule],
    providers: [DashboardService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
store = inject(DashboardService);
session = inject(SessionService);
editDashboard = true;
show = false;
dashboard = viewChild.required<ElementRef>('dashboard');
ngOnInit(){
  console.log(this.session._getSessionValue("UserValidation"));
  wrapGrid(this.dashboard().nativeElement,{duration:300});
   // Subscribe to the toggle event
 
  
 
}

drop(event: CdkDragDrop<number, any>){
  const {previousContainer , container} = event;
  this.store.updateWidgetPosition(previousContainer.data, container.data)
}




}
