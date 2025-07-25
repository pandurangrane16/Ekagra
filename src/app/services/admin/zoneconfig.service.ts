import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class zoneconfigservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ZoneCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Zone/Create');
  }



GetAll() {
    return this._httpService._getMethod('api/services/app/Zone/GetAll');
  }
  
  GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }

 Delete(id: any) {
    return this._httpService._deleteMethod('api/services/app/Zone/Delete?Id='+id);
  }
    ZoneEdit(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/Zone/Update');
  }
  GetFilteredList(
  
  ProjectId?: number,
  filter?: string,
  status?: boolean,
  maxResultCount?: number,
  skipCount?: number,
  ZoneId?:number
) {
  let params: string[] = [];

  if (ZoneId !== null && ZoneId !== undefined) {
    params.push(`ZoneId=${ZoneId}`);
  }
  if (ProjectId !== null && ProjectId !== undefined) {
    params.push(`ProjectId=${ProjectId}`);
  }


  if (filter !== null && filter !== undefined && filter.trim() !== '') {
    params.push(`Filter=${encodeURIComponent(filter)}`);
  }

  if (status !== null && status !== undefined) {
    params.push(`IsActive=${status}`);
  }

  if (maxResultCount !== null && maxResultCount !== undefined) {
    params.push(`MaxResultCount=${maxResultCount}`);
  }

  if (skipCount !== null && skipCount !== undefined) {
    params.push(`SkipCount=${skipCount}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Zone/GetAllZoneMasterPage${queryString}`;

  return this._httpService._getMethod(url);
}





CheckZoneExists(
  ZoneName?: string,
  ProjectId?: number,
  ZoneCordinate?: string,
  Id?: number
) {
  let params: string[] = [];

  if (ZoneName !== null && ZoneName !== undefined) {
    params.push(`ZoneName=${ZoneName}`);
  }

  if (ProjectId !== null && ProjectId !== undefined) {
    params.push(`ProjectId=${encodeURIComponent(ProjectId)}`);
  }

  if (ZoneCordinate !== null && ZoneCordinate !== undefined) {
    params.push(`ZoneCordinate=${ZoneCordinate}`);
  }

  if (Id !== null && Id !== undefined) {
    params.push(`Id=${Id}`);
  }

 
  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Zone/CheckZoneExists${queryString}`;

  // return this._httpService._getMethod(url);
  return this._httpService._postMethod({}, url);
}


  
}
