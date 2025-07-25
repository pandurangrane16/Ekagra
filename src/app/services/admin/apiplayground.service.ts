import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class apiplaygroundservice {
  constructor(
    private _httpService: HttpService,private http: HttpClient) { }

 jsonurl: string = '/assets/config/config.json';
 private baseUrl = 'https://172.19.71.112:8084/TraffServices/api';

ProjectCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Project/Create');
  }

GetAll() {
    return this._httpService._getMethod('api/services/app/ProjectAPI/GetAll');
  }

GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }


GetApiList(id:any) {
    return this._httpService._getMethod('api/services/app/ProjectAPI/GetActiveProjectAPIByProjIdAuthentication?ProjectId='+id);
  }

  CreateProjectApi(data:any) {
    return this._httpService._postMethod(data,'api/services/app/ProjectAPI/Create');
  }


   async login(username: string, password: string): Promise<string> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.baseUrl}/login`, {
          username,
          password
        })
      );

      if (!response?.token) {
        throw new Error('Login failed: token not received');
      }

      return response.token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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






Consume(
  ProjectId?: any,
  Type?: any,
  APIName?: any,
  BaseURL?: any,
  RequestURL?: any,
  HttpMethod?: any,
  RequestParam?: any,
  Header?: any,
  AuthReq?: any,
  AuthAPIId?: any,
  AuthenticatioType?: any,
  APISeq?: any,
  AuthenticationHeader?: any,
  CommType?: any,
  BodyType?: any,
  Body?: any,
  ResponseStatusCode?: any,
  Response?: any,
  IsActive?: any,
  ProjectName?: any,
  IsDeleted?: any,
  DeleterUserId?: any,
  DeletionTime?: any,
  LastModificationTime?: any,
  LastModifierUserId?: any,
  CreationTime?: any,
  CreatorUserId?: any
) {
  const params: string[] = [];

  if (ProjectId !== null && ProjectId !== undefined) {
    params.push(`ProjectId=${ProjectId}`);
  }

  if (Type !== null && Type !== undefined) {
    params.push(`Type=${Type}`);
  }

  if (APIName !== null && APIName !== undefined) {
    params.push(`APIName=${APIName}`);
  }

  if (BaseURL !== null && BaseURL !== undefined) {
    params.push(`BaseURL=${BaseURL}`);
  }

  if (RequestURL !== null && RequestURL !== undefined) {
    params.push(`RequestURL=${RequestURL}`);
  }

  if (HttpMethod !== null && HttpMethod !== undefined) {
    params.push(`HttpMethod=${HttpMethod}`);
  }

  if (RequestParam !== null && RequestParam !== undefined) {
    params.push(`RequestParam=${RequestParam}`);
  }

  if (Header !== null && Header !== undefined) {
    params.push(`Header=${Header}`);
  }

  if (AuthReq !== null && AuthReq !== undefined) {
    params.push(`AuthReq=${AuthReq}`);
  }

  if (AuthAPIId !== null && AuthAPIId !== undefined) {
    params.push(`AuthAPIId=${AuthAPIId}`);
  }

  if (AuthenticatioType !== null && AuthenticatioType !== undefined) {
    params.push(`AuthenticatioType=${AuthenticatioType}`);
  }

  if (APISeq !== null && APISeq !== undefined) {
    params.push(`APISeq=${APISeq}`);
  }

  if (AuthenticationHeader !== null && AuthenticationHeader !== undefined) {
    params.push(`AuthenticationHeader=${AuthenticationHeader}`);
  }

  if (CommType !== null && CommType !== undefined) {
    params.push(`CommType=${CommType}`);
  }

  if (BodyType !== null && BodyType !== undefined) {
    params.push(`BodyType=${BodyType}`);
  }

  if (Body !== null && Body !== undefined) {
    params.push(`Body=${Body}`);
  }

  if (ResponseStatusCode !== null && ResponseStatusCode !== undefined) {
    params.push(`ResponseStatusCode=${ResponseStatusCode}`);
  }

  if (Response !== null && Response !== undefined) {
    params.push(`Response=${Response}`);
  }

  if (IsActive !== null && IsActive !== undefined) {
    params.push(`IsActive=${IsActive}`);
  }

  if (ProjectName !== null && ProjectName !== undefined) {
    params.push(`ProjectName=${ProjectName}`);
  }

  if (IsDeleted !== null && IsDeleted !== undefined) {
    params.push(`IsDeleted=${IsDeleted}`);
  }

  if (DeleterUserId !== null && DeleterUserId !== undefined) {
    params.push(`DeleterUserId=${DeleterUserId}`);
  }

  if (DeletionTime !== null && DeletionTime !== undefined) {
    params.push(`DeletionTime=${DeletionTime}`);
  }

  if (LastModificationTime !== null && LastModificationTime !== undefined) {
    params.push(`LastModificationTime=${LastModificationTime}`);
  }

  if (LastModifierUserId !== null && LastModifierUserId !== undefined) {
    params.push(`LastModifierUserId=${LastModifierUserId}`);
  }

  if (CreationTime !== null && CreationTime !== undefined) {
    params.push(`CreationTime=${CreationTime}`);
  }

  if (CreatorUserId !== null && CreatorUserId !== undefined) {
    params.push(`CreatorUserId=${CreatorUserId}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/ProjectAPI/Consume${queryString}`;

  return this._httpService._getMethod(url);
}


  

}
