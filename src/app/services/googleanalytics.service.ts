import { Injectable, OnInit } from '@angular/core';
import { ConfigService } from './config.service';
import { Config } from '../types/Config';
import { config } from 'rxjs';



declare const dataLayer:any;

@Injectable({
  providedIn: 'root'
})
export class GoogleanalyticsService{
  config!: Config;

  constructor(
    private configService: ConfigService,
  ) { 
    this.configService.CurrentConfig.subscribe((data: Config) => {
      this.config = data;
      
    });
  }



  pageLoad(pageTitle:any,page_lang:any) {
    const uuid = sessionStorage.getItem('userId');
    var pageData: any = {};
    try {
      pageData = {
        event: "pageload",
        page_title: pageTitle,
        user_id: uuid,
        language : page_lang

      };
      dataLayer.push(pageData);
      // console.log('pageLoad analytics successful');
    } catch (e) {
      // console.log('pageload GA Tagging page view error');
    }
  }
 
  customEvent(pageTitle:any, action:any,page_lang:any) {
    const uuid = sessionStorage.getItem('userId');
    var linkData: any = {};
    try {
      linkData = {
        event: "select_option",
        page_title: pageTitle,
        userAction: action,
        user_id: uuid,
        language : page_lang
      };
      dataLayer.push(linkData);
      // console.log(linkData.userAction + ' customEvent analytics successful');
    } catch (e) {
      // console.log('pageload GA Tagging custom event error');
    }
  }

  customEventSelfieData(pageTitle:any, action:any,page_lang:any, templateId:any, sloganId:any, name:any) {
    const uuid = sessionStorage.getItem('userId');
    const template_name = this.config.templatePage.templates[Number(templateId)-1].heading;
    const slogan_name = this.config.templatePage.sloganList[Number(sloganId)-1].sloganText;
    var linkData: any = {};
    try {
      linkData = {
        event: "select_option",
        page_title: pageTitle,
        userAction: action,
        template_id: templateId,
        slogan_id: sloganId,
        slogan_name: slogan_name,
        template_name: template_name,
        name: name,
        user_id: uuid,
        language : page_lang
      };
      dataLayer.push(linkData);
      // console.log(linkData.userAction + ' customEvent analytics successful');
    } catch (e) {
      // console.log('pageload GA Tagging custom event error');
    }
  }

  customEventPost(pageTitle:string, action:string,page_lang:string, templateId:string, sloganId:string, name:string, caption: string) {
    const uuid = sessionStorage.getItem('userId');
    const template_name = this.config.templatePage.templates[Number(templateId)-1].heading;
    const slogan_name = this.config.templatePage.sloganList[Number(sloganId)-1].sloganText;
    var linkData: any = {};
    try {
      console.log("customEventPost")
      linkData = {
        event: "select_option",
        page_title: pageTitle,
        userAction: action,
        template_id: templateId,
        template_name: template_name,
        slogan_id: sloganId,
        slogan_name: slogan_name,
        name: name,
        caption: caption,
        user_id: uuid,
        language : page_lang
      };
      dataLayer.push(linkData);
      // console.log(linkData.userAction + ' customEvent analytics successful');
    } catch (e) {
      // console.log('pageload GA Tagging custom event error');
    }
  }

  customEventInspire(pageTitle:string, action:string,page_lang:string, caption: string) {
    const uuid = sessionStorage.getItem('userId');
    var linkData: any = {};
    try {
      linkData = {
        event: "select_option",
        page_title: pageTitle,
        userAction: action,
        caption: caption,
        user_id: uuid,
        language : page_lang
      };
      dataLayer.push(linkData);
      // console.log(linkData.userAction + ' customEvent analytics successful');
    } catch (e) {
      // console.log('pageload GA Tagging custom event error');
    }
  }

  customEventUploadTime(pageTitle:string, action:string,page_lang:string, upload_duration: string) {
    const uuid = sessionStorage.getItem('userId');
    var linkData: any = {};
    try {
      linkData = {
        event: "select_option",
        page_title: pageTitle,
        userAction: action,
        upload_duration: upload_duration,
        user_id: uuid,
        language : page_lang
      };
      dataLayer.push(linkData);
      // console.log(linkData.userAction + ' customEvent analytics successful');
    } catch (e) {
      // console.log('pageload GA Tagging custom event error');
    }
  }
  customEventSelectTemplate(pageTitle:any, action:any,page_lang:any, templateId:any) {
    const uuid = sessionStorage.getItem('userId');
    
    
    const template_name = this.config.templatePage.templates[templateId-1].heading;
    
    var linkData: any = {};
    try {
      linkData = {
        event: "select_option",
        page_title: pageTitle,
        userAction: action,
        templateId: templateId,
        user_id: uuid,
        template_name: template_name,
        language : page_lang
      };
      dataLayer.push(linkData);
      // console.log(linkData.userAction + ' customEvent analytics successful');
    } catch (e) {
      // console.log('pageload GA Tagging custom event error');
    }
  }
  customEventSelectSlogan(pageTitle:any, action:any,page_lang:any, templateId:any, sloganId: any) {
    const uuid = sessionStorage.getItem('userId');
    console.log(templateId);
    
    const template_name = this.config.templatePage.templates[Number(templateId)-1].heading;
    const slogan_name = this.config.templatePage.sloganList[Number(sloganId)-1].sloganText;
    
    var linkData: any = {};
    try {
      linkData = {
        event: "select_option",
        page_title: pageTitle,
        userAction: action,
        templateId: templateId,
        user_id: uuid,
        template_name: template_name,
        slogan_id: sloganId,
        slogan_name: slogan_name,
        language : page_lang
      };
      dataLayer.push(linkData);
      // console.log(linkData.userAction + ' customEvent analytics successful');
    } catch (e) {
      // console.log('pageload GA Tagging custom event error');
    }
  }

}
