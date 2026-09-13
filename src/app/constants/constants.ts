const environment = (window as any).__env || {};

let constants = {
    
    configJSON: environment.config,
    imageAssetHost: environment.imageAssetHost,
    
    Host: environment.Host,
    
    //Redirect Links
    externalCallback: environment.externalCallback,
    photogallery_redirect_link: environment.photogallery_redirect_link,
    home_redirect_link: environment.home_redirect_url,
    media_wall_source: environment.media_wall_source,
    
    //SHARE
    shareUrl: environment.shareUrl,
    shareText: environment.shareText,
    
    //APIS
    audit: environment.audit,
    getTokenDetailsAPI: environment.getTokenDetailsAPI, //no use
    certificateAPI: environment.certificateAPI, //no use
    addCoinsAPI: environment.addCoinsAPI, //no use
    maxShare: environment.maxShare, //no use
    getUserDetails: environment.getUserDetails, //no use

    // SpringBoot API - complete URLs from runtime-config.json
    createUser: environment.createUser,
    getTokenDetails: environment.getTokenDetails,
    CreatePost: environment.createPost,
    GetSelfieStatus: environment.getSelfieStatus,
    UpdateSelfieStatus: environment.updateSelfieStatus,

    //Python API - complete URLs from runtime-config.json
    pythonPost_CamImage: environment.pythonPost_CamImage,
    pythonPost_GeneratedImage: environment.pythonPost_GeneratedImage,

    
    //runtime-tunable values (src/env/runtime-config.json - no rebuild required)
    // fallback keeps older deployed configs that predate the key working
    MaxNameLength: (environment.maxNameLength ?? 40) as number,

    //constant values
    NoInternetMessage: "No Internet connection. Please check your Internet or Wifi connection.",
    forcedTimeoutForLoader: 1000,
    MaxUserNameLength: 22,
    MaxLocationLength: 60,
    ShowNoInternetTime: 2000,
    GetFeedsBlocker: 300,
    ForcedTemplateTime: 6000,
    pythonPost_CallInterval: 6000,
    pythonPost_Infinite_CallInterval: 10000,
    maxTime_pythonPost_call: 90000,
    python_api2_callCount: 15
}

export default constants;