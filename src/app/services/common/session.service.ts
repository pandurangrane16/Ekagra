import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  _setSessionValue(_key: string, _val: any) {
    if (this.isBrowser) {
      sessionStorage.setItem(_key, _val);
    }
  }

  _getSessionValue(_key: string) {
    if (this.isBrowser) {
      return sessionStorage.getItem(_key);
    }
    return null;
  }

  _removeSessionValue(_key: string) {
    if (this.isBrowser) {
      sessionStorage.removeItem(_key);
    }
  }
}
