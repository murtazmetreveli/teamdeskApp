import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  number: any;
  slice1st = 0;
  slice2nd = 2;

  swiperModules = [IonicSlides];
  @Input() sliderData: any[];
  tempData: any[] = []
  chunkSize = 2;
  constructor(private db: DbService, private ref: ChangeDetectorRef) {
    this.db.dataInsertStatus.subscribe((res) => {
      if (res) {
        console.log('cibnstry-----------------', res)
      }
    })
  }

  ngOnInit() {
    console.log("----ngonint--", this.sliderData)
    // setTimeout(() => {
    //   this.tempData = this.sliderData;
    //   console.log("-----------silder page data-------", this.tempData)
    //   console.log('this.number', this.number);
    // }, 1000);
  }
  ionViewWillEnter() {
    console.log("----ionViewWillEnter--", this.sliderData)
  }
  swiperSlideChanged(event: any) {
    // console.log(1 + this.chunkSize, 'this?.data', this?.data)
    console.log(event, `swiper function `, event.target)
  }

  ngOnChanges(changes: SimpleChanges) {

    // this.tempData = [];

    // console.log("--------", this.sliderData, '---this.sliderData?.length ', "" + this.sliderData?.length);

    // console.log('this.sliderData------>>>>>>>>>>>>>>>>>>>>>>>>>>>', this.sliderData)
    // console.log('this.tempData', this.tempData)
    // this.number = this.tempData?.length;
    // if (this.number === 0) {
    //   this.number = 1;
    // }
    // console.log('this.number', this.number);
  }

  ngAfterContentInit() {
    setTimeout(() => {

    }, 1000);
  }

}



