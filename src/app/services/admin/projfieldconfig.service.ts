import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class projfieldconfigservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ProjectfieldCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/ProjectField/Create');
  }

  ProjectfieldEdit(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/ProjectField/Update');
  }



GetAll(MaxResultCount: number, SkipCount: number,) {
    return this._httpService._getMethod('api/services/app/ProjectField/GetAllProjectFieldMasterPage?MaxResultCount='+MaxResultCount+'&SkipCount='+SkipCount);
  }

  GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
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
  const url = `api/services/app/ProjectField/GetAllProjectFieldMasterPage${queryString}`;

  return this._httpService._getMethod(url);
}

CheckMapLabel(
  ProjectId?: number,
  MapLabel?: string,
  id?: number,

) {
  let params: string[] = [];

  if (ProjectId !== null && ProjectId !== undefined) {
    params.push(`ProjectId=${ProjectId}`);
  }

  if (MapLabel !== null && MapLabel !== undefined) {
    params.push(`MapLabel=${MapLabel}`);
  }



  if (id !== null && id !== undefined) {
    params.push(`id=${id}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ProjectField/CheckProjectNameAndMapLabelExist${queryString}`;

  return this._httpService._postMethod(null,url);
}


  Delete(id: any) {
    return this._httpService._deleteMethod('api/services/app/ProjectField/Delete?Id='+id);
  }




}
