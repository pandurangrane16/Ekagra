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

}
