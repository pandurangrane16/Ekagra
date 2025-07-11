import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class apiplaygroundservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ProjectCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Project/Create');
  }

GetAll() {
    return this._httpService._getMethod('api/services/app/ProjectAPI/GetAll');
  }

GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }

  GetProjectType() {
    return this._httpService._getMethod('api/services/app/PrmGlobal/GetAllGlobalValues?Module=Global&unit=ProjectAPI');
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
  ProjectType?:any,
  Search?: string,
  status?: boolean,
  maxResultCount?: number,
  skipCount?: number
) {
  let params: string[] = [];

  if (ProjectId !== null && ProjectId !== undefined) {
    params.push(`ProjectId=${ProjectId}`);
  }

    if (ProjectType !== null && ProjectType !== undefined) {
    params.push(`ProjectType=${ProjectType}`);
  }

  if (Search !== null && Search !== undefined && Search.trim() !== '') {
    params.push(`Search=${encodeURIComponent(Search)}`);
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
  const url = `api/services/app/ProjectAPI/GetAllProjectAPIMasterPage${queryString}`;

  return this._httpService._getMethod(url);
}


  

}
