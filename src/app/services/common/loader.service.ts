import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loading.asObservable();

  showLoader() {
    console.log("LoaderService : Start")
    this.loading.next(true);
  }

  hideLoader() {
    console.log("LoaderService : End")
    this.loading.next(false);
  }
}
