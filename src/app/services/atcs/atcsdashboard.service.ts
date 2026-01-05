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

GetUnprocessedConnectedCtrlData(fromDate?: string, toDate?: string, zoneIds?: number[]): Observable<any> {
  const params: string[] = [];

  // Add Date filters if provided
  if (fromDate) {
    params.push(`from=${encodeURIComponent(fromDate)}`);
  }
  if (toDate) {
    params.push(`to=${encodeURIComponent(toDate)}`);
  }

  // Handle multiple zoneIds as shown in your curl: ?zoneIds=60&zoneIds=61
  if (zoneIds && zoneIds.length > 0) {
    zoneIds.forEach((id: number) => {
      params.push(`zoneIds=${encodeURIComponent(id.toString())}`);
    });
  }

  // Join parameters with '&' and prepend '?' if any exist
  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ATCSGraph/GetUnprocessedConnectedCtrlData${queryString}`;

  return this._httpService._getMethod(url);
}

getFailureData(fromDate?: string, toDate?: string, zoneIds?: number[]): Observable<any> {
  const params: string[] = [];

  // Add Date filters if provided
  if (fromDate) {
    params.push(`fromDate=${encodeURIComponent(fromDate)}`);
  }
  if (toDate) {
    params.push(`toDate=${encodeURIComponent(toDate)}`);
  }

  // Handle multiple zoneIds as shown in your curl: ?zoneIds=60&zoneIds=61
  if (zoneIds && zoneIds.length > 0) {
    zoneIds.forEach((id: number) => {
      params.push(`zoneIds=${encodeURIComponent(id.toString())}`);
    });
  }

  // Join parameters with '&' and prepend '?' if any exist
  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ATCSGraph/getJunctionFailureData${queryString}`;

  return this._httpService._getMethod(url);
}

startBroadcast(audioFileName: string, paNames: string): Observable<any> {
  const params: string[] = [];

if (audioFileName) {
    // Removed encodeURIComponent to send the raw string (e.g., "Audio 5")
    params.push(`AudioFileName=${audioFileName}`);
  }

  if (paNames) {
    // Matches "paNames" key from Swagger
    params.push(`paNames=${encodeURIComponent(paNames)}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/PAGraph/StartAnnouncementOnPaName${queryString}`;

  // Fix: Pass an empty string "" instead of an empty object {} 
  // to satisfy the 'string' parameter requirement
  return this._httpService._postMethod(url, "");
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

  getCycleTimeData(zoneIds: number[], fromDate: string, toDate: string): Observable<any> {
  const params: string[] = [];

  // Repeated zoneIds parameters: ?zoneIds=60&zoneIds=61
  if (zoneIds && zoneIds.length > 0) {
    zoneIds.forEach(id => {
      params.push(`zoneIds=${encodeURIComponent(id.toString())}`);
    });
  }

  if (fromDate) params.push(`fromDate=${encodeURIComponent(fromDate)}`);
  if (toDate) params.push(`toDate=${encodeURIComponent(toDate)}`);

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ATCSGraph/getCycleTimeData${queryString}`;

  return this._httpService._getMethod(url);
}

GetActiveSitesbyZoneAndProject(zoneIds?: number[], projectIds?: number[]): Observable<any> {
  const params: string[] = [];


  if (zoneIds && zoneIds.length > 0) {
    zoneIds.forEach((id: number) => {
      params.push(`zoneIds=${encodeURIComponent(id.toString())}`);
    });
  }

  
  if (projectIds && projectIds.length > 0) {
    projectIds.forEach((id: number) => {
      params.push(`projectIds=${encodeURIComponent(id.toString())}`);
    });
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  

  const url = `api/services/app/Site/GetActiveSitesbyZoneAndProject${queryString}`;

  return this._httpService._getMethod(url);
}

getCongestionData( fromDate: string, toDate: string,zoneIds: number[],): Observable<any> {
  const params: string[] = [];

  if (fromDate) params.push(`fromDate=${encodeURIComponent(fromDate)}`);
  if (toDate) params.push(`toDate=${encodeURIComponent(toDate)}`);

  if (zoneIds && zoneIds.length > 0) {
    zoneIds.forEach((id: number) => {
      params.push(`zoneIds=${encodeURIComponent(id.toString())}`);
    });
  }


  const queryString = params.length ? '?' + params.join('&') : '';
  

  const url = `api/services/app/ATCSGraph/getCongestionData${queryString}`;

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

      GetAllZones() {
    return this._httpService._getMethod('api/services/app/Zone/GetZoneListByUserId');
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
