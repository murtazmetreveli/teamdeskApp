import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  headerData: any = {
    title: 'Notifications',
    button_text: 'Route Complete',
    serach: false
  };
  swiperModules = [IonicSlides];
  private dataScanSubscription: Subscription;
  todayNotification: any = {};
  yesterdayNotification: any = {};
  constructor(private api: ApiService, private loadingController: LoadingController, private ref: ChangeDetectorRef) {
    this.dataScanSubscription = this.api.notificationRedirect.subscribe(async (res) => {
      if (res) {
        await this.getNotificationData();
        this.ref.detectChanges();

      }
    })
  }
  notification: any = [];
  ngOnInit() {
  }
  ionViewWillLeave() {
    this.todayNotification = {};
    this.yesterdayNotification = {};
    this.notification = [];
    if (this.dataScanSubscription) {
      this.dataScanSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.todayNotification = {};
    this.yesterdayNotification = {};
    this.notification = [];
    if (this.dataScanSubscription) {
      this.dataScanSubscription.unsubscribe();
    }
  }

  async ionViewWillEnter() {
    await this.getNotificationData();

  }
  // async getNotificationData() {
  //   const loading = await this.loadingController.create({
  //     cssClass: 'spinner', mode: 'md'
  //   });
  //   await loading.present();
  //   try {
  //     this.todayNotification = {};
  //     this.yesterdayNotification = {};
  //     this.notification = [];
  //     const status = await Network.getStatus();
  //     if (status.connected) {
  //       const notificationObservable = this.api.showNotification();
  //       notificationObservable.subscribe(async (res: any) => {
  //         if (res) {
  //           await loading.dismiss();
  //         }
  //         const today = new Date();
  //         today.setHours(0, 0, 0, 0);

  //         const yesterday = new Date();
  //         yesterday.setDate(yesterday.getDate() - 1);
  //         yesterday.setHours(0, 0, 0, 0);

  //         const groupedData: any = {};

  //         res.forEach((item: any) => {
  //           const createdAt = new Date(item.created_at);
  //           createdAt.setHours(0, 0, 0, 0);
  //           let groupKey: string;
  //           if (createdAt.getTime() === today.getTime()) {
  //             groupKey = 'Today';
  //             if (!this.todayNotification[groupKey]) {
  //               this.todayNotification[groupKey] = [];
  //             }
  //             this.todayNotification[groupKey].push(item);
  //           } else if (createdAt.getTime() === yesterday.getTime()) {
  //             groupKey = 'Yesterday';
  //             if (!this.yesterdayNotification[groupKey]) {
  //               this.yesterdayNotification[groupKey] = [];
  //             }
  //             this.yesterdayNotification[groupKey].push(item);
  //           } else {
  //             groupKey = createdAt.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  //             if (!groupedData[groupKey]) {
  //               groupedData[groupKey] = [];
  //             }
  //             groupedData[groupKey].push(item);
  //           }
  //         });

  //         // Sort the keys (dates) in descending order
  //         const sortedKeys = Object.keys(groupedData).sort((a, b) => {
  //           const dateA = new Date(a);
  //           const dateB = new Date(b);
  //           return dateB.getTime() - dateA.getTime();
  //         });

  //         // Construct the notification array in descending order of dates
  //         this.notification = sortedKeys.map(key => ({
  //           key,
  //           value: groupedData[key]
  //         }));

  //       }, async (error) => {
  //         await loading.dismiss();
  //       });
  //     }
  //     else {
  //       await loading.dismiss();
  //     }
  //   }
  //   catch (error) {
  //     await loading.dismiss();
  //     console.error("Error fetching notifications:", error);
  //   }
  // }
  async getNotificationData() {
    const loading = await this.loadingController.create({
      cssClass: 'spinner', mode: 'md'
    });
    await loading.present();
    try {
      this.todayNotification = {};
      this.yesterdayNotification = {};
      this.notification = [];
      const status = await Network.getStatus();
      if (status.connected) {
        const notificationObservable = this.api.showNotification();
        notificationObservable.subscribe(async (res: any) => {
          if (res) {
            await loading.dismiss();
          }
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);

          const groupedData: any = {};

          res.forEach((item: any) => {
            const createdAt = new Date(item.created_at);
            createdAt.setHours(0, 0, 0, 0);
            let groupKey: string;
            if (createdAt.getTime() === today.getTime()) {
              groupKey = 'Today';
              if (!this.todayNotification[groupKey]) {
                this.todayNotification[groupKey] = [];
              }
              this.todayNotification[groupKey].push(item);
            } else if (createdAt.getTime() === yesterday.getTime()) {
              groupKey = 'Yesterday';
              if (!this.yesterdayNotification[groupKey]) {
                this.yesterdayNotification[groupKey] = [];
              }
              this.yesterdayNotification[groupKey].push(item);
            } else {
              groupKey = createdAt.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
              if (!groupedData[groupKey]) {
                groupedData[groupKey] = [];
              }
              groupedData[groupKey].push(item);
            }
          });

          const sortedKeys = Object.keys(groupedData).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB.getTime() - dateA.getTime();
          });

          // Construct the notification array in descending order of dates
          this.notification = sortedKeys.map(key => ({
            key,
            value: groupedData[key]
          }));

          // this.notification = this.arrayReverseObj(groupedData);
        }, async (error) => {
          await loading.dismiss();
        });
      }
      else {
        await loading.dismiss();
      }
    }
    catch (error) {
      await loading.dismiss();
      console.error("Error fetching notifications:", error);
    }
  }


  arrayReverseObj = (obj: any) => {
    let newArray: any = []
    Object.keys(obj)
      .reverse()
      .forEach(key => {
        newArray.push({
          'key': key,
          'value': obj[key]
        })
      })
    return newArray
  }

  isArray(value: any) {
    if (Array.isArray(value)) {
      if (value.length && value[0].hasOwnProperty('created_at')) {
        value.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      }
      return value;
    } else if (value instanceof Map) {
      if (Array.from(value.values()).length && Array.from(value.values())[0].hasOwnProperty('created_at')) {
        Array.from(value.values()).sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      }
      return Array.from(value.values());
    } else {
      return [];
    }
  }

  objValue(val: any) {
    return Object.values(val);
  }


}
