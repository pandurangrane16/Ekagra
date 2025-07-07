import { Injectable, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class projconfigservice {
  constructor(
    private _httpService: HttpService) { }

 jsonurl: string = '/assets/config/config.json';

ProjectCreate(_data: any) {
    return this._httpService._postMethod(_data, 'api/services/app/Project/Create');
  }

  Delete(id: any) {
    return this._httpService._deleteMethod('api/services/app/Project/Delete?Id='+id);
  }


GetAll() {
    return this._httpService._getMethod('api/services/app/Project/GetAll');
  }
UploadFile(formData: FormData) {
  return this._httpService._postMethod(formData, 'api/services/app/FileUpload/UploadIcon');
}

GetProjectList() {
    return this._httpService._getMethod('api/services/app/Project/GetProjectList');
  }

    ProjectEdit(_data: any) {
    return this._httpService._putMethod(_data, 'api/services/app/Project/Update');
  }

  GetFilteredList(ProjectId?: number, filter?: string, status?: boolean) {
  let params: string[] = [];

  if (ProjectId !== null && ProjectId !== undefined) {
    params.push(`ProjectId=${ProjectId}`);
  }

  if (filter !== null && filter !== undefined && filter.trim() !== '') {
    params.push(`Filter=${encodeURIComponent(filter)}`);
  }

  if (status !== null && status !== undefined) {
    params.push(`IsActive=${status}`);
  }

  const queryString = params.length ? '?' + params.join('&') : '';
  const url = `api/services/app/Project/GetAllProjectPage${queryString}`;

  return this._httpService._getMethod(url);
}


  

}
