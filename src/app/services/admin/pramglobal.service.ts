import { Injectable } from '@angular/core';
import { HttpService } from '../common/http.service';


@Injectable({
  providedIn: 'root'
})
export class PramglobalService {
 constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

PrmGlobalCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/PrmGlobal/Create');
  }

GetAll() {
    return this._httpService._getMethod('api/services/app/PrmGlobal/GetAll');
  }

GetPrmGlobalList() {
    return this._httpService._getMethod('api/services/app/PrmGlobal/GetProjectList');
  }

  GetAllGlobalValues(Module?: string, unit?: string) {
  let params: string[] = [];

  if (Module !== null && Module !== undefined) {
    params.push(`Module=${Module}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/PrmGlobal/GetAllGlobalValues${queryString}`;

  return this._httpService._getMethod(url);
}


  

}
