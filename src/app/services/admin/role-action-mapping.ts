import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleMappingService {
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

   GetActionList() {
    return this._httpService._getMethod('api/services/app/PrmGlobal/GetAllGlobalValues?Module=Global&unit=SOPAction');
  }

     GetZoneList() {
    return this._httpService._getMethod('api/services/app/Zone/GetZoneListByUserId');
  }

      GetRoleList() {
         
    return this._httpService._getMethod('api/services/app/Role/GetAllRoles');
  }



 

ProjectCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Project/Create');
  }


  Create(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/RoleActionMapping/Create');
  }

    Create2(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/RoleActionMapping/Create');
  }



  
  Update(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/RoleActionMapping/Update');
  }
GetAll() {
    return this._httpService._getMethod('api/services/app/RoleActionMapping/GetAll');
  }

GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }


  GetById(id:any) {
    return this._httpService._getMethod('api/services/app/RoleActionMapping/Get?Id='+id);
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


GetFilteredList2(

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
  const url = `api/services/app/RoleActionMapping/GetAll${queryString}`;

  return this._httpService._getMethod(url);
}


  CheckRoleActionMappingExist(
  roleId?: any,
  actionIds?: any,
 
) {
  let params: string[] = [];

  if (roleId !== null && roleId !== undefined) {
    params.push(`roleId=${roleId}`);
  }


  if (actionIds !== null && actionIds !== undefined) {
    params.push(`actionIds=${actionIds}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/RoleActionMapping/CheckRoleActionMappingExist${queryString}`;

  return this._httpService._postMethod(null,url);
}
    
    CheckRoleIdExists(
              roleId?: any,
              id?: any,
            
            ) {
              let params: string[] = [];

              if (roleId !== null && roleId !== undefined) {
                params.push(`roleId=${roleId}`);
              }


              if (id !== null && id !== undefined) {
                params.push(`id=${id}`);
              }

              const queryString = params.length ? '?' + params.join('&') : '';
              const url = `api/services/app/RoleActionMapping/CheckRoleIdExists${queryString}`;

              return this._httpService._postMethod(null,url);
            }

}
