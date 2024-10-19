import { NotificationsComponent } from './../notifications/notifications.component';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AppLauncher, AppLauncherPlugin } from '@capacitor/app-launcher';
import { Camera, CameraOptions } from '@capacitor/camera';
import { Capacitor, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { AnalyticService } from 'src/app/services/analytics/analytic.service';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  logData: any = [];

  cameraPermission: boolean = false;
  notificationEnabled: boolean = false;
  headerObject: any = {
    // main_title: 'WELCOME, <br>' + this.logData.firstName + '!',
    title: 'info@mrmccouriers.com',
    sub_titile: 'Premium Driver Account'
  }
  constructor(public platform: Platform, private api: ApiService, private routes: Router,private analyticservice: AnalyticService) {
    this.logData = this.api.getLoginData()
    this.headerObject.main_title = 'WELCOME, <br>' + this.logData.firstName + '!';
    this.headerObject.title = this.logData.email ? this.logData.email : this.logData.firstName;

  }

  ngOnInit() {

  }
  notificationStatus() {
    const userInfo = this.api.getLoginData();
    if (this.notificationEnabled == false) {
      this.notificationEnabled = true;
      this.api.sendStatus({
        d_name: userInfo.firstName + ' ' + userInfo.lastName,
        email: userInfo.email,
        status: this.notificationEnabled

      }).subscribe((res) => {

      })
      let data = {"status":"true"}
      this.analyticservice.log({name: 'notifcation_status',params:data});
    }
    else {
      this.notificationEnabled = false;
      this.api.sendStatus({
        d_name: userInfo.firstName + ' ' + userInfo.lastName,
        email: userInfo.email,
        status: this.notificationEnabled
      }).subscribe((res) => {
      })
      let data = {"status":"false"}
      this.analyticservice.log({name: 'notifcation_status',params:data});
    }
    // console.log(this.notificationEnabled)
  }

  async logout() {
    await localStorage.removeItem('auth');
    let data = {"remove_authData":"Localstorage auth data remove"};
    this.analyticservice.log({name:'logout_localstorage_data_remove',params:data});
    await localStorage.removeItem('chunk');
    let data1 = {"remove_chunk":"Localstorage chunk data remove"};
    this.analyticservice.log({name:'logout_chunk_localstorage_data_remove',params:data1});
    await localStorage.clear();
    this.routes.navigate(['/login']);
    let data2 = { "tab_change":"tab change tabs/setting to login" } 
    this.analyticservice.log({name: 'logout_tab_change',params:data2});
  }
  async openAppSetting() {
    await AppLauncher.openUrl({ url: 'app-settings:' });

  }
  async location() {
    if (Capacitor.getPlatform() == 'android') {
      await AppLauncher.openUrl({ url: 'com.android.settings' });
    }
    else {
      await AppLauncher.openUrl({ url: 'com.apple.preferences' });
    }
  }
  toggleCameraPermission() {
    if (this.cameraPermission) {
      console.log("camere permission on", this.cameraPermission)
      this.requestCameraPermissions();
      let data = {"status":"true"}
      this.analyticservice.log({name: 'camera_permission_status',params:data});
    } else {
      console.log("camere permission off", this.cameraPermission)
      this.revokeCameraPermissions();
      let data = {"status":"false"}
      this.analyticservice.log({name: 'camera_permission_status',params:data});
    }
  }

  async requestCameraPermissions() {
    try {
      const result = await Camera.requestPermissions({ permissions: ['camera'] });
      this.cameraPermission = result.camera === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
    }
  }

  async revokeCameraPermissions() {
    try {
      const result = await Camera.requestPermissions({ permissions: ['camera'] });
      this.cameraPermission = result.camera === 'denied';
    } catch (error) {
      console.error('Error revoking camera permissions:', error);
    }
  }
}
