import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class projconfigservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ProjectCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Project/Create');
  }

GetAll() {
    return this._httpService._getMethod('api/services/app/Project/GetAll');
  }

GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }

<<<<<<< HEAD
    ProjectEdit(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/Project/Update');
  }



GetFilteredList(
  ProjectId?: number,
  filter?: string,
  status?: boolean,
  maxResultCount?: number,
  skipCount?: number
) {
=======
  GetFilteredList(ProjectId?: number, filter?: string, status?: boolean) {
>>>>>>> 1c24b7970766921b3cbd43fb4e7747e088943405
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
  const url = `api/services/app/Project/GetAllProjectPage${queryString}`;

  return this._httpService._getMethod(url);
}


  

}
