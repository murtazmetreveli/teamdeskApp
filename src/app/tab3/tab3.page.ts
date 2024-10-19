import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { DbService } from '../services/db.service';
import { SwiperContainer } from 'swiper/element';
import { Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
interface collectionDataType {
  practiceId: string;
  Status: string;
  details: string;
  image: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  headerData: any = {
    title: 'OUTBOX',
    button_text: 'Search',
    serach: true,
    backButton: false
  };
  collectionData: collectionDataType[] = [];
  dropOffData: any = [];
  filteredCollectionData: collectionDataType[] = [];
  filterDropOFFData: any = [];
  searchQuery = '';
  isAndroid: boolean = false;
  private dataScanSubscription: Subscription;


  public selectedSegment = 0;
  constructor(private db: DbService, private ref: ChangeDetectorRef, public _DomSanitizationService: DomSanitizer) {
    if (Capacitor.getPlatform() === 'android') {
      this.isAndroid = true;
    }
    this.dataScanSubscription = this.db.dataInsertStatus.subscribe((res) => {
      if (res) {
        this.getCollectionData()

      }
    })
  }

  ngOnInit() {

    // this.getCollectionData()
  }
  ionViewWillEnter() {
    this.getCollectionData()
    this.getDropOffData()
  }
  ionViewDidLeave() {
    if (this.dataScanSubscription) {
      this.dataScanSubscription.unsubscribe();
    }
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    if (this.selectedSegment === 0) {
      this.filterDropOFFData = this.dropOffData.filter((item: any) => {
        return (
          item['practiceId'].toLowerCase().includes(query) ||
          item['details'].toLowerCase().includes(query)
        );
      });
    } else if (this.selectedSegment === 1) {
      this.filteredCollectionData = this.collectionData.filter((item: any) => {
        return (
          item['practiceId'].toLowerCase().includes(query) ||
          item['Status'].toLowerCase().includes(query) ||
          item['details'].toLowerCase().includes(query)
        );
      });
    }
  }
  async getCollectionData() {
    this.collectionData = [];
    await this.db.getCollectionData().then((res: any) => {
      let a = [];
      for (let i = 0; i < res.rows.length; i++) {
        a.push(res.rows.item(i))
      }
      this.collectionData = a;
      console.log("collectionData----", this.collectionData);
      this.ref.detectChanges();
    });

  }
  async getDropOffData() {
    this.dropOffData = [];
    await this.db.getDropOffData().then((res: any) => {
      let b = [];
      for (let i = 0; i < res.rows.length; i++) {
        b.push(res.rows.item(i))
      }
      this.dropOffData = b;
      this.ref.detectChanges();
    });

  }
  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
    this.swiperRef?.nativeElement?.swiper.slideTo(this.selectedSegment);

  }
  slideChanged() {
    this.selectedSegment = this.swiperRef?.nativeElement?.swiper?.activeIndex || 0
    console.log('this.selectedSegment', this.selectedSegment)
  }
}
