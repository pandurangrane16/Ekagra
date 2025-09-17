import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class atcsDashboardservice {
   public loginCred =  {
    "username": "sindhu",
    "password": "1234"
};
  constructor(
    private _httpService: HttpService,  private http: HttpClient) { }

 jsonurl: string = '/assets/config/config.json';
 private baseUrl = 'https://172.19.71.112:8084/TraffServices/api/login';
 private baseurl2 ='https://172.19.71.112:8084/TraffServices/rest/controller/getControllerStatus?siteId='

//  _postMethod(_object: any, _appendUrl: string, options?: any): Observable<any> {
//     return this.http.post(this.baseUrl+"/api/login", this.loginCred);
//   }


login(): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(this.baseUrl, this.loginCred);
}

sitedata(id: any, headers: any) {
  return this.http.get(`${this.baseurl2}${id}`, headers);
}

getUnprocessedConnectedCtrlData(zones: string[], from?: string, to?: string): Observable<any> {
  const params: string[] = [];

  if (zones && zones.length) {
    zones.forEach(zone => {
      params.push(`zoneName=${encodeURIComponent(zone)}`);
    });
  }

  if (from) {
    params.push(`from=${encodeURIComponent(from)}`);
  }

  if (to) {
    params.push(`to=${encodeURIComponent(to)}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ATCSGraph/GetUnprocessedConnectedCtrlData${queryString}`;

  return this._httpService._getMethod(url);
}


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


   getAlerts(fromDate?: string, toDate?: string): Observable<any> {
    const params: string[] = [];

    if (fromDate) {
      params.push(`fromDate=${encodeURIComponent(fromDate)}`);
    }

    if (toDate) {
      params.push(`toDate=${encodeURIComponent(toDate)}`);
    }

     const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ATCSGraph/getActiveAlerts${queryString}`;

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


    GetZones(id:any) {
    return this._httpService._getMethod('api/services/app/Zone/GetZoneListOnProjectId?ProjectId='+id);
  } 

    SiteResponse(data:any) {
    return this._httpService._postMethod(data,'api/services/app/ProjectAPI/SiteResponse');
  } 


//   GetSiteMasterByProjectId

    GetSiteMasterByProjectId(id: number) {
    return this._httpService._getMethod('api/services/app/Site/GetSiteMasterByProjectId?ProjectId='+id);
  }
 
  getlabels(id: number) {
    return this._httpService._getMethod('api/services/app/ProjectField/GetAllProjectFieldMasterPage?ProjectId='+id);
  }

  




//   GetProjectFieldsOnProjectIDForATCS



 


}
