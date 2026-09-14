import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import constants from '../constants/constants';
import { DatePipe } from '@angular/common';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AuditLogsService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private dataService: DataService,
    private datePipe: DatePipe
  ) {}

  //need to update constants.audit for audit logs
  private apiUrl = constants.audit;

  submitAudit(pageTitle:string, action:string, language:string, parameters:string= "", templateId:string = "", sloganId:string = "", userName:string = "", caption:string = "", timeSpent:string = "",  uploadDuration:string = "", coinsEarned:number|null=null) {
    function getOs() {
      if (navigator.userAgent.match(/Android/i)) {
        return "android";
      }
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        return "ios";
      }
      return "others";
    };
    const deviceOs = getOs();

    const uuid = sessionStorage.getItem('userId');
    const state = sessionStorage.getItem('state');
    const constituency = sessionStorage.getItem('constituency');

    let requestData = {
        "program":"birthday_2026", //updated as per document
        "page":pageTitle,
        "userAction":action,
        "uuid":uuid,
        "device":deviceOs,
        "parameters": parameters,
        "language":language,
        "template": Number(templateId) === 0 ? null : Number(templateId),
        "pageLoadTime": timeSpent,
        "sloganId": Number(sloganId) === 0 ? null : Number(sloganId),
        "name": userName,
        "uploadDuration":uploadDuration,
        "caption": caption,
        "platform":"app",
        "state":state,
        "constituency":constituency,
        "activityNumber": this.dataService.homeActivityId,
        "coinsEarned": coinsEarned
    };

    console.log('[AuditLog]', {
      page: pageTitle,
      userAction: action,
      language: language,
      caption: caption,
      fullPayload: requestData
    });

    if (!this.apiUrl || typeof this.apiUrl !== 'string') {
      return;
    }
    const token = this.tokenService.getJwtToken();
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    this.http.post(this.apiUrl, requestData, { headers: headers , responseType: 'text'})
      .subscribe(
        {
          next: (response) => {
            console.log('[AuditLog] HTTP Success:', response);
          },
          error: (error) => {
            console.warn('[AuditLog] HTTP Request Error (handled):', error?.statusText || error);
          },
          complete: () => {
          }
        }
      );
  }

  getSessionID(){
    const currentDateAndTime =  this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const uuid = sessionStorage.getItem('userId');
    const concatenatedValue = `${currentDateAndTime}_${uuid}`;

    return concatenatedValue;
  }

  getTimeSpent(entryTime: any){
    if (!entryTime) return '0';
    const backTime = Date.now();
    const start = typeof entryTime === 'number' ? entryTime : (entryTime?.startTime || backTime);
    const timeSpent = backTime - start;

    return String(timeSpent);
  }
}
