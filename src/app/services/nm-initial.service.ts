import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import constants from '../constants/constants';
import { GetTokenDetailsResponse } from '../types/TokenType';
import { TokenService } from './token.service';
import { SdkService } from './sdk.service';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class NmInitialService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private engagesdkCallbackService: SdkService,
    private route: Router,
    private dataService: DataService
  ) { }

  token: string | null = '';
  request: any = [];

  getTokenDetailsResponse!: GetTokenDetailsResponse;

  getTokenData() {
    const apiUrl = constants.getTokenDetails;
    let headers = new HttpHeaders()
    const url = window.location.href;
    this.getUserNameFromUrl(url);
    // this.getDataFromUrl();
    this.token = this.tokenService.getJwtFromUrl(url);

    if (this.token) {
      this.tokenService.setJwtToken(this.token);
      headers = headers.set('Authorization', 'Bearer ' + this.token);
      const data = {
        "authorization": 'Bearer ' + this.token
      }

      this.http.post<GetTokenDetailsResponse>(apiUrl, data, { headers: headers })
        .subscribe({
          next: (response) => {
            this.getTokenDetailsResponse = response
            this.handleApiResponse(response);
            // this.createUser();
            this.dataService.isEntryLoaderActive.next(true);
            setTimeout(() => {
              this.dataService.isEntryLoaderActive.next(false);
            }, 2000);
          },
          error: (e) => {
            this.handleApiError(e);
          },
          complete: () => {
          }
        });
    }
    else {
      this.handleMissingToken();
    }


  }

  handleApiError(error: any) {
    const url = this.tokenService.getUrlWithoutToken();
    this.engagesdkCallbackService.closeWebview()
  }

  handleMissingToken() {
    var url = this.tokenService.getUrlWithoutToken()
    this.engagesdkCallbackService.closeWebview();
    this.engagesdkCallbackService.informationNeeded('LoginNeeded', url);
  }

  checkStateAndConstituency(constituencyLocal: string) {

    if (!constituencyLocal) {
      this.handleMissingConstituency();
    } else {
      // console.log("redirecting to main");
      this.route.navigate(['main'])
    }
  }

  handleMissingConstituency() {
    const url = this.tokenService.getUrlWithoutToken();
    if ((window as any).android && (window as any).android.__externalCall) {
      this.engagesdkCallbackService.informationNeeded('constituency', url);
    }
    else {
      this.engagesdkCallbackService.closeWebview();
      this.engagesdkCallbackService.informationNeeded('constituency', url);
    }
  }

  handleApiResponse(response: GetTokenDetailsResponse) {
    this.tokenService.setUserDetails(response);
    this.tokenService.setUserID(response.uniqueID);
    sessionStorage.setItem("username", response.username);
    this.dataService.setUsername(response.username)
    sessionStorage.setItem("userId", response.uniqueID);
    sessionStorage.setItem("state", response.state);
    this.dataService.setState(response.state)
    sessionStorage.setItem("constituency", response.constituency);
    this.dataService.setConsti(response.constituency)
    sessionStorage.setItem("userType", response.usertype);
    sessionStorage.setItem("image", response.image);
    if (this.token) {
      sessionStorage.setItem("token", this.token)
    }
    // sessionStorage.setItem("mobile", response.mobileno);
    this.checkStateAndConstituency(response.constituency);
  }

  // createUser() {
  //   //API to create user in initial load to fetch Profile details in 'getProfileDetails' API
  //   const apiUrl = constants.createUser;
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Authorization', 'Bearer ' + this.token);
  //   const data = {
  //     "authorization": 'Bearer ' + this.token
  //   }

  //   this.http.post(apiUrl, data, { headers: headers }).subscribe({
  //     next: () => {
  //       this.getUserDetails()
  //     },
  //     error: () => {
  //     }
  //   })
  // }

  // getUserDetails() {
  //   const apiUrl = constants.getUserDetails;
  //   let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);

  //   this.http.get(apiUrl, { headers: headers }).subscribe({
  //     next: (res: any) => {
  //       if (res.statusCode === 200) {
  //         const activityData = res.result.activityData;

  //         // Extract activity data
  //         const activityIdToFind = this.dataService.homeActivityId;
  //         // const activityIdToFind = 11;
  //         const selectedActivity = activityData.find((activity: any) => activity.activityId == activityIdToFind);

  //         if (selectedActivity) {
  //           console.log("Activity found:", selectedActivity);
  //           //attempt
  //           this.dataService.attemptGUD = selectedActivity.attempt
  //           this.dataService.maxAttemptGUD = selectedActivity.maxAttempt
  //           //share
  //           this.dataService.thankYouShare = selectedActivity.thankYouShare
  //           this.dataService.maxThankYouShare = selectedActivity.maxThankYouShare
  //           // Redirect to instruction page
  //         } else {
  //           console.log("Activity not found.");
  //         }
  //         this.handleApiResponse(this.getTokenDetailsResponse);
  //       }
  //     },
  //     error: (e) => {
  //       console.error(e);
  //     }
  //   });
  // }

  getUserNameFromUrl(url: string) {
    const currentUrl = window.location.href;
    const urlSearchParams = new URLSearchParams(currentUrl.split('?')[1]);
    let username = urlSearchParams.get('userName');
    if (username) {
      //coming from wall
      // this.dataService.showHelper.next(false);
      // this.dataService.blockSwipeGestures.next(false);
      this.dataService.setUsername(decodeURIComponent(username));
    }
    // window.alert(this.dataService.getUsername() + " NM Initial")
    let source = urlSearchParams.get('source');
    if (source) {
      this.dataService.homeSource = source;
    }
  }

  getDataFromUrl() {
    const currentUrl = window.location.href;
    const urlSearchParams = new URLSearchParams(currentUrl.split('?')[1]);
    let source = urlSearchParams.get('source');
    let id = urlSearchParams.get('id');
    let quizId = urlSearchParams.get('quizId');
    let activityId = urlSearchParams.get('activityId');
    let questId = urlSearchParams.get('questId');
 
    if (source) {
      this.dataService.homeSource = source;
    }
    if (id) {
      this.dataService.homeId = id;
    }
    if (quizId) {
      this.dataService.homeQuizId = quizId;
    }
    if (activityId) {
      this.dataService.homeActivityId = activityId;
    }
    if (questId) {
      this.dataService.homeQuestId = questId;
    }
  }

}
