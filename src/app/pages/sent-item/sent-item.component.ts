import { Component, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as moment from "moment";
import { LoadingController, ModalController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { DbService } from 'src/app/services/db.service';
import { Capacitor } from '@capacitor/core';
import { DatePipe } from '@angular/common';
import { AnalyticService } from 'src/app/services/analytics/analytic.service';
import { ImageModalComponent } from 'src/app/image-modal/image-modal.component';
@Component({
  selector: 'app-sent-item',
  templateUrl: './sent-item.component.html',
  styleUrls: ['./sent-item.component.scss']
})
export class SentItemComponent implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  headerData: any = {
    title: 'SENT ITEMS',
    button_text: 'Search',
    serach: true,
    backButton: true
  };
  currentDate!: any;
  sendCollectionData: any;
  sendCollectionDataTemp: any;
  sendDropOFFData: any;
  dataStatus: boolean = false;
  isAndroid: boolean = Capacitor.getPlatform() === 'android';
  filteredCollectionData: any = [];
  filterDropOFFData: any = [];
  searchQuery = '';
  public selectedSegment = 0;
  constructor(private ref: ChangeDetectorRef, private datePipe: DatePipe, private api: ApiService, private modalController: ModalController, private loadingController: LoadingController, private db: DbService, private analyticservice: AnalyticService) {
  }

  ngOnInit() {

  }
  someMethod(data: any) {
    console.log('emit data', data);
    this.sendCollectionData = data;
  }
  async ionViewWillEnter() {
    localStorage.removeItem("collectionId")
    localStorage.removeItem("")
    const status = await Network.getStatus();
    console.log('Network status:', status.connected);
    if (status.connected) {
      this.getCollectionData().then(data => {
        this.sendCollectionData = JSON.parse(JSON.stringify(data));
        this.ref.detectChanges();
      });
      this.getDropOffData().then(data => {
        this.sendDropOFFData = JSON.parse(JSON.stringify(data));
        this.ref.detectChanges();
      });
    }

  }
  async getCollectionData() {
    return new Promise(async (resolve, reject) => {
      const loading = await this.loadingController.create({
        cssClass: 'spinner', mode: 'md'
      });
      await loading.present();
      try {
        var today = new Date();
        this.currentDate = moment(today).format('YYYY-MM-DD');
        var nextWeek = moment(today).subtract(1, 'weeks').format('YYYY-MM-DD');
        let q = {
          dateTo: this.currentDate,
          dateFrom: nextWeek
        }
        await this.api.getTodayCollection(q).subscribe(async (res: any) => {
          // Format the date using DatePipe
          let data = { "status": "true" }
          this.analyticservice.log({ name: 'get_today_collection_status', params: data });
          const otherArray = res.sort((a: any, b: any) => b['@row.id'] - a['@row.id']);
          otherArray.forEach((item: any) => {
            // item['Date/Time Collected'] = this.datePipe.transform(item['Date/Time Collected'], 'dd/MM/yyyy HH:mm:ss');
            item['Date/Time Collected'] = this.formatDate(item['Date/Time Collected']);
            let arr = item.Photo?.split(';');
            if (arr?.length > 0) {
              item.Photo = `https://app.mrmccouriers.com/secure/api/v2/84171/5608DA1601CE448E85AB45ABC28F27BF/Collection/photo/attachment?guid=${arr[2]}&id=${item["@row.id"]}`;
            } else {
              item.Photo = '';
            }

          });
          if (otherArray.length > 0) {
            await loading.dismiss();
            this.ref.detectChanges();
            return resolve(JSON.parse(JSON.stringify(otherArray)));
          } else {
            await loading.dismiss();
            this.ref.detectChanges();
            return resolve([]);

          }
        }, async (error) => {
          await loading.dismiss();

        });
      } catch (err) {
        await loading.dismiss();
        this.ref.detectChanges();
        return reject(err);
      } finally {
        await loading.dismiss();
      }
    })

  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'MM/dd/yyyy HH:mm:ss');
    return formattedDate || ''; // return formatted date or an empty string if failed
  }
  async getDropOffData() {
    return new Promise(async (resolve, reject) => {
      const loading = await this.loadingController.create({
        cssClass: 'spinner', mode: 'md'
      });
      await loading.present();
      try {
        var today = new Date();
        this.currentDate = moment(today).format('YYYY-MM-DD');
        var nextWeek = moment(today).subtract(1, 'weeks').format('YYYY-MM-DD');
        let q = {
          dateTo: this.currentDate,
          dateFrom: nextWeek
        }
        await this.api.getDropOffCollection(q).subscribe(async (res: any) => {
          let data1 = { "status": "true" }
          this.analyticservice.log({ name: 'get_dropoff_collection_api_calling', params: data1 });
          const otherArray = res.sort((a: any, b: any) => b['@row.id'] - a['@row.id']);
          otherArray.forEach((item: any) => {
            item['Date/Time'] = this.formatDate(item['Date/Time']);
            let arr = item['Image Upload']?.split(';');
            if (arr?.length > 0) {
              item['Image Upload'] = `https://app.mrmccouriers.com/secure/api/v2/84171/5608DA1601CE448E85AB45ABC28F27BF/Drop-Off/Image%20Upload/attachment?guid=${arr[2]}&id=${item["@row.id"]}`;
            } else {
              item['Image Upload'] = '';
            }
          });
          if (otherArray.length > 0) {
            await loading.dismiss();
            this.ref.detectChanges();
            return resolve(JSON.parse(JSON.stringify(otherArray)));
          } else {
            await loading.dismiss();
            this.ref.detectChanges();
            return resolve([]);
          }
        }, async (error) => {
          await loading.dismiss();

        });
      } catch (err) {
        await loading.dismiss();
        this.ref.detectChanges();
        return reject(err);
      } finally {
        await loading.dismiss();
      }
    })

  }
  onSearch() {
    const query = this.searchQuery.toLowerCase(); // Convert query to lowercase
    if (this.selectedSegment === 0) {
      this.filterDropOFFData = this.sendDropOFFData.filter((item: any) => {
        return (
          item['Lab QR Code'].toLowerCase().includes(query) ||
          item['Date/Time'].toLowerCase().includes(query) ||
          item['Details'].toLowerCase().includes(query)
        );
      });
    } else if (this.selectedSegment === 1) {
      this.filteredCollectionData = this.sendCollectionData.filter((item: any) => {
        return (
          item['practice Name'].toLowerCase().includes(query) ||
          item['Status'].toLowerCase().includes(query) ||
          item['Date/Time Collected'].toLowerCase().includes(query) ||
          item['Details'].toLowerCase().includes(query)
        );
      });
    }
  }
  getPracticeName(id: number) {
    return new Promise((resolve, reject) => {
      this.api.getLocationPractice(id).subscribe((res: any) => {
        let data = { "status": "true" }
        this.analyticservice.log({ name: 'get_practice_status', params: data });
        return resolve(res[0]['Practice Name']);
      })
    })

  }
  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
    this.swiperRef?.nativeElement?.swiper.slideTo(this.selectedSegment);
  }
  slideChanged() {
    this.selectedSegment = this.swiperRef?.nativeElement?.swiper?.activeIndex || 0
  }
  async openImageModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        imageUrl: imageUrl,
      },
      cssClass: 'example-modal image-show', // Add the defined CSS classes
      backdropBreakpoint: 0.5, // Optional: Control backdrop coverage
      showBackdrop: true, // Optional: Decide if you want a backdrop
    });
    return await modal.present();
  }
}
