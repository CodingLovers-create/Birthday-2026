import { CommonModule, Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import constants from '../../constants/constants';
import { AuditLogsService } from '../../services/audit-logs.service';
import { ConfigService } from '../../services/config.service';
import { DataService } from '../../services/data.service';
import { GoogleanalyticsService } from '../../services/googleanalytics.service';
import { InternetService } from '../../services/internet.service';
import { PostsService } from '../../services/posts.service';
import { SdkService } from '../../services/sdk.service';
import { TokenService } from '../../services/token.service';
import { Config } from '../../types/Config';
import { LanguageCode } from '../../types/LanguageTypes';
import { ApiResponse, SubmitSelfieResponse } from '../../types/RequestResponseTypes';
import { Template } from '../../types/Template';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent implements OnInit, OnDestroy {
  @ViewChild('captionTextarea') captionTextarea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedModuleTag: string = 'Birthday Wishes';
  moduleHeaderTitle: string = '';
  moduleHashtag: string = '';

  readonly moduleMap: Record<string, { title: string; hashtag: string }> = {
    'Seva Mera Yogdan': {
      title: 'Seva Mera Yogdan',
      hashtag: '#SevaMeraYogdan #SevaSankalp'
    },
    'AI Shubhkamna': {
      title: 'AI Shubhkamna',
      hashtag: '#AIShubhkamna #BirthdayCard'
    },
    'Aashirwad Ka Diya': {
      title: 'Aashirwad Ka Diya',
      hashtag: '#AashirwadKaDiya #SevaSankalp'
    },
    'Seva Ke Rang': {
      title: 'Seva Ke Rang, Rashtra Ke Sang',
      hashtag: '#SevaKeRang #RashtraKeSang'
    },
    'Seva Ke Rang, Rashtra Ke Sang': {
      title: 'Seva Ke Rang, Rashtra Ke Sang',
      hashtag: '#SevaKeRang #RashtraKeSang'
    },
    'Seva Ki Kahani': {
      title: 'Seva Ki Kahani',
      hashtag: '#SevaKiKahani #BirthdayGreetings'
    }
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private sdkService: SdkService,
    private gaService: GoogleanalyticsService,
    private auditService: AuditLogsService,
    public internet: InternetService,
    private tokenService: TokenService,
    private postsService: PostsService,
    private cdr: ChangeDetectorRef
  ) { }


  // token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWR0eXBlIjoidXVpZCIsIndoaXRlbGlzdCI6Ik4iLCJ1c2VyaWR2YWx1ZSI6InVDb0FkK0VYb2RqQzhXUkk1VnJsbUE9PSIsInVzZXJpZCI6IjhlMDgzYjExNTdjZWFlN2VkYjllYjhmZDZjODI3NTU2NDcwNTU3YTFkNDNhMTcwZGU0NTY3ZmUwYjliYTc5Y2MiLCJleHAiOjE2OTY2Nzc3NTksImRhdGEiOiJaa1FVUU5la1RwdkkydzFkeWRxcjFCODJzYStTU01HaEhNZm9CNjBtZjhmZ2NieGxwcjNITHpIc1JjbzlaeEtScXdXNHB3VTltYzVrY0JJWUlDRnN5Z3ZXQW1wWHduM3JBMjMyXC9iUEJBcmJaXC9ibHFSaU54dGJsNE5rN0p6TEVTUTVPOHRQNW5QV0tvVmNsMHh3UmFaQVMzR29YZ3RHZTFBRkJxU1F1MnFoT0ZGeFI4XC9OQ2lNVEJxaW1HbzZkXC9najZvcTk2UzhrQkFnUkdrMHpodGtraFBaNUxSVjlDanlaZkNrVkZmTXB0OGVWUHh5cytnMjhRMkZ5TE94aDRzN2Q5Smc4UXhIREdVdTNoYTFsT2pQVW90Ykk3VUN2Ymw5eVZrMlwvM1wvVmZXTE0rTWNPU3dFeW9pVlIwV0xrYnd6cXVcL3JiTitHck5FcG0rRk1BakdSaVIzTTN0aDdmclI0U2lFbGNEd0xWZFc0Z0pQWTEwNG5ndHBTQ25mcTZ5eThIM3FBcDdWdEVRcjdjbkFvbld5akZvOUxTcWNPS0c3Z2NOZ2lEdGNjcHlEbDUyUkd4UXpVdlwvODd6RW5GcXJKMVN2SUxiZzVHbjBRRzJXVmo0ZkhkRXphbzBrU0REb01PYWdjODl5SzdJaVp3PSJ9.UcC81FVIVtfpHm7uRqLZNo2mxvSX03nCKxbDB0PzaS8"
  config!: Config;
  header = new HttpHeaders({
    Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    // Authorization: 'Bearer ' + this.token,
  });

  imageLoaded: boolean = false; // to check if the image is downloaded from the src URL

  //CAPTION
  caption: string = '';
  captionLength = 0;
  captionForm!: FormGroup;
  isdescempty: string = "No";
  isSubmitDisabled: boolean = false;
  

  //POPUP
  showExitPopup: boolean = false; // Confirm Exit CreatePost Popup
  showErrorPopup: boolean = false; // Python API Error (Producer)
  showCamUploadLoader: boolean = false; // Python API Upload Loader
  isPerfectImageShowError!: boolean; // Python API Error (Consumer)

  instanceOfSubscription!: Subscription;

  

  public templatesrc?: string;
  public dummysrc?: string;
  cameraimg!: string;
  hashtag!: string;
  url: string = '';
  request: any = {};
  response: any;
  

  selected_templete!: number;

  // apiErrorMessage!: string;
  // apiErrorMessageID!: number | null;
  // noApiResponseImg: string = '';
  
  noApiCurrentTemplate !: Template;
  
  clickedButton!: string;
  apiErrorMessage!: string;  // Python API Error Message (Producer)
  apiResponseErrorID!: number | null; // Python API Error ID (Producer)
  noApiResponseImg: string = ''; // Sets a Preview image in absence of apiResponseImage when there is Python API error 
  errorIdList: number[]= [100,101,201,11,1004];

  wait_value: number = 0;


  createPostEntryTime!: Date;

  // INSPIRE ME
  showWishesPopup: boolean = false;
  showConfirmationPopup: boolean = false;
  selectedWishIndex: number = -1;
  tempSelectedWishIndex: number = -1;

  // ALERT FileError
  showAlert: boolean = false;
  showFileError: boolean = false;


  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['tag']) {
          this.selectedModuleTag = params['tag'];
          const mapped = this.moduleMap[params['tag']];
          if (mapped) {
            this.moduleHeaderTitle = mapped.title;
            this.moduleHashtag = mapped.hashtag;
          } else {
            this.moduleHeaderTitle = params['tag'];
            this.moduleHashtag = '#SevaSankalpAbhiyan';
          }
        }
      });
    const currentTpl = this.dataService.getCurrentTemplate();
    this.noApiResponseImg = (currentTpl && currentTpl.srcPreview) 
      ? (constants.imageAssetHost ? constants.imageAssetHost + currentTpl.srcPreview : currentTpl.srcPreview)
      : 'assets/images/templates/Preview1.webp';
    // if (!this.dataService.reload) {
      // this.dataService.createPostEntryTime.next(Date.now());
      this.createPostEntryTime = new Date;
      this.gaService.pageLoad("preview_page”", "eng");
      this.auditService.submitAudit("ai_subhkamnaye_preview", "pageload", "eng");
    // }


    this.configService.CurrentConfig.subscribe((data: Config) => {
      this.config = data;
    });

    // STATIC VALUES TO TEST POST FUNCTION ON LOCALHOST
    // this.dataService.numcelebritySelected.next(1)
    // this.dataService.apiResponseImage.next("https://namo11uat.narendramodi.in/amrit_dharohar_quiz/assets/images/templates/Preview1.png")
    // this.dataService.numcelebritySelected.next(2)
    // this.dataService.apiResponseImage.next("https://delhichalimodikesaathuat.narendramodi.in/assets/templates/Rani.png")
    // this.dataService.apiResponseError.next("template number not found in the configuration")
    // this.dataService.apiResponseErrorID.next(11)
    // 100 - noFaceErrorMessage | 101 - multipleFaceErrorMessage | 201 - imageUploadError (corrupt img) | 11 - imageUploadError (fileSize limit) | 1004 - File Format Error
    // this.noApiResponseImg = 'https://delhichalimodikesaathuat.narendramodi.in/assets/templates/Rani.png';


    this.dataService.apiResponseWait.subscribe((data) => {
      this.wait_value = data;
    });

    this.dataService.apiResponsePopup.subscribe((data) => {
      this.showCamUploadLoader = data;
    });

    this.dataService.apiResponseError.subscribe((data) => {
      this.apiErrorMessage = data;
    });

    this.dataService.apiResponseErrorID.subscribe((data) => {
      this.apiResponseErrorID = data;
    });

    this.dataService.isPerfectImageShowError.subscribe((data) => {
      this.isPerfectImageShowError = data;
    });

    this.dataService.isFileErrorOpen.subscribe((data) => {
      this.showFileError = data;
    });

    this.dataService.clickedButton.subscribe((data) => {
      if (data === 'camera') {
        this.dataService.updateCameraPopupState('cancel');
      }
      this.clickedButton = data;
    });

    this.selected_templete = this.dataService.selectedTemplete.value;

    this.caption = this.dataService.postCaption.value;

    // ALERT
    if (this.dataService.entryfromInfinite.value) {
      this.toggleAlertFloater();
      setTimeout(() => {
        this.toggleAlertFloater();
        this.dataService.entryfromInfinite.next(false)
      }, 3000)
    }
  }


  // basicEmojis = /[\u{1F600}-\u{1F64F}]/u;
  // emoticons = /[\u{1F300}-\u{1F5FF}]/u;
  // transportAndMapSymbols = /[\u{1F680}-\u{1F6FF}]/u;
  // miscellaneousSymbols = /[\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  // additionalEmojis = /[\u{1F910}-\u{1F9FF}]/u;
  // flags = /[\u{1F3B6}-\u{1F3C4}|\u{1F1E6}-\u{1F1FF}]/u;
  // symbolsAndPictographs = /[\u{1F6B4}-\u{1F6B6}]/u;
  // activityEmojis = /[\u{1F46F}\u{1F6CC}\u{1F46E}\u{1F48F}]/u;
  // peopleEmojis = /[\u{1F468}-\u{1F469}\u{1F9D1}-\u{1F9DD}]/u;
  // families = /[\u{1F468}-\u{1F9B3}]/u;
  // coupleWithHeart = /[\u{1F491}]/u; // This emoji is U+1F491
  // others = /[\u{1F46B}-\u{1F46C}\u{1F9BD}-\u{1F9CF}\u{1F920}-\u{1F925}\u{1F93A}-\u{1F93E}\u{1F938}-\u{1F93D}\u{1F3CA}]/u;
  // sports = /[\u{26BD}-\u{26F9}\u{1F3C0}-\u{1F3CC}]/u;
  // newEmojis = /[\u{1F972}|\u{1F978}|\u{1F90C}|\u{1FAC2}|\u{1FAC0}|\u{1F9D1}\u{200D}\u{1F393}|\u{1F9BE}|\u{1F9BF}|\u{1F9BB}|\u{1F9A7}|\u{1FAC6}|\u{1F62D}|\u{1F602}|\u{1F606}|\u{1F605}|\u{1F60D}|\u{1F970}|\u{1F929}|\u{1F923}|\u{1F0CF}|\u{1F975}|\u{1F976}|\u{1F974}|\u{1FAC3}|\u{1FAC4}|\u{1F9D1}\u{200D}\u{2764}\u{FE0F}\u{200D}\u{1F9D1}|\u{1F9BE}|\u{1F9BF}|\u{1F9BB}|\u{1FA82}|\u{1FA84}|\u{1FA85}|\u{1FA86}|\u{1FAA1}|\u{1FAA2}|\u{1FAA3}|\u{1FA80}|\u{1FA81}|\u{1F98B}|\u{1FAC1}|\u{1F951}|\u{1F92F}|\u{1F97A}|\u{1F92A}|\u{1F971}|\u{1F911}|\u{1F92D}|\u{1F90D}]/u;
  // newFlags = /(\u{1F3F4}|\u{E0067}|\u{E0062}|\u{E0077}|\u{E006C}|\u{E0073}|\u{E007F})/;
  // checkEmoji!: RegExp;


  onSubmit() {
    // console.log("post clicked")
    // If the caption textarea is focused, call scrollDown
    if (this.captionTextarea.nativeElement === document.activeElement) {
      this.scrollDown();
    }
    if (this.internet.online.value) {
      if (this.dataService.apiResponseImage.value && this.captionLength <= 200) {
        // console.log("Post Clickable");

        this.isSubmitDisabled = true;
         this.auditService.submitAudit("ai_subhkamnaye_preview", "post", "eng", this.caption);
        // console.log(this.caption);
        // this.dataService.wallwhiteloader = true;
        // this.dataService.isLoaderActive.next(true);
        this.dataService.isEntryLoaderActive.next(true);
        this.selfieSubmit();

      }
    }
    else {
      this.internet.updateShowNoInternet();
    }

  }

  imageUrlToBase64(imageUrl: string): Promise<string> {
    return this.http
      .get(imageUrl, { responseType: 'blob' })
      .toPromise()
      .then((blob: Blob | undefined) => {
        return this.blobToBase64(blob);
      })
      .catch((error) => {
        console.error('Error fetching or converting the image:', error);
        return '';
      });
  }

  async blobToBase64(blob: Blob | undefined): Promise<string> {
    if (!blob) {
      return 'Invalid blob';
    }
    const buffer = await blob.arrayBuffer();
    const base64String = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    // console.log(base64String);
    return `data:${blob.type};base64,${base64String}`;
  }

  back() {
    if (this.isPerfectImageShowError && this.apiErrorMessage && this.dataService.apiResponseErrorID.value != 100 && this.dataService.apiResponseErrorID.value != 101 && this.dataService.apiResponseErrorID.value != 201 && this.dataService.apiResponseErrorID.value != 11 && this.dataService.apiResponseErrorID.value != 1004) {
      // If Warning/Error is active disable native back
      this.auditService.submitAudit("ai_subhkamnaye_preview", "back", "eng", "","","","","",this.createPostEntryTime.toISOString(),"");
    }
    else {
      this.auditService.submitAudit("ai_subhkamnaye_preview", "back", "eng", "","","","","",this.createPostEntryTime.toISOString(),"");
      this.showExitPopup = true;
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const isPostButtonClicked = (event.target as HTMLElement).classList.contains('post-btn');
    const isRetakeButtonClicked = (event.target as HTMLElement).classList.contains('retake-btn');

    // If the post button is touched, trigger the onSubmit function
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    if (isAndroid) {
      if (isPostButtonClicked) {
        this.scrollDown();
        this.onSubmit();
      }
      if (isRetakeButtonClicked) {
        this.scrollDown();
        this.retakeBtn();
      }
    }
  }


  scrollDown() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    if (isAndroid) {
      let element = document.querySelector('.extra-space') as HTMLElement;
      if (element) {
        element.style.height = '0%';
      }
    }
  }
  scrollToTop(event: any) {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');

    if (isAndroid) {
      let element = document.querySelector('.extra-space') as HTMLElement;
      if (element) {
        element.style.height = '375px';
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
  }


  confirmNoToHome() {
    this.showExitPopup = false;
  }

  confirmYesToHome() {
    this.dataService.isCameraButtonClicked = false;

    // 100 - noFaceErrorMessage | 101 - multipleFaceErrorMessage 
    // 201 - imageUploadError (corrupt img) | 11 - imageUploadError (fileSize limit)
    //  1004 - File Format Error 
    if (this.dataService.apiResponseErrorID.value == 100) 
    { // 100 - noFaceErrorMessage
      this.auditService.submitAudit("no_face_detected_popup", "home", "eng");
      this.gaService.customEvent("no_face_detected_popup", "home", "eng");
    } 
    else if (this.dataService.apiResponseErrorID.value == 101) 
    { // 101 - multipleFaceErrorMessage 
      this.auditService.submitAudit("multiple_face_detected_popup", "home", "eng");
      this.gaService.customEvent("multiple_face_detected_popup", "home", "eng");
    } 
    else if (this.dataService.apiResponseErrorID.value == 201) 
    { // 201 - imageUploadError (corrupt img)
      this.auditService.submitAudit("processing_failed_popup", "home", "eng");
      this.gaService.customEvent("processing_failed_popup", "home", "eng");
    } 
    else if (this.dataService.apiResponseErrorID.value == 11) 
    { // 11 - imageUploadError (fileSize limit)
      this.auditService.submitAudit("file_size_exceeded_popup", "home", "eng");
      this.gaService.customEvent("file_size_exceeded_popup", "home", "eng");
    } 
    else if (this.dataService.apiResponseErrorID.value == 1004 ) 
    { //  1004 - File Format Error 
      this.auditService.submitAudit("unsupported_file_format_popup", "home", "eng");
      this.gaService.customEvent("unsupported_file_format_popup", "home", "eng");
    } 
    else 
    {
      this.auditService.submitAudit("preview_page", "back", "eng","","","","","",this.createPostEntryTime.toISOString(),"");
      this.gaService.customEvent("preview_page", "back", "eng");
    }

    this.dataService.isSelectAllowed.next(true);
    this.dataService.apiResponseImage.next('');
    this.dataService.apiResponseError.next('');
    this.dataService.apiResponseErrorID.next(null);
    this.dataService.postCaption.next('');
    if (this.dataService.isPerfectImageShowError.value) {
      this.dataService.isPerfectImageShowError.next(false); //close isPerfectImageShowError popup if open
    }
    this.routetotemplate();
  }

  goToHomeBtn() {
    // this.gaService.customEvent("photopreview", "home", "en")
    // this.auditService.submitAudit("photo_preview", "home", null, null, "en");
    this.showExitPopup = true;
  }

  retakeBtn() {
    //open camera
    const btnName:string = this.clickedButton == 'camera'? 'retake' : 'reupload';
    // 100 - noFaceErrorMessage | 101 - multipleFaceErrorMessage 
    // 201 - imageUploadError (corrupt img) | 11 - imageUploadError (fileSize limit)
    //  1004 - File Format Error 
    // Consumer error Message popup - isPerfectImageShowError 
    if (this.dataService.apiResponseErrorID.value == 100) 
    { // 100 - noFaceErrorMessage
      this.auditService.submitAudit("ai_subhkamnaye_preview", btnName, "eng");
      this.gaService.customEvent("no_face_detected_popup", btnName, "eng");
    } 
    else if (this.dataService.apiResponseErrorID.value == 101) 
    { // 101 - multipleFaceErrorMessage 
      this.auditService.submitAudit("ai_subhkamnaye_preview", btnName, "eng");
      this.gaService.customEvent("multiple_face_detected_popup", btnName, "eng");
    } 
    else if (this.dataService.apiResponseErrorID.value == 201) 
    { // 201 - imageUploadError (corrupt img)
      this.auditService.submitAudit("ai_subhkamnaye_preview", btnName, "eng");
      this.gaService.customEvent("processing_failed_popup", btnName, "eng");
    } 
    else if (this.dataService.apiResponseErrorID.value == 1004 ) 
    { //  1004 - File Format Error 
      this.auditService.submitAudit("ai_subhkamnaye_preview", btnName, "eng");
      this.gaService.customEvent("unsupported_file_format_popup", btnName, "eng");
    } 
    else if (this.isPerfectImageShowError) 
    { //  isPerfectImageShowError 
      this.auditService.submitAudit("ai_subhkamnaye_preview", btnName, "eng");
      this.gaService.customEvent("poster_improvement_popup", btnName, "eng");
    } 
    else 
    {
      this.auditService.submitAudit("ai_subhkamnaye_preview", btnName, "eng");
      this.gaService.customEvent("preview_page", btnName, "eng");
    }
    if (this.clickedButton == 'camera') {
      this.dataService.updateCameraPopupState('cancel');
      this.openCamera()
    }
    else if (this.clickedButton == 'gallery') {
      this.openGallery()
    }
    else {
      this.openGallery()
    }
  }

  goToHomeBtnNoConfirm() {
    // Generic Error User Options and 11 - imageUploadError (fileSize limit)
    if (this.dataService.apiResponseErrorID.value == 11) 
    { // 11 - imageUploadError (fileSize limit)
      this.auditService.submitAudit("file_size_exceeded_popup", "go_back", "eng");
      this.gaService.customEvent("file_size_exceeded_popup", "go_back", "eng");
    } 
    else
    { // Generic Error User Options
      this.auditService.submitAudit("oops_popup", "home", "eng");
      this.gaService.customEvent("oops_popup", "home", "eng");
    }

    this.dataService.isCameraButtonClicked = false;
    this.dataService.isSelectAllowed.next(true);
    this.dataService.apiResponseImage.next('');
    this.dataService.apiResponseError.next('');
    this.dataService.apiResponseErrorID.next(null);
    this.routetotemplate();
  }

  closeIsPerfectImageShowError() {
    this.dataService.isPerfectImageShowError.next(false);
    this.auditService.submitAudit("poster_improvement_popup", "ignore", "eng");
    this.gaService.customEvent("poster_improvement_popup", "ignore", "eng");
  }

  triggerImagePicker(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  compressImage(base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => resolve(base64Str);
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const rawBase64 = e.target?.result as string;
        if (rawBase64) {
          const compressedBase64 = await this.compressImage(rawBase64);
          this.dataService.apiResponseImage.next(compressedBase64);
          this.dataService.apiResponseError.next('');
          this.dataService.apiResponseErrorID.next(null);
          this.dataService.apiResponsePopup.next(false);
          this.imageLoaded = true;
          this.cdr.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  openCamera() {
    this.triggerImagePicker();
  }

  openGallery() {
    this.triggerImagePicker();
  }

  routetotemplate() {
    // window.scrollTo(0, 0);
    // window.scrollBy(0, 1);
    this.dataService.isCameraButtonClicked = false;
    this.dataService.apiResponseImage.next('');
    this.dataService.apiResponseError.next('');
    this.dataService.apiResponseErrorID.next(null);
    this.dataService.image.next('');

    this.router.navigate(['/wall']);
  }

  filterCaption(event: Event) {
    // console.log('caption', this.caption);
    this.captionLength = this.caption.length;
    this.dataService.postCaption.next(this.caption);
  }

  showCaptionError: boolean = false;
  RestrictMoreChar(event: Event) {
    // const inputdata = event.target as HTMLTextAreaElement;
    // if (this.caption.length > 201) {
    //   const necessary = inputdata.value.substring(0, 200);
    //   const unnecessaryPart = inputdata.value.substring(200).replace(/./g, '');
    //   const updatedValue = necessary + unnecessaryPart;
    //   this.caption = updatedValue;
    //   this.caption = this.caption.slice(0, 200);
    //   this.captionLength = this.caption.length;
    //   (event.target as HTMLTextAreaElement).value = this.caption;
    //   console.log('caption on input event: after', this.caption);
    // }

    const inputElement = event.target as HTMLTextAreaElement;
    if (this.caption.length > 200) {
      this.showCaptionError = true;
      setTimeout(() => {
        this.caption = this.caption.substring(0, 200);
        this.captionLength = this.caption.length;
        inputElement.value = this.caption;
        inputElement.blur();
        setTimeout(() => inputElement.focus(), 0);
        this.showCaptionError = false;
      }, 2000);
    }
  }

  dataURLtoFile(dataurl: string, filename: string = 'screenshot.png') {

    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  formatHashtag(hashtag: string, type: 'apiPost' | 'audit'): string {
    if (type == 'apiPost') {
      return hashtag.replace(/ /g, '||');
    }
    else if (type == 'audit') {
      return hashtag.replace(/#/g, '').replace(/ /g, ',');
    }
    else {
      return "";
    }
  }


  selfieSubmit() {
    let imageURL = this.dataService.apiResponseImage.value || 'assets/images/templates/Preview1.webp';
    let caption: string = this.caption.trimStart().trimEnd().replace(/(\r?\n){3,}/g, '\n\n');

    this.postsService.createPost({
      description: caption || 'Wishing you a very Happy Birthday! 🎉',
      images: [imageURL],
      tag: this.selectedModuleTag || 'Birthday Wishes'
    }).subscribe({
      next: () => {
        this.dataService.isCameraButtonClicked = false;
        this.isSubmitDisabled = false;
        this.dataService.postCaption.next('');
        this.dataService.isEntryLoaderActive.next(false);
        this.router.navigate(['/wall']);
      },
      error: (e: any) => {
        console.error(e);
        this.dataService.isEntryLoaderActive.next(false);
        this.router.navigate(['/wall']);
      }
    });
  }

  redirectUrlParams(){
    const url = new URL(constants.photogallery_redirect_link);
    url.searchParams.append("source", this.dataService.homeSource);
    url.searchParams.append("jwt", this.tokenService.getJwtToken());
    url.searchParams.append("username", encodeURIComponent(this.dataService.getUsername()))
 
    //window.alert(url.toString());
    window.location.replace(url.toString())
  }
 

    generateCertificate() {

    console.log("generateCertificate")

    const body = {
      tranId: this.dataService.tranId, //tranid fetch from response of submit
      // activityId: 9, // for local testing only
      activityId: this.dataService.homeActivityId,
      text: sessionStorage.getItem('username'),
      typeFlag: 1
    };

    this.http.post<any>(constants.certificateAPI, body, { headers: this.header }).subscribe({
      next: (response) => {
        if (response.statusCode == 200) {

          console.log(response);
          this.dataService.certificate = response.certificateUrl;
          // this.dataService.isLoaderActive.next(false);
        }
        else {
          console.log("API Error uploading certificate")
        }
      },
      error: (error) => {
        console.error('Error fetching form status:', error);
        // this.dataService.isLoaderActive.next(false);
      },
      complete: () => {
        setTimeout(() => {
          this.routeToCertificate()
        }, 1200);
      },
    });
  }

  routeToCertificate(){
    this.dataService.isEntryLoaderActive.next(false);
    this.router.navigate(['/main', 'certificate']);
  }

  cancel_loader() {
    this.dataService.apiResponsePopup.next(false)
    this.dataService.isCancelClicked.next(true)
  }

  forceRoutetoCreatePost() {
    this.router.navigate(['/main', 'createPost'], { queryParams: { randomParam: Math.random() } });
  }

  forceRoutetoPreview() {
    this.router.navigate(['/main', 'preview']);
  }

  forceUpdateLoaderToWait() {
    this.dataService.updateCameraPopupState('wait');
  }

  forceUpdateLoaderToUpload() {
    this.dataService.updateCameraPopupState('upload');
  }

  forceUpdateLoaderToComplete() {
    this.dataService.updateCameraPopupState('complete');
  }

  forceUpdateLoaderToCancel() {
    this.dataService.updateCameraPopupState('cancel');
  }

  forceUpdateCancelClicked() {
    this.dataService.isCancelClicked.next(false);
  }

  closeFileError() {
    this.dataService.isFileErrorOpen.next(false);
  }


  openWishesPopup() {
    if (this.internet.online.value) {
      this.showWishesPopup = true;
      this.auditService.submitAudit("ai_subhkamnaye_preview", "inspire_me", "eng");
      this.auditService.submitAudit("ai_subhkamnaye_inspire_me_page", "pageload", "eng");
      // this.gaService.customEvent("preview_page", "inspire_me", "eng");
    }
    else {
      this.internet.updateShowNoInternet();
    }
  }

  closeWishesPopup() {
    this.showWishesPopup = false;
    this.tempSelectedWishIndex = -1;
    this.auditService.submitAudit("ai_subhkamnaye_inspire_me_page", "cross", "eng", "","","","","",this.createPostEntryTime.toISOString(),"");

    // this.auditService.submitAudit("inspire_me_popup", "close", "eng");
    // this.gaService.customEvent("inspire_me_popup", "close", "eng");
  }

  selectWish(index: number) {
    if (this.internet.online.value) {
      this.tempSelectedWishIndex = index;
      if (this.caption) {
        this.auditService.submitAudit("ai_subhkamnaye_inspire_me_page", "select_option", "eng", this.caption);
        this.showConfirmationPopup = true;
      } else {
        this.confirmWishSelection(true);
      }
    }
    else {
      this.internet.updateShowNoInternet();
    }
  }

  confirmWishSelection(confirmed: boolean) {
    this.showConfirmationPopup = false;
    if (confirmed) {
      this.selectedWishIndex = this.tempSelectedWishIndex;
      this.setWishAsCaption();
      this.auditService.submitAudit("preview_page", "inspire_me", "eng", "", "", "", "", this.caption);
      this.gaService.customEventInspire("preview_page", "inspire_me", "eng", this.caption);
    } else {
      this.tempSelectedWishIndex = this.selectedWishIndex;
    }
  }

  setWishAsCaption() {
    if (this.selectedWishIndex !== -1) {
      this.caption = this.config.createPostPage.wishesList[this.selectedWishIndex].wishText;
      this.captionLength = this.caption.length;
      this.dataService.postCaption.next(this.caption);
      this.closeWishesPopup();
    }
  }

  // ALERT
  toggleAlertFloater() {
    this.showAlert = !this.showAlert;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // if (this.intervalForImageChecking) {
    //   clearInterval(this.intervalForImageChecking);
    // }
    if (this.instanceOfSubscription) {
      this.instanceOfSubscription.unsubscribe();
    }
  }
}
