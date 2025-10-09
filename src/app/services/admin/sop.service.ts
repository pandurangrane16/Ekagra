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



   GetSOPActionMasterbySOPId(id:any) {
    return this._httpService._getMethod('api/services/app/SOPAction/GetSOPActionMasterbySOPId?Id='+id);
  }


 SOPConfigCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/SOPConfig/Create');
  }

   SOPConfigUpdate(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/SOPConfig/Update');
  }
    SOPActionUpdate(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/SOPAction/Update');
  }

 SOPActionCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/SOPAction/Create');
  }

   SOPConfigDelete(id: any) {
    return this._httpService._deleteMethod( 'api/services/app/SOPConfig/Delete?Id='+id);
  }

   SOPActionDelete(id: any) {
    return this._httpService._deleteMethod('api/services/app/SOPAction/DeleteSOPActionsBySOPConfigId?sopConfigId='+id);
  }

      GetPolicyList_all() {
    return this._httpService._getMethod('api/services/app/RuleEngine/GetPolicytList');
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


CheckSOPNameExist(SOPName?: string, Id?: number | string) {
  let params: string[] = [];

  if (SOPName !== null && SOPName !== undefined) {
    params.push(`SOPName=${encodeURIComponent(SOPName.toString().trim())}`);
  }

  if (Id !== null && Id !== undefined && Id.toString().trim() !== '') {
    params.push(`Id=${encodeURIComponent(Id.toString().trim())}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/SOPConfig/CheckSOPNameExist${queryString}`;

  return this._httpService._postMethod(null, url);
}


  







}
