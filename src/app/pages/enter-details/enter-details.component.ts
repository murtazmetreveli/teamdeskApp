import { Location } from '@angular/common';
import { BehaviorSubject, catchError } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Network } from '@capacitor/network';
import { BackgroundTask } from '@capawesome/capacitor-background-task';
import { Storage } from '@ionic/storage-angular';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';

// sqlite

import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx'
import { DbService } from 'src/app/services/db.service';
import { BackgroundService } from 'src/app/services/background.service';
import { AnalyticService } from 'src/app/services/analytics/analytic.service';
@Component({
  selector: 'app-enter-details',
  templateUrl: './enter-details.component.html',
  styleUrls: ['./enter-details.component.scss']
})
export class EnterDetailsComponent implements OnInit {


  headerData: any = {
    title: 'ENTER DETAILS',
    button_text: 'Route Complete',
    serach: false
  };
  collectionDetails: any = [
    { name: 'Route Complete' },
    { name: 'Scan' },

  ]
  attachMentName: any;
  attachMent: any;
  details: string = '';
  practiceId!: any;
  image: any;
  location: any;
  buttonDisabled: boolean = false;
  authData: any;
  dropOff: any;
  localStorData: any;
  constructor(private Platform: Platform, private navCtrl: NavController, private backgroundService: BackgroundService, private db: DbService, private router: Router, private api: ApiService, private storage: Storage, private sqlite: SQLite, private loadingController: LoadingController, public alertController: AlertController, private route: ActivatedRoute, private analyticservice: AnalyticService) {
    let a = this.api.netWorkOn.asObservable()
    this.dropOff = this.route.snapshot.queryParams['drop_off'];
    this.headerData.sub_title = 'Enter delivery details below';

  }
  async ngOnInit() {
    try {
      this.authData = JSON.parse(localStorage.getItem("auth") || '[]');
      const data = await this.db.getDropOffData();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }
  async done() {
    try {
      if (this.dropOff) {
        this.localStorData = await this.storage.get("drop_off") || '[]';
      }
      else {
        this.localStorData = await this.storage.get("outbox") || '[]';
      }
      let detailInfo = JSON.parse(this.localStorData) || [];
      if (!(detailInfo instanceof Array))
        detailInfo = [detailInfo];
      detailInfo[0].details = this.details;
      detailInfo[0].date = new Date().toISOString();
      if (this.dropOff) {
        await this.storage.set("drop_off", JSON.stringify(detailInfo));
        this.buttonDisabled = true;
        this.dropOffData();
      }
      else {
        await this.storage.set("outbox", JSON.stringify(detailInfo));
        this.buttonDisabled = true;
        this.CollectionData();
      }
    } catch (error) {
      console.error('Error in done:', error);
    }


  }
  async CollectionData() {
    this.storeCollectionData();
  }
  async storeCollectionData() {
    try {
      let collection: any = await this.storage.get("outbox") || '[]'
      const serializedArray = JSON.parse(collection);
      this.analyticservice.log({ name: 'store_collectionData', params: serializedArray });
      const status = await Network.getStatus();
      if (status.connected) {
        this.backgroundService.apiCall(serializedArray);

      } else {
        let a = await this.db.insertRecord(serializedArray);
      }
      this.db.dataScan.next(true);
      if (this.Platform.is('ios')) {
        this.navCtrl.navigateRoot(['/tabs/scan-collection']);
      } else {
        this.router.navigateByUrl('/tabs/scan-collection');
      }
      // this.router.navigateByUrl('/tabs/scan-collection');
    } catch (error) {
      console.error('Error in storeCollectionData:', error);
    }

  }
  async dropOffData() {
    try {
      let dropCollection: any = await this.storage.get("drop_off") || '[]'
      const dropOffArray = JSON.parse(dropCollection);
      const status = await Network.getStatus();
      if (status.connected) {
        this.backgroundService.apiDropOffCall(dropOffArray);
      }
      else {
        let a = await this.db.insertDropOffRecord(dropOffArray);
      }
      // this.router.navigateByUrl('/tabs/drop-off');
      this.db.dataScan.next(true);
      if (this.Platform.is('ios')) {
        this.navCtrl.navigateRoot(['/tabs/drop-off']);
      } else {
        this.router.navigateByUrl('/tabs/drop-off');
      }
    } catch (error) {
      console.error('Error in done:', error);
    }


  }
  async markLocation(id: number) {
    var data = {
      email: "sam@mrmccouriers.com",
      password: "sXR&D5$B4k7naha8",
      invoice_number: id
    }
    this.api.markLocation(data).subscribe((res) => {
    })
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'spinner'
    });
    await loading.present();
    return loading;
  }
  capitalizeFirstLetter() {
    if (this.details.length > 0) {
      this.details = this.details.charAt(0).toUpperCase() + this.details.slice(1);
    }
  }
}
