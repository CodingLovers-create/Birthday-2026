
import { Button, FilterButton, ReportDeleteButton } from "./Buttons"
import { Caption } from "./CreatePost"
import { sloganList, Template, wishesList } from "./Template"

type Config = {
    internet: {
        text: string;
    }
    templatePage:
    {
        header: string,
        templates: Template[],
        sloganHeader: string,
        sloganList: sloganList[],
        infoText: string,
        infoText1: string,
        italicSymbol: string,
        infoText2: string,
        infoText3: string,
        instruction: string,
        nextStepBtns: Button,
        exploreText1: string,
        redirectText: string,
        exploreText2: string,
        displayLabel: string,
        sloganLabel: string,
        editName: string,
        errorMessage: string,
        nameErrorBtns: Button,
        errorIconPath: string
    },
    createPostPage:
    {
        header: string,
        title: string,
        caption: Caption,
        buttons: Button,
        gallery_btn: string,
        //error start
        errorMessage: string,
        noFaceErrorMessage: string,
        multipleFaceErrorMessage: string,
        imageUploadErrorHead: string,
        imageUploadErrorMessage_1: string,
        imageUploadErrorMessage_2: string,
        fileSizeErrorMessage_1: string,
        fileSizeErrorMessage_2: string,
        genericErrorMessage_1: string,
        genericErrorMessage_2: string,
        fileFormatErrorHead: string,
        fileFormatErrorMessage_1: string,
        fileFormatErrorMessage_2: string,
        isPerfectImageMessage_1: string,
        isPerfectImageMessage_2: string,
        //error end
        errorExitButtons: Button,
        warnExitButtons: Button,
        exitPopupText: string,
        exitButtons: Button,
        //Inspire me popup
        crossIcon: string,
        greenRadio: string,
        whiteRadio: string,
        wishesHeader: string,
        wishesList: wishesList[],
        confirmHeading: string,
        confirmYes: string,
        confirmNo: string
    },

    wallPage:
    {
        header: string,
        buttons: Button,
        exitMessage: string
        filterText: string,
        filterButtons: FilterButton,
        stateLabel: string,
        constituencyLabel: string,
        ReportDeleteButtons: ReportDeleteButton,
        sortText: string,
        wallFilter: string,
        wallSort: string,
        wallprofile: string,
        noFoundPost: string

    }

    instructionsPage:
    {
        textMain: string,
        text1a: string,
        text1b: string,
        text1c: string,
        text2a: string,
        text2b: string,
        text3: string,
        text4: string,
        text5: string,
        text6: string,
        heading: string,
        header: string,
        button: string
    },
    certificatePage:
    {
        header: string;
        title: string;
        description: string;
        subDescription: string;
        badgeTextA: string;
        badgeTextB: string;
        badgeName: string;
        badgeImg: string;
        pointImg: string;
        shareBtn: string;
        downloadBtn: string;
        mediaWallRedirect: string;
    },
    profilePage:
    {
        header: string,
        profile: string,
        post: string,
        posts: string,
        like: string,
        likes: string,
        share: string,
        shares: string,
        reported: string,
        awaiting_approval: string,
        rejected: string
    },
    userPostsPage:
    {
        header: string,
        noFoundPost: string
    },
    postShared:
    {
        readMore: string,
        readLess: string,
        ReportDeleteButtons: ReportDeleteButton
    },
    deleteShared:
    {
        delete_question: string,
        report_question: string,
        yesNoButtons: Button
    },
    deleteReportToast:
    {
        delete_toast: string,
        report_toast: string
    },
    cameraLoader:
    {
        cancel_wait: string,
        cancel_text: string,
        cancel_btn: string,
        uploading: string,
        uploaded: string,
        processing: string,
        processed: string,
        info_text: string,
        wait_text: string,
    },
    fileSizeError:
    {
        line_1: string,
        line_2_a: string,
        line_2_b: string,
        btn_text: string
    },
    exitPopup: {
        popupText: string;
        yesButton: string;
        noButton: string;
    }

}

export type {
    Config
}