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

  // ✅ Clear user info on logout
  clearUser() {
    sessionStorage.removeItem('userInfo');
    this.user = null;
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
