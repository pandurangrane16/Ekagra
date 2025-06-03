import { Injectable } from '@angular/core';
import { BehaviorSubject,Subject  } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class HeaderService {
  public showLogo=true;
  public shift120 = true;
  public editDashboard = new BehaviorSubject<boolean>(false);

  modify = this.editDashboard.asObservable();

  private toggleEditDashboard = new Subject<void>();  // Subject to emit toggle events
  toggleEvent$ = this.toggleEditDashboard.asObservable();  // Observable for events

  sendValue(newValue:any){
    this.editDashboard.next(newValue); 
  }
  changeEdit(){
    this.editDashboard.next(!this.editDashboard.value);

       }


       toggle() {
        this.editDashboard.next(!this.editDashboard.value);
        this.toggleEditDashboard.next();  // Emit the toggle event
        console.log('Toggling state');
      }
    
    
}