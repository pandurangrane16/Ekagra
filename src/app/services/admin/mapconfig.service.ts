import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class mapconfigservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

MapCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Map/Create');
  }



GetAll() {
    return this._httpService._getMethod('api/services/app/Map/GetAll');
  }

  
  GetMapList() {
    return this._httpService._getMethod('api/services/app/Map/GetMapList');
  }

  MapEdit(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/Map/Update');
  }
  Delete(id: number) {
    return this._httpService._deleteMethod('api/services/app/Map/Delete?Id='+id);
  }
  GetFilteredList(
  ProjectId?: number,
  filter?: string,
  status?: boolean,
  maxResultCount?: number,
  skipCount?: number,
  MapId? :number
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
    if (MapId !== null && MapId !== undefined) {
    params.push(`MapId=${MapId}`);
  }


  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Map/GetAllMapMasterPage${queryString}`;

  return this._httpService._getMethod(url);
}



CheckMapExists(
  SourceURL?: string,
  Lat?: string,
  Long?: string,
  Id?: number
) {
  let params: string[] = [];

  if (SourceURL !== null && SourceURL !== undefined) {
    params.push(`SourceURL=${SourceURL}`);
  }

  if (Lat !== null && Lat !== undefined && Lat.trim() !== '') {
    params.push(`Lat=${encodeURIComponent(Lat)}`);
  }

  if (Long !== null && Long !== undefined) {
    params.push(`Long=${Long}`);
  }

  if (Id !== null && Id !== undefined) {
    params.push(`Id=${Id}`);
  }

 
  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Map/CheckMapExists${queryString}`;

  // return this._httpService._getMethod(url);
  return this._httpService._postMethod({}, url);
}



}
