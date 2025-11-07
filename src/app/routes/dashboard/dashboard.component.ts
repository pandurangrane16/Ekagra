import { MatMenuModule } from '@angular/material/menu';
import { Component, ElementRef, inject, OnInit, viewChild,OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { WidgetComponent } from '../../widget/widget.component';
import { DashboardService } from '../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { wrapGrid } from 'animate-css-grid';
import {CdkDragDrop, CdkDropList, moveItemInArray, CdkDropListGroup} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
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


constructor(private keycloakService: KeycloakService,) {}

async ngOnInit(){
  console.log(this.session._getSessionValue("UserValidation"));
  wrapGrid(this.dashboard().nativeElement,{duration:300});
   // Subscribe to the toggle event


  const keycloak = await this.keycloakService.getKeycloakInstance();


  //    const registerUrl = keycloak.createRegisterUrl({
  //      redirectUri: window.location.origin + '/#/dashboard'
  //    });
  //  window.location.href = (await registerUrl).toString()



  if (keycloak.authenticated) {
    const tokenParsed = keycloak.tokenParsed;
    console.log('User Info from Keycloak:', tokenParsed);

 
  
  }

const isLoggedIn = await this.keycloakService.isLoggedIn();

if (isLoggedIn) {
  const profile = await this.keycloakService.loadUserProfile();
  console.log('User Profile:', profile);
} else {
  console.warn('User not logged in yet!');
}
 
  
 
}





drop(event: CdkDragDrop<number, any>){
  const {previousContainer , container} = event;
  this.store.updateWidgetPosition(previousContainer.data, container.data)
}




}
