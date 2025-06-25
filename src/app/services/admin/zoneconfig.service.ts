import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class zoneconfigservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ZoneCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Zone/Create');
  }



GetAll() {
    return this._httpService._getMethod('api/services/app/Zone/GetAll');
  }
  
  GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }
}
