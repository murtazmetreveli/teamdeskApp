import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, NavController, Platform } from "@ionic/angular";
import { ApiService } from 'src/app/services/api.service';
import { Network } from '@capacitor/network';
import { Storage } from '@ionic/storage-angular';
import { AnalyticService } from 'src/app/services/analytics/analytic.service';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;

}
@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss']
})
export class UploadImagesComponent implements OnInit {
  public photos: UserPhoto[] = [];
  message: any;
  attachMent: any;
  photo1!: string;
  attachMentName: any;
  imageInfo: any = [];
  uploadImage: boolean = false;
  headerData: any = {
    title: 'UPLOAD IMAGES',
    button_text: 'Route Complete',
    serach: false,

  };
  dropOff: any;
  constructor(private Platform: Platform, private navCtrl: NavController, private router: Router, public alertController: AlertController, private api: ApiService, private storage: Storage, private route: ActivatedRoute, private analyticservice: AnalyticService) {
    this.dropOff = this.route.snapshot.queryParams['drop_off'];
    this.headerData.sub_title = 'Please upload images, then click done';
  }

  async ngOnInit() {
    if (this.dropOff) {
      this.imageInfo = JSON.parse(await this.storage.get("drop_off") || '[]')
    }
    else {
      this.imageInfo = JSON.parse(await this.storage.get("outbox") || '[]')
    }

    this.imageInfo[0].image = [];
  }
  async ionViewWillEnter() {
    if (this.dropOff) {
      this.imageInfo = JSON.parse(await this.storage.get("drop_off") || '[]')
    }
    else {
      this.imageInfo = JSON.parse(await this.storage.get("outbox") || '[]')
    }

    this.imageInfo[0].image = [];
  }
  async uploadPhoto() {
    this.uploadImage = true;
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        webUseInput: true,
        source: CameraSource.Camera
      });
      if (image && image.base64String) {
        this.photos.unshift({
          filepath: "soon...",
          webviewPath: 'data:image/jpeg;base64,' + image.base64String,
        });
        if (this.photos.length > 0) {
          this.uploadImage = false;
        }
      } else {
        this.uploadImage = false;
        console.log('User canceled the photo selection process.');
      }
    } catch (error) {
      this.uploadImage = false;
      console.error('Error selecting photo:', error);

    }

  }
  async done() {
    this.photos?.forEach(photo => {
      this.imageInfo[0]?.image.push(photo.webviewPath);
    })
    if (this.dropOff) {
      await this.storage.set("drop_off", JSON.stringify(this.imageInfo));

      if (this.Platform.is('ios')) {
        const navigationExtras = {
          queryParams: {
            drop_off: true
          }
        };
        this.navCtrl.navigateRoot(['/enter-details'], navigationExtras);
      } else {
        this.router.navigateByUrl('/enter-details?drop_off=' + true);
      }
    }
    else {
      await this.storage.set("outbox", JSON.stringify(this.imageInfo));
      if (this.Platform.is('ios')) {
        this.navCtrl.navigateRoot(['/enter-details']);
      } else {
        this.router.navigateByUrl('/enter-details');
      }
    }

  }
  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      message: message,
      buttons: ["OK"],
      mode: 'ios',
      backdropDismiss: false
    });

    await alert.present();
  }

  ionViewWillLeave() {

  }
  ngOnDestroy() {

  }
}
