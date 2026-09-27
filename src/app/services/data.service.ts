import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';
import { Template } from '../types/Template';
import { ConfigService } from './config.service';
import { Config } from '../types/Config';
import constants from '../constants/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterData, FeedsListResponse, ApiResponse, UpdateSelfieStatusRequest } from '../types/RequestResponseTypes';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { LanguageCode } from '../types/LanguageTypes';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private destroyRef = inject(DestroyRef);

  /** Modern Angular Signals for Reactive State */
  readonly usernameSignal = signal<string>('');
  readonly stateSignal = signal<string>('');
  readonly constiSignal = signal<string>('');
  readonly currentTemplateSignal = signal<Template | null>(null);
  readonly postCaptionSignal = signal<string>('');
  readonly apiResponseImageSignal = signal<string>('');

  showHelper = new BehaviorSubject<boolean>(false);
  blockSwipeGestures = new BehaviorSubject<boolean>(true);

  isUserIdSet = new BehaviorSubject<string>("N");
  image = new BehaviorSubject<string>(''); // image received from external callback
  imageBase64 = new BehaviorSubject<string>('');

  backgroundBase64 = new BehaviorSubject<string>('');
  circleBase64 = new BehaviorSubject<string>('');

  userId = "";
  isTemplatePageVisited: boolean = false;
  currentTemplate!: Template;

  currentSloganId = new BehaviorSubject<number>(1);
  currentlang = new BehaviorSubject<LanguageCode>('eng');
  currentisUserForeground = new BehaviorSubject<0|1>(0);
  currentcelebrityIDs = new BehaviorSubject<string>('1');

  currentTemplateBase64 = new BehaviorSubject<string>('');
  isWallPageVisited: boolean = false;
  isCameraButtonClicked: boolean = false;

  isLoaderActive = new BehaviorSubject<boolean>(false);
  isSetIntervalRequired = new BehaviorSubject<boolean>(false);
  isPreviewIntervalRequired = new BehaviorSubject<boolean>(false);
  isPreviewCalled = new BehaviorSubject<boolean>(false);

  reportedPostId = new BehaviorSubject<number | null>(null);
  reportAction = new BehaviorSubject<"report" | "delete">('report');
  showReportedToast = new BehaviorSubject<number>(0);
  selectedTemplete = new BehaviorSubject<number>(1);
  currentRoute = new BehaviorSubject<'template' | 'createPost' | 'instructions' | 'certificate' | 'app'>('app');

  reload: boolean = false;
  reloadCreatePostPage = new BehaviorSubject<boolean>(false);
  routeTo = new BehaviorSubject<'preview' | 'createPost' | 'retake' | 'instructions' | ''>('');
  isSelectAllowed = new BehaviorSubject<boolean>(true);
  wallwhiteloader: boolean = false;

  apiResponseImage = new BehaviorSubject<string>(''); //python API
  apiResponseError = new BehaviorSubject<string>(''); //python API - Producer Error Message
  apiResponseErrorID = new BehaviorSubject<number | null>(null);  //python API - Producer Error ID
  isPerfectImageShowError = new BehaviorSubject<boolean>(false);
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
  totalTimeSpent = new BehaviorSubject<number>(0);
  templateEntryTime = new BehaviorSubject<number>(0);
  createPostEntryTime = new BehaviorSubject<number>(0);
  instructionsEntryTime = new BehaviorSubject<number>(0);
  uploadStartEntryTime = new BehaviorSubject<number>(0);
  nameEditEntryTime = new BehaviorSubject<number>(0);
  
  headers = new HttpHeaders();

  filterState = new BehaviorSubject<FilterData>({
    selectedState: '',
    selectedConstituency: '',
    hashdescType: '',
    userFlag: 'N'
  });

  sortState = new BehaviorSubject<0 | 1>(0);

  username: string = '';
  state: string = '';
  consti: string = '';

  // 11th_Ann data
  homeSource: string = '';
  homeId: string = '';
  homeQuizId: string = '';
  homeActivityId: string = '';
  homeQuestId: string = '';

  certificate: string = '';
  tranId: string = '';

  currentAttempt: number = 0;
  maxAttempt: number = 0;

  //attempt
  attemptGUD: any = 0;
  maxAttemptGUD: any = 1;
  //share
  thankYouShare: any = 0;
  maxThankYouShare: any = 1;

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private tokenService: TokenService,
    private route: Router
  ) {
    this.configService.CurrentConfig
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: Config) => {
        if (data?.templatePage?.templates?.length) {
          this.currentTemplate = data.templatePage.templates[0];
          this.currentTemplateSignal.set(this.currentTemplate);
        }
      });
  }

  updateCameraPopupState(type: 'cancel' | 'wait' | 'upload' | 'complete') {
    if (type == 'cancel') {
      this.apiResponseWait.next(0);
    } else if (type == 'wait') {
      this.apiResponseWait.next(1);
    } else if (type == 'upload') {
      this.apiResponseWait.next(2);
    } else if (type == 'complete') {
      this.apiResponseWait.next(3);
    }
  }

  updateRefIDState(refId: string, statusId: 0 | 1 | 2) {
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
    };

    this.http.post<ApiResponse<null>>(url, request, { headers: this.headers, responseType: 'json' })
      .subscribe({
        next: (response) => {
          if (statusId == 1 || statusId == 2) {
            if (statusId == 2) {
              this.isInfiniteLoader.next(false);
              this.route.navigate(['/main', 'template']);
            }
            this.currentRefID.next('');
          } else {
            this.currentRefID.next(refId);
          }
        },
        error: (e) => {
          console.log(e);
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
    this.isUserIdSet.next("Y");
  }

  getUserId() {
    return this.userId;
  }

  getCurrentTemplate(): Template {
    return this.currentTemplate;
  }

  setCurrentTemplate(template: Template, langauge: LanguageCode, slogan_id: number, isUserForeground?: 0|1, celebrityIDs?: string) {
    this.currentTemplate = template;
    this.currentTemplateSignal.set(template);
    this.currentlang.next(langauge);
    this.currentSloganId.next(slogan_id);
    if (isUserForeground) {
      this.currentisUserForeground.next(isUserForeground);
    }
    if (celebrityIDs) {
      this.currentcelebrityIDs.next(celebrityIDs);
    }
  }

  setImage(image: string) {
    this.image.next(image);
  }

  get getImage(): Observable<string> {
    return this.image.asObservable();
  }

  reloadCreatePost() {
    if (this.reloadCreatePostPage) {
      this.reloadCreatePostPage.next(false);
    }
  }

  setUsername(name: string) {
    this.username = name;
    this.usernameSignal.set(name);
  }

  getUsername(): string {
    if (!this.username && typeof sessionStorage !== 'undefined') {
      this.username = sessionStorage.getItem('username') || '';
      this.usernameSignal.set(this.username);
    }
    return this.username;
  }

  setState(arg: string) {
    this.state = arg;
    this.stateSignal.set(arg);
  }

  getState(): string {
    if (!this.state && typeof sessionStorage !== 'undefined') {
      this.state = sessionStorage.getItem('state') || '';
      this.stateSignal.set(this.state);
    }
    return this.state;
  }

  setConsti(arg: string) {
    this.consti = arg;
    this.constiSignal.set(arg);
  }

  getConsti(): string {
    if (!this.consti && typeof sessionStorage !== 'undefined') {
      this.consti = sessionStorage.getItem('constituency') || '';
      this.constiSignal.set(this.consti);
    }
    return this.consti;
  }

  posterLocationLimit: number = 40;

  getPosterLocation(): string {
    const consti = this.getConsti() || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('constituency') || '' : '');
    const state = this.getState() || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('state') || '' : '');
    const location = [consti, state].map((v) => v.trim()).filter((v) => v.length > 0).join(', ');

    if (location.length > this.posterLocationLimit) {
      return location.slice(0, this.posterLocationLimit) + '..';
    }
    return location;
  }
}

