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
    return this._httpService._getMethod('api/services/app/Zone/GetZoneListOnProjectId');
  }

      GetRoleList() {
         
    return this._httpService._getMethod('api/services/app/Role/GetAllRoles');
  }

       GetRoleByCategory(type:any) {
         
    return this._httpService._getMethod('api/services/app/Role/GetRolesOnCategory?Category='+type);
  }




 

ProjectCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Project/Create');
  }


  Create(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/UserZoneMapping/Create');
  }


  
  Update(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/UserZoneMapping/Update');
  }
GetAll() {
    return this._httpService._getMethod('api/services/app/UserZoneMapping/GetAll');
  }

GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }
     GetCategoryList() {
    return this._httpService._getMethod('api/services/app/PrmGlobal/GetAllGlobalValues?Module=Global&unit=RoleCategory');
  }


  GetById(id:any) {
    return this._httpService._getMethod('api/services/app/UserZoneMapping/Get?Id='+id);
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

  maxResultCount?: number,
  skipCount?: number
) {
  let params: string[] = [];

 


  if (maxResultCount !== null && maxResultCount !== undefined) {
    params.push(`MaxResultCount=${maxResultCount}`);
  }

  if (skipCount !== null && skipCount !== undefined) {
    params.push(`SkipCount=${skipCount}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/UserZoneMapping/GetAll${queryString}`;

  return this._httpService._getMethod(url);
}

// GetUserMappingList(
//   StartDate?: string,
//   EndDate?: string,
//   SiteName?: string,
//   ProjectId?: number,
//   Type?: string,
//   IsActive?: number,
//   Filter?: string,
//   Sorting?: string,
//   MaxResultCount?: number,
//   SkipCount?: number
// ) {
//   debugger;
//   let params: string[] = [];

//   if (StartDate) {
//     params.push(`StartDate=${encodeURIComponent(StartDate)}`);
//   }

//   if (EndDate) {
//     params.push(`EndDate=${encodeURIComponent(EndDate)}`);
//   }

//   if (SiteName) {
//     params.push(`SiteName=${encodeURIComponent(SiteName)}`);
//   }

//   if (ProjectId !== null && ProjectId !== undefined) {
//     params.push(`ProjectId=${ProjectId}`);
//   }

//   if (Type) {
//     params.push(`Type=${encodeURIComponent(Type)}`);
//   }

//   if (IsActive !== null && IsActive !== undefined) {
//     params.push(`IsActive=${IsActive}`);
//   }

//   if (Filter && Filter.trim() !== '') {
//     params.push(`Filter=${encodeURIComponent(Filter)}`);
//   }

//   if (Sorting) {
//     params.push(`Sorting=${encodeURIComponent(Sorting)}`);
//   }

//   if (MaxResultCount !== null && MaxResultCount !== undefined) {
//     params.push(`MaxResultCount=${MaxResultCount}`);
//   }

//   if (SkipCount !== null && SkipCount !== undefined) {
//     params.push(`SkipCount=${SkipCount}`);
//   }

//   const queryString = params.length ? '?' + params.join('&') : '';
//   const url = `api/services/app/UserZoneMapping/GetAllUserZonemappingPage${queryString}`;

//   return this._httpService._getMethod(url);
// }

GetUserMappingList(
  StartDate?: string,
  EndDate?: string,
  SiteName?: string,
  ProjectId?: number,
  Type?: string,
  IsActive?: boolean | null,
  Filter?: string,
  Sorting?: string,
  MaxResultCount?: number,
  SkipCount?: number
) {
  debugger;

  let params: string[] = [];

  // ---- DATE ----
  if (StartDate) params.push(`StartDate=${encodeURIComponent(StartDate)}`);
  if (EndDate) params.push(`EndDate=${encodeURIComponent(EndDate)}`);

  // ---- STRINGS ----
  if (SiteName) params.push(`SiteName=${encodeURIComponent(SiteName)}`);
  if (Type) params.push(`Type=${encodeURIComponent(Type)}`);
  if (Filter && Filter.trim() !== '')
    params.push(`Filter=${encodeURIComponent(Filter)}`);
  if (Sorting) params.push(`Sorting=${encodeURIComponent(Sorting)}`);

  // ---- NUMBERS ----
  if (ProjectId !== undefined && ProjectId !== null)
    params.push(`ProjectId=${ProjectId}`);

  if (MaxResultCount !== undefined && MaxResultCount !== null)
    params.push(`MaxResultCount=${MaxResultCount}`);

  if (SkipCount !== undefined && SkipCount !== null)
    params.push(`SkipCount=${SkipCount}`);

  // ---- BOOLEAN (converted to 1 / 0) ----
  if (IsActive !== undefined && IsActive !== null) {
    params.push(`IsActive=${IsActive ? 1 : 0}`);
  }

  // ---- FINAL URL ----
  const queryString = params.length ? '?' + params.join('&') : '';
  const url =
    `api/services/app/UserZoneMapping/GetAllUserZonemappingPage` +
    queryString;

  console.log('Final API URL => ', url);

  return this._httpService._getMethod(url);
}

GetRoleCategeoryOnUserId(

  UserId?: number
) {
  let params: string[] = [];

 
  if (UserId !== null && UserId !== undefined) {
    params.push(`UserId=${UserId}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/UserZoneMapping/GetRoleCategeoryOnUserId${queryString}`;

  return this._httpService._getMethod(url);
}

}
