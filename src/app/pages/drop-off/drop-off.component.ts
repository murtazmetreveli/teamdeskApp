import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Geolocation, GeolocationOptions } from '@capacitor/geolocation';

import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { AppLauncher } from '@capacitor/app-launcher';
import { Capacitor } from '@capacitor/core';
import { ModalController, AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { AnalyticService } from 'src/app/services/analytics/analytic.service';
@Component({
  selector: 'app-drop-off',
  templateUrl: './drop-off.component.html',
  styleUrls: ['./drop-off.component.css']
})
export class DropOffComponent {
  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;
  public formGroup = new FormGroup({
    formats: new FormControl([]),
    lensFacing: new FormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new FormControl(0),
    googleBarcodeScannerModuleInstallProgress: new FormControl(0),
  });
  public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;
  authData: any;
  headerData: any = {
    title: 'Scan Drop-Off Code',

  }
  isAlertOpen = false;
  isLocationPopup = false;
  scanerLoader: any;
  location: any;
  public alertButtons = ['Done'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  constructor(private Platform:Platform,private navCtrl:NavController,private readonly ngZone: NgZone, private readonly dialogService: ModalController, private api: ApiService, private alertController: AlertController, private router: Router, private loadingController: LoadingController, private storage: Storage,private analyticservice: AnalyticService) {
  }


  ionViewWillEnter() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
    BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event) => {
          this.ngZone.run(() => {
            // console.log('googleBarcodeScannerModuleInstallProgress', event);
            const { state, progress } = event;
            this.formGroup.patchValue({
              googleBarcodeScannerModuleInstallState: state,
              googleBarcodeScannerModuleInstallProgress: progress,
            });
          });
        }
      );
    });
    this.installGoogleBarcodeScannerModule();
    this.scan();
  }
  async done() {
    this.dialogService.dismiss()
    if(this.Platform.is('ios')){
      const navigationExtras = {
        queryParams: {
          drop_off: true
        }
      };
      this.navCtrl.navigateRoot(['/upload-images'], navigationExtras);
      }else{
    await this.router.navigateByUrl('upload-images?drop_off=' + true);
  }

    // await this.setOpen(false);
    // this.authData = JSON.parse(localStorage.getItem("auth") || '[]')
    // // const a: any = await this.getLocation(this.barcodes[0].displayValue);
    // // console.log("--------------a----------------------", a);
    // var data: any = {
    //   f_38005103: this.location,//Location
    //   f_36981613: new Date().toISOString(), //Date/Time
    //   f_36981614: this.authData.firstName,//Driver
    //   f_41209226: false,//All Boxes Empty
    //   f_38005104: this.barcodes[0].displayValue
    // }
    // this.api.dropOffCollection(data).subscribe((res: any) => {
    //   if (res) {
    //     this.router.navigateByUrl('/tabs/tab3');
    //   }
    // })
  }
  getLocation(id: any) {
    return new Promise((resolve, reject) => {
      this.api.getLocationPractice(id).subscribe((res: any) => {
        let data = {"status":"true" }
        this.analyticservice.log({name: 'get_location_status',params:data});
        return resolve(res[0]);
      })
    })

  }
  public async scan(): Promise<void> {
    this.scanerLoader = await this.loadingController.create({
      cssClass: 'spinner', mode: 'md'
    });
    await this.scanerLoader.present();
    try {
      const formats = this.formGroup.get('formats')?.value || [];
      const { barcodes } = await BarcodeScanner.scan();

      this.barcodes = barcodes;
      if (this.barcodes) {
        let practiceId = {
          "practiceId": this.barcodes[0].displayValue
        }
        await this.storage.set("drop_off", JSON.stringify(practiceId));
        this.analyticservice.log({name: 'drop_off_event',params:practiceId});
        await this.printCurrentPosition()
      }
    } catch (error) {
      console.error('Error scanning barcodes:', error);
      this.scanerLoader?.dismiss();


    }

  }
  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  async printCurrentPosition() {
    try {
      await Geolocation.getCurrentPosition({
        timeout: 1000,
      }).then(async (coordinates) => {
        const lat = coordinates.coords.latitude;
        const lng = coordinates.coords.longitude;
        var location = JSON.parse(await this.storage.get("drop_off") || '[]')
        if (!(location instanceof Array))
          location = [location]; // if not, create one
        location[0].Location = `${lat}, ${lng}`
        await this.storage.set("drop_off", JSON.stringify(location));
        this.isAlertOpen = true;
        this.scanerLoader?.dismiss();
      }).catch(async (error) => {
        console.log(' >>>>>.. error locations <<<<<,', error);
        this.scanerLoader?.dismiss();

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
      console.log("error---->>>>", error)
      this.scanerLoader?.dismiss();

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
}
