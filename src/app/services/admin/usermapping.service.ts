import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserMappingService {
  constructor(
    private _httpService: HttpService,
  private http: HttpClient) { }

 jsonurl: string = '/assets/config/config.json';

getKeysDataForConfig(key: string): Observable<any> {
  return this.http.get('/assets/config/config.json').pipe(
    map((config: any) => config[key])
  );
}


   GetUserList() {
    return this._httpService._getMethod('api/services/app/Alert/GetAllUsers');
  }

     GetZoneList() {
    return this._httpService._getMethod('api/services/app/Zone/GetZoneListByUserId');
  }

      GetRoleList(data:any) {
         
    return this._httpService._postMethod(data,'api/services/app/Role/GetRoles');
  }



 

ProjectCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Project/Create');
  }


  Create(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/UserZoneMapping/Create');
  }
GetAll() {
    return this._httpService._getMethod('api/services/app/Project/GetAll');
  }

GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }
UploadFile(formData: FormData) {
  return this._httpService._postMethod( formData,'api/services/app/FileUpload/UploadIcon');
}


    ProjectEdit(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/Project/Update');
  }

  Delete(id: number) {
    return this._httpService._deleteMethod('api/services/app/Project/Delete?Id='+id);
  }

CheckProjectName(
  projectName?: any,
  Id?: any,
 
) {
  let params: string[] = [];

  if (projectName !== null && projectName !== undefined) {
    params.push(`projectName=${projectName}`);
  }


  if (Id !== null && Id !== undefined) {
    params.push(`Id=${Id}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Project/CheckProjectNameExist${queryString}`;

  return this._httpService._postMethod(null,url);
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
  const url = `api/services/app/Project/GetAllProjectPage${queryString}`;

  return this._httpService._getMethod(url);
}


  

}
