import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppLauncher } from '@capacitor/app-launcher';
import { Capacitor } from '@capacitor/core';
import { ApiService } from 'src/app/services/api.service';
import { Geolocation, GeolocationOptions } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
  @Input('headerObj') headerObj: any;
  @Input('collectionData') collectionData: any = [];
  @Input('outBoxData') outBoxData: any = [];
  @Input('outBox') outBox: boolean;
  @Output('collectionSearch') collectionSearch = new EventEmitter<any>()
  @Output('outBoxSearch') outBoxSearch = new EventEmitter<any>()
  collectionDataTemp: any[] = []
  outBoxTemp: any[] = []
  ngOnInit() {

  }
  authData: any;
  location: any;
  dropOff: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute, private api: ApiService, private alertController: AlertController) {
    this.dropOff = this.route.snapshot.queryParams['drop_off'];
  }


  async goToDrop() {
    this.router.navigateByUrl('/tabs/drop-off');
    try {
      await Geolocation.getCurrentPosition({
        timeout: 1000,
      }).then(async (coordinates: any) => {
        const lat = coordinates.coords.latitude;
        const lng = coordinates.coords.longitude;
        this.location = `${lat}, ${lng}`
        this.authData = JSON.parse(localStorage.getItem("auth") || '[]')


        this.router.navigateByUrl('/tabs/drop-off');

      }).catch(async (error: any) => {
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
                  // You can instruct users to manually enable location services here
                },
              },
            ],
          });
          await alert.present();
        }, 1000);
      })
    } catch (error) {
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
  goToHome() {
    this.router.navigateByUrl('/tabs/tab1');

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.collectionDataTemp = JSON.parse(JSON.stringify(this.collectionData));
      this.outBoxTemp = JSON.parse(JSON.stringify(this.outBoxData));
    }, 2000);
  }
  onInput(e: any) {
    if (this.outBox) {
      if (e.detail.value) {
        const targetValue: any[] = [];
        this.outBoxTemp.forEach((value: any) => {
          let keys = Object.keys(value);
          for (let i = 0; i < keys.length; i++) {
            if (value[keys[i]] && value[keys[i]]?.toString()?.toLocaleLowerCase()?.includes(e.detail.value?.toString()?.toLocaleLowerCase())) {
              targetValue.push(value);
            }
          }
        });
        this.outBoxSearch.emit(targetValue);
      } else {
        this.outBoxSearch.emit(this.outBoxTemp);
      }
    } else {
      if (e.detail.value) {
        const targetValue: any[] = [];
        this.collectionDataTemp?.forEach((value: any) => {
          let keys = Object.keys(value);
          for (let i = 0; i < keys.length; i++) {
            if (value[keys[i]] && value[keys[i]]?.toString()?.toLowerCase()?.includes(e.detail.value?.toString()?.toLowerCase())) {
              targetValue.push(value);

            }
          }
        });
        this.collectionSearch.emit(targetValue);
      } else {
        this.collectionSearch.emit(this.collectionDataTemp);

      }
    }


  }





  clearData() {
    // console.log('this.collectionDataTemp', this.collectionDataTemp)
    this.collectionSearch.emit(this.collectionDataTemp);
    this.outBoxSearch.emit(this.outBoxTemp);

  }
}
