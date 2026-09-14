import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';
import { Template } from '../types/Template';
import { ConfigService } from './config.service';
import { Config } from '../types/Config';
import constants from '../constants/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { FilterData } from '../types/RequestResponseTypes';
import { FilterData, FeedsListResponse, ApiResponse, UpdateSelfieStatusRequest } from '../types/RequestResponseTypes';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { LanguageCode } from '../types/LanguageTypes';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  showHelper = new BehaviorSubject<boolean>(false);
  blockSwipeGestures = new BehaviorSubject<boolean>(true);

  isUserIdSet = new BehaviorSubject<string>("N");
  image = new BehaviorSubject<string>(''); // image received from external callback
  imageBase64 = new BehaviorSubject<string>('');

  backgroundBase64 = new BehaviorSubject<string>('');
  circleBase64 = new BehaviorSubject<string>('');


  userId = "";
  isTemplatePageVisited: boolean = false;
  // templates!:Template[];
  // capturedImage:string = '';
  currentTemplate!: Template;

  currentSloganId = new BehaviorSubject<number>(1);

  currentlang = new BehaviorSubject<LanguageCode>('eng');

  currentisUserForeground = new BehaviorSubject<0|1>(0);
  currentcelebrityIDs = new BehaviorSubject<string>('1');


  currentTemplateBase64 = new BehaviorSubject<string>('');

  isWallPageVisited: boolean = false;
  // isCameraButtonClicked = new BehaviorSubject<boolean>(false);
  isCameraButtonClicked: boolean = false;

  isLoaderActive = new BehaviorSubject<boolean>(false);

  isSetIntervalRequired = new BehaviorSubject<boolean>(false);

  isPreviewIntervalRequired = new BehaviorSubject<boolean>(false);

  isPreviewCalled = new BehaviorSubject<boolean>(false);

  reportedPostId = new BehaviorSubject<number | null>(null);

  reportAction = new BehaviorSubject<"report" | "delete">('report');

  showReportedToast = new BehaviorSubject<number>(0);

  selectedTemplete = new BehaviorSubject<number>(1);

  currentRoute = new BehaviorSubject<'template' | 'createPost' | 'instructions' | 'certificate' | 'app'>('app')

  reload: boolean = false;

  reloadCreatePostPage = new BehaviorSubject<boolean>(false)

  routeTo = new BehaviorSubject<'preview' | 'createPost' | 'retake' | 'instructions' | ''>('')

  isSelectAllowed = new BehaviorSubject<boolean>(true);

  wallwhiteloader: boolean = false;

  apiResponseImage = new BehaviorSubject<string>(''); //python API

  apiResponseError = new BehaviorSubject<string>(''); //python API - Producer Error Message

  apiResponseErrorID = new BehaviorSubject<number | null>(null);  //python API  - Producer Error ID

  isPerfectImageShowError = new BehaviorSubject<boolean>(false); //python API  - Consumer code -> 0 : image is not perfect (show popup - T) | 1 : image is perfect (no popup - F) | -1: data unavailable (no popup - F)

  apiResponseWait = new BehaviorSubject<0 | 1 | 2 | 3>(0); //0 = cancel | 1 = wait | 2 = upload | 3 = complete

  apiResponsePopup = new BehaviorSubject<boolean>(false); // to activate show popup

  isCancelClicked = new BehaviorSubject<boolean>(false); // cancel of loader popup

  callPythonApi = new BehaviorSubject<boolean>(false); // for calling the python api from preview

  clickedButton = new BehaviorSubject<string>('');

  postCaption = new BehaviorSubject<string>('');

  isInfiniteLoader = new BehaviorSubject<boolean>(false);

  currentRefID = new BehaviorSubject<string>('');

  killInfiniteTimeOut = new BehaviorSubject<boolean>(false);

  isEntryLoaderActive = new BehaviorSubject<boolean>(false);

  //ALERT
  entryfromInfinite = new BehaviorSubject<boolean>(false); 

  isNameEditPopupOpen = new BehaviorSubject<boolean>(false);

  isSloganPopupOpen = new BehaviorSubject<boolean>(false);

  isFileErrorOpen = new BehaviorSubject<boolean>(false);

  nameBeforeChange  = new BehaviorSubject<string>('');
  
  //time spent 
  totalTimeSpent = new BehaviorSubject<number>(0); // Store homepage [template] entry time in the module
  templateEntryTime = new BehaviorSubject<number>(0); // template pageload
  createPostEntryTime = new BehaviorSubject<number>(0); // createPost pageload
  instructionsEntryTime = new BehaviorSubject<number>(0); // instructions pageload
  uploadStartEntryTime = new BehaviorSubject<number>(0); // uploadStart 
  nameEditEntryTime = new BehaviorSubject<number>(0); // nameEditEntryTime 
  
  headers = new HttpHeaders();

  filterState = new BehaviorSubject<FilterData>({
    selectedState: '',
    selectedConstituency: '',
    hashdescType: '',
    userFlag: 'N'
  });

  sortState = new BehaviorSubject<0 | 1>(0)

  username: string = '';
  state: string = '';
  consti: string = '';

  // 11th_Ann data
  homeSource: string = '';
  homeId: string = '';
  homeQuizId: string = '';
  homeActivityId: string = '';
  homeQuestId: string = '';

  certificate:string = '';
  tranId:string = '';

  currentAttempt: number = 0;
  maxAttempt: number = 0;

  //attempt
  attemptGUD:any = 0;
  maxAttemptGUD:any = 1;
  //share
  thankYouShare:any = 0;
  maxThankYouShare:any = 1;

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private tokenService: TokenService,
    private route: Router
  ) {
    this.configService.CurrentConfig.subscribe((data: Config) => {
      this.currentTemplate = data.templatePage.templates[0];

      // this.imageUrlToBase64(this.currentTemplate.src).then((base64String) => {
      //   this.currentTemplateBase64.next(base64String);
      // })

    })
  }

  // updateCameraPopupState(type: 'cancel' | 'wait') {
  //   if (type == 'cancel') {
  //     this.apiResponseWait.next(0);
  //   } else if (type == 'wait') {
  //     this.apiResponseWait.next(1);
  //   }
  // }
  updateCameraPopupState(type: 'cancel' | 'wait' | 'upload' | 'complete') {
    if (type == 'cancel') {
      this.apiResponseWait.next(0);
    } else if (type == 'wait') {
      this.apiResponseWait.next(1);
    }
    else if (type == 'upload') {
      this.apiResponseWait.next(2);
    }
    else if (type == 'complete') {
      this.apiResponseWait.next(3);
    }
  }

  updateRefIDState(refId:string, statusId: 0 | 1 | 2) {
    // 0: Pending | 1: Complete | 2:Abort
    let url = constants.UpdateSelfieStatus;
    const token = this.tokenService.getJwtToken();
    this.headers = this.headers.set("Authorization", "Bearer " + token);
    let template_id = this.selectedTemplete.value;
    let slogan_id: string = this.currentSloganId.value.toString();
    let langauge: LanguageCode = this.currentlang.value;


    let request: UpdateSelfieStatusRequest = {
      uuid: this.tokenService.getUserID(),
      statusId: statusId,
      refId: refId,
      templateId: template_id.toString(),
      slogId: slogan_id,
      lang: langauge
    }

    // window.alert(JSON.stringify(request));

    this.http.post<ApiResponse<null>>(url, request, { headers: this.headers, responseType: 'json' }).
      subscribe({
        next: (response) => {
          // console.log(response)
          if(statusId == 1 || statusId == 2){
            if(statusId == 2){
              this.isInfiniteLoader.next(false);
              this.route.navigate(['/main', 'template'])
            }
            this.currentRefID.next('');
          }
          else{
            this.currentRefID.next(refId);
          }
        },
        error: (e) => {
          console.log(e)
        }
      });
  }

  imageUrlToBase64(imageUrl: string): Observable<string> {
    return this.http.get(imageUrl, { responseType: 'blob' }).pipe(
      switchMap((blob: Blob | undefined) => this.blobToBase64(blob)),
      catchError((error) => {
        console.error('Error fetching or converting the image:', error);
        return of('');
      })
    );
  }

  private blobToBase64(blob: Blob | undefined): Observable<string> {
    if (!blob) {
      return of('Invalid blob');
    }
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        observer.next((reader.result as string) || '');
        observer.complete();
      };
      reader.onerror = (err) => observer.error(err);
      reader.readAsDataURL(blob);
    });
  }
  cameraClicked: boolean = false;

  setCameraClicked(arg: boolean) {
    this.cameraClicked = arg;
  }

  getCameraClicked() {
    return this.cameraClicked;
  }


  setTemplateVisited(val: boolean) {
    this.isTemplatePageVisited = val;
  }

  getFlagOfTemplateVisited(): boolean {
    return this.isTemplatePageVisited;
  }

  setWallPageVisited(val: boolean) {
    this.isWallPageVisited = val;
  }

  getFlagofWallPageVisited(): boolean {
    return this.isWallPageVisited;
  }

  setUserId(userId: string) {
    this.userId = userId;
    this.isUserIdSet.next("Y")
  }

  getUserId() {
    return this.userId;
  }

  getCurrentTemplate() {
    return this.currentTemplate
  }

  setCurrentTemplate(template: Template, langauge: LanguageCode, slogan_id: number, isUserForeground?: 0|1, celebrityIDs?: string) {
    this.currentTemplate = template;
    this.currentlang.next(langauge);
    this.currentSloganId.next(slogan_id);
    if(isUserForeground)
    {
      this.currentisUserForeground.next(isUserForeground);
    }
    if(celebrityIDs)
    {
      this.currentcelebrityIDs.next(celebrityIDs);
    }
    // console.log(template,this.currentlang.value, this.currentSloganId.value)
  }

  // setTemplateId(id:number)
  // {
  //   this.currentTemplate = id;
  // }

  // getTemplateSrc():string
  // {
  //   const id = this.currentTemplate;
  //   return this.templates[id-1].src;
  // }

  setImage(image: string) {
    this.image.next(image);
  }

  get getImage(): Observable<string> {
    return this.image.asObservable();
  }

  // getHashTag():string
  // {
  //   return this.templates[this.currentTemplate-1].hashtag;
  // }

  reloadCreatePost() {
    if (this.reloadCreatePostPage) {
      // window.location.reload();
      this.reloadCreatePostPage.next(false);
    }
  }

  setUsername(name: string) {
    this.username = name;
  }

  getUsername(): string {
    return this.username
  }

  setState(arg: string) {
    this.state = arg;
  }

  getState() {
    return this.state;
  }

  setConsti(arg: string) {
    this.consti = arg;
  }

  getConsti() {
    return this.consti
  }

  posterLocationLimit: number = 40;

  // "Constituency, State" as rendered on the poster. Used both for the template-page
  // preview overlay and for the Location field sent to the image API, so the generated
  // poster matches what the user saw. Empty parts are dropped (no stray ", State"),
  // and ".." is appended only when the string exceeds the limit.
  getPosterLocation(): string {
    const consti = this.getConsti() || sessionStorage.getItem('constituency') || '';
    const state = this.getState() || sessionStorage.getItem('state') || '';
    const location = [consti, state].map((v) => v.trim()).filter((v) => v.length > 0).join(', ');

    if (location.length > this.posterLocationLimit) {
      return location.slice(0, this.posterLocationLimit) + '..';
    }
    return location;
  }
}
