import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserHierarchyService {

  constructor(private _httpService : HttpService) { }

  jsonurl: string = '/assets/config/config.json';

  GetUserList() {
    return this._httpService._getMethod('api/services/app/UserHierarchy/GetEmployeeName');
  }

   Create(data:any) {
    return this._httpService._postMethod(data,'api/services/app/UserHierarchy/Create');
  }

     Update(id:any,data:any) {
    return this._httpService._putMethod(data,'api/services/app/UserHierarchy/Update?id='+id);
  }

   GetManagerList() {
    return this._httpService._getMethod('api/services/app/UserHierarchy/GetManagerName');
  }


       GetApis(id:any) {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetActiveAPIListByProjectid?id='+id);
  }
   GetList() {
    return this._httpService._getMethod('api/services/app/UserHierarchy/GetAllUserHierachyMasterPage');
  }
   GetAll(

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
  const url = `api/services/app/UserHierarchy/GetAllUserHierachyMasterPage${queryString}`;

  return this._httpService._getMethod(url);
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
  const url = `api/services/app/UserHierarchy/GetUserHierarchyExcludingNullManagers${queryString}`;

  return this._httpService._getMethod(url);
}




}
