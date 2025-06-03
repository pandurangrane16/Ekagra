import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ThemingService {
  readonly theme = new BehaviorSubject<'light-theme' | 'dark-theme'>(
    'light-theme'
  );
  private isBrowser: boolean;

  constructor(private ref: ApplicationRef) {
    this.isBrowser = typeof window !== 'undefined';
    
}
getWindow(): Window | null {
  return this.isBrowser ? window : null;
  
}

getWindowWidth(): number {
  return this.isBrowser ? window.innerWidth : 0;
}



toggleTheme() {
this.theme.next(
  this.theme.value === 'dark-theme' ? 'light-theme' : 'dark-theme'
);
}
}