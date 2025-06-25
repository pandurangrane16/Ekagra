import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class mapconfigservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

MapCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Map/Create');
  }



GetAll() {
    return this._httpService._getMethod('api/services/app/Map/GetAll');
  }

  
  GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }
}
