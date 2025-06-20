import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loader$ = this.loadingSubject.asObservable();
  public showLoader : boolean = false;
  private requestCount = 0;

  show() {
    this.requestCount++;
    this.loadingSubject.next(true);
    this.showLoader = true;
    console.log("Show Loader : "+this.showLoader);
  }

  hide() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
      this.showLoader = false;
      console.log("Show Loader : "+this.showLoader);
    }
  }
}
