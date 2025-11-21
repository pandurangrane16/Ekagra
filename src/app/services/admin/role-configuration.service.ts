import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoleConfigurationService {
 constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';


GetRoles(_data: any) {
    return this._httpService._getMethod(_data,'api/services/app/Role/GetRoles');
  }

  GetRoleForEdit(Id: number) {
    return this._httpService._getMethod('api/services/app/Role/GetRoleForEdit?Id='+Id);
  }

  CreateOrUpdateRole(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Role/RoleCreate');
  }
  DeleteRole(userid:any,Id: number) {
      return this._httpService._deleteMethod('api/services/app/Role/RoleSoftDelete?id='+Id+'&DeleterUsrId='+userid);
    }


  GetAllRoles() {
    return this._httpService._getMethod('api/services/app/Role/GetAllRoles');
  }

GetFilteredList(
  filter?: string,
  maxResultCount?: number,
  skipCount?: number
) {
  let params: string[] = [];

  if (filter !== null && filter !== undefined && filter.trim() !== '') {
    params.push(`Filter=${encodeURIComponent(filter)}`);
  }

  if (maxResultCount !== null && maxResultCount !== undefined) {
    params.push(`MaxResultCount=${maxResultCount}`);
  }

  if (skipCount !== null && skipCount !== undefined) {
    params.push(`SkipCount=${skipCount}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Role/GetAllRolesPage${queryString}`;

  return this._httpService._getMethod(url);
}



CheckRoleNameExists(
  Name?: string,
  Id?: number
) {
  let params: string[] = [];

  if (Name !== null && Name !== undefined) {
    params.push(`Name=${Name}`);
  }

  if (Id !== null && Id !== undefined) {
    params.push(`Id=${Id}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Role/GetAllRolesPage${queryString}`;

  // return this._httpService._getMethod(url);
  return this._httpService._postMethod({}, url);
}



//   GetFilteredList(
//   ProjectId?: number,
//   filter?: string,
//   status?: boolean,
//   maxResultCount?: number,
//   skipCount?: number,
//   MapId? :number
// ) {
//   let params: string[] = [];

//   if (ProjectId !== null && ProjectId !== undefined) {
//     params.push(`ProjectId=${ProjectId}`);
//   }

//   if (filter !== null && filter !== undefined && filter.trim() !== '') {
//     params.push(`Filter=${encodeURIComponent(filter)}`);
//   }

//   if (status !== null && status !== undefined) {
//     params.push(`IsActive=${status}`);
//   }

//   if (maxResultCount !== null && maxResultCount !== undefined) {
//     params.push(`MaxResultCount=${maxResultCount}`);
//   }

//   if (skipCount !== null && skipCount !== undefined) {
//     params.push(`SkipCount=${skipCount}`);
//   }
//     if (MapId !== null && MapId !== undefined) {
//     params.push(`MapId=${MapId}`);
//   }


//   const queryString = params.length ? '?' + params.join('&') : '';
//   const url = `api/services/app/Map/GetAllMapMasterPage${queryString}`;

//   return this._httpService._getMethod(url);
// }







}
