// loader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private requestCount = 0;
  public isLoading$ = new BehaviorSubject<boolean>(false);

  show() {
    console.log("Show method called");
    this.requestCount++;
    if (this.requestCount === 1) {
      this.isLoading$.next(true);
    }
  }

  hide() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0) {
      this.isLoading$.next(false);
    }
  }

  reset() {
    this.requestCount = 0;
    this.isLoading$.next(false);
  }
}
