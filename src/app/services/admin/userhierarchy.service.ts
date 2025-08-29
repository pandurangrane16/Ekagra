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

   GetManagerList() {
    return this._httpService._getMethod('api/services/app/UserHierarchy/GetManagerName');
  }


       GetApis(id:any) {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetActiveAPIListByProjectid?id='+id);
  }
   GetList() {
    return this._httpService._getMethod('api/services/app/UserHierarchy/GetEmployeeManagerList');
  }
 


  GetFilteredList(
  ProjectId?: number,
  filter?: string,
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
  const url = `api/services/app/RuleEngine/GetAllRuleEnginePage${queryString}`;

  return this._httpService._getMethod(url);
}




}
