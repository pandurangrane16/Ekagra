import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class RuleEngineService {

  constructor(private _httpService : HttpService) { }

  jsonurl: string = '/assets/config/config.json';

  getRuleConditions(){
    return this._httpService._getRuleConditions();
  }
  setRulesStorage(){
    return this._httpService._setRuleConditions();
  }

  GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }

    GetPolicyList() {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetPolicytList');
  }
  CreateRuleEngine(data:any) {
    return this._httpService._postMethod(data,'api/services/app/RuleEngine/Create');
  }

    EditRuleEngine(data:any) {
    return this._httpService._putMethod(data,'api/services/app/RuleEngine/Update');
  }
    GetRolesOnId() {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetRolesOnId');
  }

     Getfields(id:any) {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetProjectFieldsOnApiId?Id='+id);
  }
       GetApis(id:any) {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetActiveAPIListByProjectid?id='+id);
  }

         GetDataById(id:any) {
    return this._httpService._getMethod('api/services/app/RuleEngine/Get?Id='+id);
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

CheckPolicyNameExist(
  PolicyName?: any,
  Id?: any,
 
) {
  let params: string[] = [];

  if (PolicyName !== null && PolicyName !== undefined) {
    params.push(`PolicyName=${PolicyName}`);
  }


  if (Id !== null && Id !== undefined) {
    params.push(`Id=${Id}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/RuleEngine/CheckPolicyNameExist${queryString}`;

  return this._httpService._postMethod(null,url);
}



}
