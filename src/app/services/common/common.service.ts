import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private _httpService: HttpService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  _sessionAPITags(): Observable<any> {
    debugger;
    if (!this.isBrowser) {
      return of([]); // return empty observable if not browser
    }

    // Check sessionStorage cache
    const cached = sessionStorage.getItem("APITags");
    if (cached != undefined && cached != null && cached != "null") {
      return of(JSON.parse(cached)); // return cached data as observable
    }

    // No cache → call API
    return this._httpService
      ._getMethod("api/services/app/APITags/GetAllAPITagsOnTag")
      .pipe(
        map((res: any) => {
          const items = res?.result?.items || [];

          // Save to cache
          sessionStorage.setItem("APITags", JSON.stringify(items));

          return items; // return items to component
        })
      );
  }
}
