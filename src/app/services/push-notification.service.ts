import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  notificationStatus: boolean = false;
  constructor(private api: ApiService, private router: Router) { }

  initPush() {
    this.notificationStatus = true;
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }
  private async registerPush() {
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        PushNotifications.register();
      }
      else {
        PushNotifications.unregister();
      }
    });
    PushNotifications.addListener('registration', async (token) => {
      const userInfo = await this.api.getLoginData();
      if (userInfo?.email) {
        if (this.notificationStatus) {
          this.notificationStatus = false;
          this.api.sendTokenToDb({
            d_name: userInfo.firstName + ' ' + userInfo.lastName,
            email: userInfo.email,
            device_token: token.value
          }).subscribe((res) => {
            // debugger
          })
        }

      }

      // debugger
    });
    PushNotifications.addListener('registrationError', (err) => {
      console.log(err);
    });
    PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);

    })
    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      if (notification.actionId) {
        if (this.router.url === '/tabs/notification') {
          this.api.notificationRedirect.next(true);
        }
        else {
          this.router.navigateByUrl('/tabs/notification');
        }
      }
    });
  }
}
