import { LanguageCode } from "./LanguageTypes";

type GetConstituencyListByStateRequest = {
    state: string;
    constituency: string;
}
type GetStateListResponse = string[]

type GetConstituencyListByStateResponse = string[]

type ApiResponse<T> = {
    // API response - getFeeds, getUserPosts, createPostByImageUrl, getProfileDetails
    status: "success" | "error" | "Success";
    statusCode: 200 | 400 | 404 | 500 | 503;
    statusMsg: string;
    result?: T;
}

type SubmitSelfieResponse = {
    //createPostByImageUrl
    status: "success" | "error" | "Success";
    statusCode: 200 | 400 | 404 | 500 | 503;
    statusMsg: string;
    tranid: string;
    badges: number;
    questCompleted: number;
    coins: number;
    coinsEarned: number;
    currentAttempt: number;
    maxAttempt: number;
};
// type GetTokenDetailsResponse = {

//     username: string,
//     state: string,
//     constituency: string,
//     uniqueID: string,
//     usertype: string,
//     image: string,
//     mobileno: string
// }

// type filter = {
//     state: string,
//     constituency: string,
// }


// type FeedsListResponseResult ={
//     status : string,
//     statusCode : string,
//     statusMsg : string,
//     result : FeedsListResponse,
// }

type GetFeedsRequest = {
    // API request - getFeeds, getUserPosts 
    userId?: string,
    offset: number,
    pageSize?: number,
    sortBy: 1 | 0,
    userFlag: "N" | "Y",
    state?: string | null,
    constituency?: string | null,
    type?: string | null
}

type FeedsListResponse = {
    // API response - getFeeds 
    userName: string,
    firstName: string,
    lastName: string,
    likes: number,
    shareCount: number,
    commentCount: number,
    images: string[],
    state: string,
    constituency: string,
    description: string,
    postCreationOrModificationDate: string,
    type: string,
    tinyProfilePic: string,
    profilePic: string,
    createdBy: string,
    postId: number,
    likeByMe: "0" | "1",
    tranid: string
}

type getUserPostsResponse = {
    // API response - getUserPosts 
    images: string[],
    status: 'TOBEAPPROVED' | 'DELETED' | 'REPORTED' | 'ACCEPTED' | 'REJECTED' | 'MOD_DELETED',
    // 'TOBEAPPROVED' - Post Created / Post accepted (mod report reject) by moderator
    // 'DELETED' - Post deleted by creator
    // 'REPORTED' - Post reported by other user
    // 'ACCEPTED' - not used
    // 'REJECTED' - not used
    // 'MOD_DELETED' - Post rejected (mod report accepted) by moderator [post will be only display in creator wall with 'REJECTED' status]
    // status : '1' | '2' | '3' | '4' | null  // 1 - post created, 2 - post-modified, 3 - post-deleted, 4 - post-reported
    postID: number
}

type SchemeOption = {
    id: number,
    name: string,
    img: string,
    isSelected: boolean
}


type FilterData = {
    // Stores type of filter chosen by user
    selectedState: string | null,
    selectedConstituency: string | null,
    hashdescType: string | null,
    userFlag: "N" | "Y",
}



// type feedResponse = {
//     status: string,
//     statusCode: number,
//     likeByMe: "0" | "1",
//     statusMsg: string,
//     result: FeedsListResponse[]
// }


type getProfileDetailsResponseResult = {
    // API response - getProfileDetails
    username: string,
    firstname: string,
    lastname: string,
    tinyProfilePic: string,
    posts: number,
    likes: number,
    shares: number,
}

type GetSelfieStatusRequest = {
    uuid: string,
    statusId: number
}

type GetSelfieStatusResult = {
    refId: string,
    uuid: string,
    statusId: string,
    templateId: string
    creationDate: string,
    modificationDate: string,
    slogId: string,
    lang: LanguageCode
}

type UpdateSelfieStatusRequest = {
    uuid: string,
    statusId: number,
    refId: string,
    templateId: string,
    slogId: string,
    lang: LanguageCode
}


export type {
    GetConstituencyListByStateRequest,
    GetStateListResponse,
    GetConstituencyListByStateResponse,
    ApiResponse,
    GetFeedsRequest,
    FeedsListResponse,
    getUserPostsResponse,
    SchemeOption,
    FilterData,
    getProfileDetailsResponseResult,
    GetSelfieStatusRequest,
    GetSelfieStatusResult,
    UpdateSelfieStatusRequest,
    SubmitSelfieResponse
}