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
  ContactUpdate(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/contact/Update');
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
GetAllContactMasterPage(Type: number, Filter:string,  maxResultCount?: number,skipCount?: number) {

  

   let params: string[] = [];
     if (name !== null && name !== undefined) {
    params.push(`Type=${Type}`);
  }
     if (Filter !== null && Filter !== undefined) {
    params.push(`Filter=${Filter}`);
  }

  if (maxResultCount !== null && maxResultCount !== undefined) {
    params.push(`MaxResultCount=${maxResultCount}`);
  }

  if (skipCount !== null && skipCount !== undefined) {
    params.push(`SkipCount=${skipCount}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/contact/GetAllContactMasterPage${queryString}`;

  return this._httpService._getMethod(url);
    }
  GetContactMasterLists(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/contact/GetContactMasterLists');
  }
    GetContactMasterSMSList(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/contact/GetContactMasterLists');
  }
  GetContactMasterEmailList(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/contact/GetContactMasterLists');
  }

  CheckContactNameExists(name: string, type:number, contact :string,id : Number)
  {
     let params: string[] = [];
     if (name !== null && name !== undefined) {
    params.push(`name=${name}`);
  }
      if (type !== null && type !== undefined) {
    params.push(`type=${type}`);
  }
     if (contact !== null && contact !== undefined) {
    params.push(`contact=${contact}`);
  }
    if (id !== null && id !== undefined) {
    params.push(`id=${id}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/contact/CheckContactNameExists${queryString}`;

  return this._httpService._getMethod(url);
  }

    Delete(id: number) {
    return this._httpService._deleteMethod('api/services/app/contact/Delete?Id='+id);
  }



}

