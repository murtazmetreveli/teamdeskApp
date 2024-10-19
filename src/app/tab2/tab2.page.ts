import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { AnalyticService } from '../services/analytics/analytic.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  headerData: any = {
    title: 'COLLECTION INFO',
    button_text: 'Route Complete',
    serach: false
  };
  practiceId!: any;
  auth: any = localStorage.getItem('auth');
  details!: string;
  date!: any;
  collectionId!: any
  allData: any;
  PracticeName!: any;
  photo: any;
  constructor(private router: Router, private api: ApiService, private modalController: ModalController,private analyticservice: AnalyticService) { }
  ionViewWillEnter() {
    this.collectionId = localStorage.getItem("collectionId");
    this.allCollectionData();
    this.getPhoto();
  }

  done() {
    localStorage.removeItem("collectionId")
    localStorage.removeItem("outbox")
    if (this.router.url !== '/tabs/send-item') {
      this.router.navigateByUrl('/tabs/send-item');
    }
    // this.router.navigateByUrl('/tabs/send-item');
  }
  routeComplete() {
    this.router.navigateByUrl('/tabs/tab1');
  }
  allCollectionData() {
    this.api.getCollectionView(this.collectionId).subscribe({
      next: (d: any) => {
        console.log("data", d)
        this.allData = d[0];
        this.getLocation(this.allData['Barcode Practice'])
        let data = {"status":"true" }
        this.analyticservice.log({name: 'get_all_collection_data_status',params:data});
      },
      error: (error: any) => {
        let data = {"status":"false" }
        this.analyticservice.log({name: 'get_all_collection_data_status',params:data});
        console.log('Error fetching data:', error);
      }
    });
  }
  getPhoto() {
    this.api.getPhotoAttachment(this.collectionId).subscribe((res: any) => {
      this.photo = `https://app.mrmccouriers.com/secure/api/v2/84171/5608DA1601CE448E85AB45ABC28F27BF/Collection/photo/attachment?guid=${res[0].guid}&id=${this.collectionId}`
      let data = {"status":"true" }
      this.analyticservice.log({name: 'get_photo_attchment_status',params:data});
    })
  }
  getLocation(id: number) {
    this.api.getLocationPractice(id).subscribe((res: any) => {
      let data = {"status":"true" }
        this.analyticservice.log({name: 'get_location_status',params:data});
      this.PracticeName = res[0]['Practice Name'];
    })
  }
  async openImageModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        imageUrl: imageUrl,
        cssClass: 'example-modal', backdropBreakpoint: "0.5", showBackdrop: false
      },
    });
    return await modal.present();
  }
}
