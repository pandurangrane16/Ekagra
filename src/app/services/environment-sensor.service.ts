import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { HttpService } from './common/http.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentSensorService {
  private apiUrl = 'https://app.aurassure.com/-/api/iot-platform/v1.1.0/clients/17143/applications/16/things/data';
  
  private headers = new HttpHeaders({
    'Access-Id': 'yD8rel2aRanyM97d',
    'Access-Key': '86vZ2xQiFVwnDjGnyh51T5FQqxFiOIf01gObyTssdtXXAmoT9NxvgXhmLhq7qa0S',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient,private _httpService: HttpService) {}


//   {
//   "ProjectId": 46,
//   "Type": "0",
//   "APIName": "things environ",
//   "BaseURL": "https://app.aurassure.com/-/api/iot-platform/v1.1.0/clients/17143/applications/16/things/data",
//   "RequestURL": "https://app.aurassure.com/-/api/iot-platform/v1.1.0/clients/17143/applications/16/things/data",
//   "HttpMethod": "post",
//   "RequestParam": "",
//   "header": "Access-Id:yD8rel2aRanyM97d;Access-Key:86vZ2xQiFVwnDjGnyh51T5FQqxFiOIf01gObyTssdtXXAmoT9NxvgXhmLhq7qa0S",
//   "AuthReq": false,
//   "AuthenticatioType": "",
//   "AuthenticationHeader": "",
//   "CommType": 0,
//   "BodyType": "JSON",
//   "Body": "{\"data_type\":\"aggregate\",\"aggregation_period\":3600,\"parameters\":[\"pm2.5\",\"pm10\",\"so2\",\"no2\",\"o3\",\"co\",\"co2\",\"temp\",\"humid\",\"rain\",\"light\",\"uvi\",\"noise\",\"aqi\"],\"parameter_attributes\":[\"value\",\"avg\"],\"things\":[24101,24093,24092,24091,24090,24089,24088,24087],\"from_time\":1753249000,\"upto_time\":1753253443}",
//   "ResponseStatusCode": "",
//   "Response": "",
//   "ProjectName": "",
//   "IsDeleted": false,
//   "DeleterUserId": "",
//   "DeletionTime": "2026-01-15T12:22:29.320Z",
//   "LastModificationTime": "2026-01-15T12:22:29.320Z",
//   "LastModifierUserId": "",
//   "CreationTime": "2026-01-15T12:22:29.320Z",
//   "CreatorUserId": ""
// }

  Consume(data:any) {
    return this._httpService._postMethod(data,'api/services/app/ProjectAPI/Consume');
  }

  getKeysDataForConfig(key: string): Observable<any> {
    return this.http.get('/assets/config/config.json').pipe(
      map((config: any) => config[key])
    );
  }


  getSensorData(fromTime: number, uptoTime: number, thingIds: number[] = [24101, 24093, 24092, 24091, 24090, 24089, 24088, 24087]): Observable<any> {
    const body = {
      data_type: 'aggregate',
      aggregation_period: 3600,
      parameters: [
        'pm2.5',
        'pm10',
        'so2',
        'no2',
        'o3',
        'co',
        'co2',
        'temp',
        'humid',
        'rain',
        'light',
        'uvi',
        'noise',
        'aqi'
      ],
      parameter_attributes: ['value', 'avg'],
      things: thingIds,
      from_time: fromTime,
      upto_time: uptoTime
    };

    return this.http.post(this.apiUrl, body, { headers: this.headers });
  }
}
