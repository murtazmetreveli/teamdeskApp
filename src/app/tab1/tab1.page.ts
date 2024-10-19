import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { Geolocation, GeolocationOptions } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { AnalyticService } from '../services/analytics/analytic.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  logData: any = [];
  handlerMessage = '';
  authData: any;
  location: any;
  disabled: boolean = false;
  data ={};
  data1 ={};
  data2 ={};
  data3 ={};
  data4 ={};

  constructor(private routes: Router, private api: ApiService, private router: Router, private alertController: AlertController,private analyticservice: AnalyticService) {
    this.logData = this.api.getLoginData()
    this.headerObject.main_title = 'WELCOME, <br>' + this.logData.firstName + '!';
    this.headerObject.title = this.logData.email ? this.logData.email : this.logData.firstName
  }

  headerObject: any = {
    main_title: 'WELCOME,<br>' + this.logData.firstName + '!',
    title: 'info@mrmccouriers.com',
    sub_titile: 'Premium Driver Account'
  }
  async logout() {
    await localStorage.removeItem('auth');
   this.data1 = {"remove_authData":"Localstorage auth data remove"};
   this.analyticservice.log({name:'logout_localstorage_data_remove',params:this.data1});
   await localStorage.removeItem('chunk');
   this.data2 = {"remove_chunk":"Localstorage chunk data remove"}
   this.analyticservice.log({name: 'logout_chunk_data_remove',params:this.data2});
   await localStorage.clear();
   this.routes.navigate(['/login']);
   this.data= { "tab_change":"tab change tabs/setting to login" } 
   this.analyticservice.log({name: 'logout_tab_change',params:this.data});
  }
  async beginRoute() {
    this.disabled = true;
    const statusNet = await Network.getStatus();
    if (statusNet.connected) {
      try {
        await Geolocation.getCurrentPosition({
          timeout: 1000,
        }).then(async (coordinates: any) => {
          const lat = coordinates.coords.latitude;
          const lng = coordinates.coords.longitude;
          this.location = `${lat}, ${lng}`
          this.authData = JSON.parse(localStorage.getItem("auth") || '[]')
          const data: any = {
            f_41219065: new Date().toISOString(),//Date/Time
            f_41219075: 'In Progress',//Status
            f_41238381: this.location?.toString(),//location
          }
          this.api.postRouteComplete(data).subscribe(async (res: any) => {
            if (res) {
              this.disabled = false;
              await localStorage.setItem('begin_route', 'true');
              let data3  = {"status":"true"}
              this.analyticservice.log({name: 'localstorage_begin_route_data_set',params:data3});
              this.router.navigateByUrl('/tabs/scan-collection');
              let data4  = {"tab_change":"tab change from tab1 to tabs/scan-collection"}
              this.analyticservice.log({name: 'begin_route_tab_change',params:data4});
            }
          })
        }).catch(async (error: any) => {
          this.disabled = false;

          setTimeout(async () => {
            let string = '';
            if (Capacitor.getPlatform() === 'ios') {
              string = '( setting > privacy & Security > Location Services)';
            } else {
              string = '( setting > Location )';
            }
            const alert = await this.alertController.create({
              header: 'Enable Location Services',
              message: `Please enable location services in your device settings to use this feature. ${string}`,
              cssClass: 'alertControl',
              mode: 'ios',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {

                  },
                },
                {
                  text: 'Go to Settings',
                  handler: async () => {
                    if (Capacitor.getPlatform() === 'ios') {
                      await AppLauncher.openUrl({ url: 'app-settings:' });
                    } else if (Capacitor.getPlatform() === 'android') {
                      await AppLauncher.openUrl({ url: 'com.android.settings' });
                    } else {
                      console.log('Web!');
                    }
                  },
                },
              ],
            });
            await alert.present();
          }, 1000);
        })
      } catch (error) {
        this.disabled = false;

        if (Capacitor.getPlatform() != 'ios') {
          const alert = await this.alertController.create({
            header: 'Enable Location Services',
            message: 'Please enable location services in your device settings to use this feature.',
            cssClass: 'alertControl',
            mode: 'ios',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {

                },
              },
              {
                text: 'Go to Settings',
                handler: async () => {
                  if (Capacitor.getPlatform() === 'ios') {
                    // await AppLauncher.openUrl({ url: 'com.apple.preferences' });
                  } else if (Capacitor.getPlatform() === 'android') {
                    await AppLauncher.openUrl({ url: 'com.android.settings' });
                  } else {
                    console.log('Web!');
                  }
                  // You can instruct users to manually enable location services here
                },
              },
            ],
          });
          await alert.present();
          // await AppLauncher.openUrl({ url: 'android.settings.LOCATION_SOURCE_SETTINGS' });
          // 
        }
      }
    }
    else {
      this.disabled = false;
      const alert = await this.alertController.create({
        header: 'Check Your Internet Connection!',
        cssClass: 'alertControl',
        mode: 'ios',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',

          },
        ],
      });
      await alert.present();
    }

  }
}
