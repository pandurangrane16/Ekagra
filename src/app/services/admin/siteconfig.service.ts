import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class siteconfigservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

SiteCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Site/Create');
  }

  LocationCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Location/Create');
  }

  SiteEdit(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/Site/Update');
  }



GetAll(MaxResultCount: number, SkipCount: number,) {
    return this._httpService._getMethod('api/services/app/Site/GetAllSiteMasterPage?MaxResultCount='+MaxResultCount+'&SkipCount='+SkipCount);
  }

  GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }

  GetLocationByPincode( Pincode: number) {
    return this._httpService._getMethod('api/services/app/Location/GetLocationByPincode?Pincode='+Pincode);
  }

    GetLocationbyLocationId( Locationid: number) {
    return this._httpService._getMethod('api/services/app/Location/GetLocationbyLocationId?LocationId='+Locationid);
  }




GetFilteredList(
  ProjectId?: number,
  filter?: string,
  status?: boolean,
  maxResultCount?: number,
  skipCount?: number
) {
  let params: string[] = [];

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
  const url = `api/services/app/Site/GetAllSiteMasterPage${queryString}`;

  return this._httpService._getMethod(url);
}





}
