import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as config from '../config/config.json';
import { Config } from '../types/Config';
import { ConfigJson, LanguageCode } from '../types/LanguageTypes';
import { HttpClient } from '@angular/common/http';
import constants from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnInit {

  

  constructor(private http: HttpClient) 
  { 
    this.configAPICall() 
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  config = new BehaviorSubject<ConfigJson>(JSON.parse(JSON.stringify(config)));
  currentLanguage = new BehaviorSubject<LanguageCode>('eng')
  CurrentConfig = new BehaviorSubject<Config>(
    this.config.value[this.currentLanguage.value]
  )

  setConfig(configData : any){
    this.CurrentConfig.next(JSON.parse(JSON.stringify(configData)));
  }

  setLanguage(lang : LanguageCode){
    this.currentLanguage.next(lang)
    this.CurrentConfig.next(this.config.value[lang])
  }

  configAPICall() {
    if (!constants.configJSON || typeof constants.configJSON !== 'string') {
      return;
    }
    // Config API call
    this.http.get<ConfigJson>(constants.configJSON, { responseType: 'json' }).subscribe({
      next: (data) => {
        if (data) {
          // console.log(data);
          this.config.next(data);
          this.currentLanguage.next(this.config.value.currentLanguage)
          this.CurrentConfig.next(data[this.currentLanguage.value])
          // this.config = this.CurrentConfig.value;
        }
      },
      error: (err) => {

      }
    })
  }

}
