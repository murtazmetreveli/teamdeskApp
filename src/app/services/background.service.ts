import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core'; // Import Capacitor
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DbService } from './db.service';
import { Network } from '@capacitor/network';
import { AnalyticService } from './analytics/analytic.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  public attachMentName: any;
  public attachMent: any;
  public tempData: any = [];
  public tempDropData: any = [];
  public logData: any;
  public attachMentDropOffName: any;
  public attachDropOFFMent: any;
  constructor(private api: ApiService, private db: DbService, private analyticservice: AnalyticService,
              private platform: Platform) {
    this.platform.ready().then(() => {
      if (Capacitor.isNativePlatform()) {
        // Only execute this code on native mobile platforms (Android/iOS)
        this.getDropOffFilesView();
        this.getFilesView();
      } else {
        console.log('This code is not available on web.');
      }
    });
  }
  async apiCall(response: any) {
    if (response?.rows?.length > 0) {
      for (let i = 0; i < response?.rows?.length; i++) {
        let item = response.rows.item(i);
        this.tempData.push(item)
      }
      await this.db.deleteCollectionData();
    } else {
      if (response?.length > 0) {
        this.tempData = response;
      }
    }
    const authData = JSON.parse(localStorage.getItem("auth") || '[]');
    if (this.tempData?.length > 0) {
      let tempIncrement = 0;
      for (let i = 0; i < this.tempData?.length; i++) {
        tempIncrement++;
        let item = this.tempData[i];
        var data: any = {
          f_36977207: item?.location || item.Location,//Location
          f_36982197: item.Status,// Status
          f_36977209: item.practiceId,//Barcode Practice
          f_36982194: authData?.firstName,//Driver
          f_36982195: item.date,//Date/Time Collected
          f_38053933: item.details,//Details
          f_43396738: '',//FEE
          f_41221522: '0',//demodata
          f_38057900: '',//Email
          f_43396737: '0',//Lab Services Direct
        }
        if (typeof item.image != 'string') {
          if (item?.image?.length > 0) {
            item.image = JSON.stringify(item.image)
          }
        }
        if (item.image && typeof item.image == 'string') {
          for (let k = 0; k < JSON.parse(item.image)?.length && k < this.attachMentName?.length; k++) {
            if (JSON.parse(item.image)[k]) {
              const image = JSON.parse(item.image)[k]
              const key = this.attachMentName[k];
              const file = await this.dataURLtoFile(image, 'photo.jpg');
              data[key] = file;
            }
          }
        }
        new Promise(async (res, rej) => {
          this.api.postCollection(data).subscribe(async (response) => {
            let data1 = { "status": "true" }
            this.analyticservice.log({ name: 'api_calling', params: data });
            this.analyticservice.log({ name: 'get_api_calling_response', params: response });
            if (response.length > 0) {
              this.tempData = this.tempData.splice(i, 0);
              return res(res);
            }
          }, (error) => {
            // let notInsertData: any = [{
            //   image: item.image,
            //   Location: data.f_36977207,
            //   details: data.f_38053933,
            //   Status: data.f_36982197,
            //   practiceId: data.f_36977209,
            //   date: data.f_36982195
            // }];
            // this.db.insertRecord(notInsertData)
            let data1 = { "status": "false" }
            this.analyticservice.log({ name: 'api_calling_error', params: data1 });
            console.error('Error in API call:', error);
            rej(error);
          }
          )
        })
      }
      this.tempData = [];
    }
  }

  getFilesView() {
    this.api.getAttachment().subscribe((res: any) => {
      let data1 = { "status": "true" }
      this.analyticservice.log({ name: 'get_fileview_api_calling', params: data1 });
      this.attachMent = res.columns.filter((x: any) => x.type === "Attachment");
      this.attachMentName = this.attachMent.map((x: any) => {
        return x.name;
      })
    })
  }
  getDropOffFilesView() {
    this.api.getDropOffAttachment().subscribe((res: any) => {
      let data1 = { "status": "true" }
      this.analyticservice.log({ name: 'get_dropofffiles_api_calling', params: data1 });
      this.attachDropOFFMent = res.columns.filter((x: any) => x.type === "Attachment");
      this.attachMentDropOffName = this.attachDropOFFMent.map((x: any) => {
        return x.name;
      })
    })
  }
  async apiDropOffCall(response: any) {
    if (response?.rows?.length > 0) {
      for (let i = 0; i < response?.rows?.length; i++) {
        let item = response.rows.item(i);
        this.tempDropData.push(item)
      }
      await this.db.deleteDropOffData();
    } else {
      if (response?.length > 0) {
        this.tempDropData = response;
      }
    }
    const authData = JSON.parse(localStorage.getItem("auth") || '[]');
    if (this.tempDropData?.length > 0) {
      let tempIncrement = 0;
      for (let i = 0; i < this.tempDropData?.length; i++) {

        tempIncrement++;
        let item = this.tempDropData[i];
        var data: any = {
          f_38005103: item?.location || item.Location,//Location
          f_36981613: item.date, //Date/Time
          f_36981614: authData.firstName,//Driver
          f_41209226: false,//All Boxes Empty
          f_38005104: item.practiceId,
          f_50916204: item.details,//details

        }
        if (typeof item.image != 'string') {
          if (item?.image?.length > 0) {
            item.image = JSON.stringify(item.image)
          }
        }
        if (item.image && typeof item.image == 'string') {
          for (let k = 0; k < JSON.parse(item.image)?.length && k < this.attachMentDropOffName?.length; k++) {
            if (JSON.parse(item.image)[k]) {
              const image = JSON.parse(item.image)[k]
              const key = this.attachMentDropOffName[k];
              const file = await this.dataURLtoFile(image, 'photo.jpg');
              data[key] = file;
            }
          }
        }
        new Promise(async (res, rej) => {
          this.api.dropOffCollection(data).subscribe(async (response) => {
            if (response.length > 0) {
              var routeData: any = {
                f_41219065: data.f_36981613,//Date/Time
                f_41219075: 'Complete',//Status
                f_41238381: data.f_38005103,//location
              }

              this.api.postRouteComplete(routeData).subscribe(async (res: any) => {
                if (res) {
                  await localStorage.setItem('begin_route', 'false');
                }
              })
              this.tempDropData = this.tempDropData.splice(i, 0);
              return res(res);
            }
          }, (error) => {
            // let notInsertData: any = [{
            //   image: item.image,
            //   Location: data.f_38005103,
            //   details: data.f_50916204,
            //   practiceId: data.f_38005104,
            //   date: data.f_36981613
            // }];
            // this.db.insertDropOffRecord(notInsertData)
            console.error('Error in API call:', error);
            rej(error);
          }
          )
        })
      }
      this.tempDropData = [];
    }
  }
  dataURLtoFile(dataUrl: string, filename: string) {
    let arr: any = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/),
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
