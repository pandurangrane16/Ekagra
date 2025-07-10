import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class ContactConfigService {

 constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ContactCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/contact/Create');
  }
GetAll() {
    return this._httpService._getMethod('api/services/app/contact/GetAll');
  }  
  GetContactMasterById( Id: number) {
    let params: string[] = [];
     if (Id !== null && Id !== undefined) {
    params.push(`Id=${Id}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/contact/GetContactMasterById${queryString}`;

  return this._httpService._getMethod(url);
    // return this._httpService._getMethod('api/services/app/contact/GetContactMasterById');
  }

  GetDuplicateContacts(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/contact/Update');
  }

}

