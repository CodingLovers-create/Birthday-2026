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
    if (!this.apiUrl || typeof this.apiUrl !== 'string') {
      return;
    }
    const token = this.tokenService.getJwtToken();
    // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWR0eXBlIjoidXVpZCIsIndoaXRlbGlzdCI6Ik4iLCJ1c2VyaWR2YWx1ZSI6IllFQVdsOUVzbFNiWERDUVVCQkUrelE9PSIsInVzZXJpZCI6IjgwOTQ2ZjZkNTE2N2M2ZjZmYTJjZDU3ZjNjNjQ3Y2E0Njg5ODhmNGZjYjRkZTFjMWEwNTM2ZTU2MzAzYzdiNDUiLCJleHAiOjE2OTY1Nzg2MTIsImRhdGEiOiJzVUpCeHhxakpLXC9WT2daR2hEY2tnTmc3b2FKZUVVMitFTTlTaUE4NVV2SFBOUGwrbTFuWU1rQXBOQWhDK2dEbVJMRFdNNWJSSFl3bmNcL1hNS1dYQ3daVWVrekJMNE10OE9SUFwvMFpIRlo0dnhqdHptMGFBUDJsUDFkVWNGNDZJUnBLYjBcL1llVnFnZHZUWDF1XC9uMndQNTB5NWF0S3RPVVwvMkx4dGFJMHQyNmlydWMxXC9EMWVpVkpqTjV5dGJ6ZlBsM3lzenI5Q1pZcjVGeVJXV2VMU0pEVDNBNzRYU1J4Y2h5OXpwV3FpQXI0Q3MzWEVRcUdsN3F0d1VIdXBseW5Ya002dW11XC9ZRUtLNjBjdXc4aWZKUUtwWHBMa1YyRVNGT2JTRlU1cVJPV1V3SEVKRWR5OFR1dDlJTUo2RG42TXVySStuRW9vWTlGcWlBRHhQeno4SWJcL3pLY2VtZ1g5WUJpcEtWYWMxczdKSm5Da2p3MkhCalk4MklsaHZycWN5clcifQ.n7r75hXW7KkqXkYHPnKCD5P8myY7UhG1rnRCA3_Jwkw";
    
    let headers = new HttpHeaders()
      headers = headers.set('Authorization', 'Bearer ' + token);

      function getOs() {
        if (navigator.userAgent.match(/Android/i)) {
          return "android";
        }
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
          return "ios";
        }
        return "others";
      };
      const deviceOs =getOs();

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
      }
  
      this.http.post(this.apiUrl, requestData, { headers: headers , responseType: 'text'})
        .subscribe(
          {
            next: (response) => {
              // console.log('submitAudit successful!');
            },
            error: (error) => {
              console.log(error);
              console.log('submitAudit failed!');
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
    const backTime = Date.now();
    const timeSpent = backTime - entryTime;

    return timeSpent;
  }
}
