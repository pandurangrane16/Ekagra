import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class alertservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ProjectfieldCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/ProjectField/Create');
  }

  GetAllUsers() {
    return this._httpService._getMethod('api/services/app/Alert/GetAllUsers');
  }

    TransferSOP(data:any) {
    return this._httpService._postMethod(data,'api/services/app/Alert/TransferSOP');
  }



GetFilteredList(
  FromTime?: any,
  ToTime?: any,
  Type?: any,
  Filter?:any,
  maxResultCount?: number,
  skipCount?: number
) {
  let params: string[] = [];

  if (FromTime !== null && FromTime !== undefined) {
    params.push(`FromTime=${FromTime}`);
  }
    if (ToTime !== null && ToTime !== undefined) {
    params.push(`ToTime=${ToTime}`);
  }
      if (Type !== null && Type !== undefined) {
    params.push(`Type=${Type}`);
  }

  if (Filter !== null && Filter !== undefined && Filter.trim() !== '') {
    params.push(`Filter=${encodeURIComponent(Filter)}`);
  }



  if (maxResultCount !== null && maxResultCount !== undefined) {
    params.push(`MaxResultCount=${maxResultCount}`);
  }

  if (skipCount !== null && skipCount !== undefined) {
    params.push(`SkipCount=${skipCount}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Alert/GetAllAlertsPage${queryString}`;

  return this._httpService._getMethod(url);
}






}
