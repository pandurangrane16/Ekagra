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
  CreateRuleEngine(data:any) {
    return this._httpService._postMethod(data,'api/services/app/RuleEngine/Create');
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





}
