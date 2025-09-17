import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class SOPService {
// private apiUrl = 'https://172.19.32.210:8002/api/services/app/Project/GetAll';
 constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';


  GetPolicyList() {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetPolicyMasterListUnmapped');
  }
 GetActionList() {
    return this._httpService._getMethod('api/services/app/PrmGlobal/GetAllGlobalValues?Module=Global&unit=SOPAction');
  }


 SOPConfigCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/SOPConfig/Create');
  }

 SOPActionCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/SOPAction/Create');
  }

  
  GetAll() {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetAll');
  }


  GetFilteredList(
  PolicyId?: number,
  Filter?: string,
 
  maxResultCount?: number,
  skipCount?: number
) {
  let params: string[] = [];

  if (PolicyId !== null && PolicyId !== undefined) {
    params.push(`PolicyId=${PolicyId}`);
  }

  if (Filter !== null && Filter !== undefined && Filter.trim() !== '') {
    params.push(`Filter=${encodeURIComponent(Filter)}`);
  }

 

  if (maxResultCount !== null && maxResultCount !== undefined) {
    params.push(`MaxResultCount=${maxResultCount}`);
  }

  if (skipCount !== null && skipCount !== undefined) {
    params.push(`SkipCount=${skipCount}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/SOPConfig/GetAllSopConfigMasterPage${queryString}`;

  return this._httpService._getMethod(url);
}


  CheckSOPNameExist(
  SOPName?: number,
  Id?: string,
 
) {
  let params: string[] = [];

  if (SOPName !== null && SOPName !== undefined) {
    params.push(`SOPName=${SOPName}`);
  }

  if (Id !== null && Id !== undefined && Id.trim() !== '') {
    params.push(`Id=${encodeURIComponent(Id)}`);
  }
  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/SOPConfig/CheckSOPNameExist${queryString}`;

  return this._httpService._postMethod(null,url);
}

  







}
