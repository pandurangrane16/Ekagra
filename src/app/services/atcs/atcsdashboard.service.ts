import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class atcsDashboardservice {
  constructor(
    private _httpService: HttpService,  private http: HttpClient) { }

 jsonurl: string = '/assets/config/config.json';





  getFailureData(fromDate?: string, toDate?: string): Observable<any> {
    const params: string[] = [];

    if (fromDate) {
      params.push(`fromDate=${encodeURIComponent(fromDate)}`);
    }

    if (toDate) {
      params.push(`toDate=${encodeURIComponent(toDate)}`);
    }

     const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ATCSGraph/getJunctionFailureData${queryString}`;

    return this._httpService._getMethod(url);
  }
    getJunctioneData(siteId?:any ,fromDate?: string, toDate?: string): Observable<any> {
    const params: string[] = [];

     if (siteId) {
      params.push(`siteId=${encodeURIComponent(siteId)}`);
    }

    if (fromDate) {
      params.push(`fromDate=${encodeURIComponent(fromDate)}`);
    }

    if (toDate) {
      params.push(`toDate=${encodeURIComponent(toDate)}`);
    }

     const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ATCSGraph/getCycleTimeData${queryString}`;

    return this._httpService._getMethod(url);
  }

getKeysDataForConfig(key: string): Observable<any> {
  return this.http.get('/assets/config/config.json').pipe(
    map((config: any) => config[key])
  );
}
  GetAll() {
    return this._httpService._getMethod('api/services/app/Site/GetAll');
  }

    GetSiteMasterByProjectId(id: number) {
    return this._httpService._getMethod('api/services/app/Site/GetSiteMasterByProjectId?ProjectId='+id);
  }
  getlabels(id: number) {
    return this._httpService._getMethod('api/services/app/ProjectField/GetAllProjectFieldMasterPage?ProjectId='+id);
  }


}
