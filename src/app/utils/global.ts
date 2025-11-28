import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Globals {
  // 🧭 Global app-level variables
  CurrentPage: string = '';
  NotificationCount: number = 0;

  // 🧩 User model (defined directly here)
  //    This matches your API response structure
  private _userSource = new BehaviorSubject<User | null>(null);
  user$ = this._userSource.asObservable();

  get user(): User | null {
    return this._userSource.value;
  }

  set user(value: User | null) {
    this._userSource.next(value);
  }

  // ✅ Restore user from session storage
  restoreUserFromSession() {
    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }
    private _userMappingSource = new BehaviorSubject<UserMapping | null>(null);
  userMapping$ = this._userMappingSource.asObservable();

  private _alertSource = new BehaviorSubject<any | null>(null);
alert$ = this._alertSource.asObservable();

get alert(): any | null {
  return this._alertSource.value;
}

set alert(value: any | null) {
  this._alertSource.next(value);
}

  get userMapping(): UserMapping | null {
    return this._userMappingSource.value;
  }

  set userMapping(value: UserMapping | null) {
    this._userMappingSource.next(value);
  }

  // ✅ Clear user info on logout
  clearUser() {
    sessionStorage.removeItem('userInfo');
    this.user = null;
  }
    saveUserMapping(mapping: UserMapping) {
    sessionStorage.setItem('userMapping', JSON.stringify(mapping));
    this.userMapping = mapping;
  }
  saveAlert(alert: any) {
  sessionStorage.setItem("latestAlert", JSON.stringify(alert));
  this.alert = alert;
}

restoreAlertFromSession() {
  const stored = sessionStorage.getItem("latestAlert");
  if (stored) {
    this.alert = JSON.parse(stored);
  }
}


  restoreUserMappingFromSession() {
    const stored = sessionStorage.getItem('userMapping');
    if (stored) {
      this.userMapping = JSON.parse(stored);
    }
  }
  
}



// 🧠 Define your User model directly here
export interface User {
  id: number;
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  isActive: boolean;
  signInToken?: string; // optional field
}

export interface UserMapping {
  userId: number;
  roleId: string;
  zoneId: string;
  category: string;
}
