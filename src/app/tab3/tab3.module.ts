import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { SubHeaderModule } from '../components/sub-header/sub-header.module';
import { SliderModule } from '../components/slider/slider.module';
import { SliderComponent } from '../components/slider/slider.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SubHeaderModule,
    Tab3PageRoutingModule,
    SliderModule

  ],
  declarations: [Tab3Page],
  exports: [],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab3PageModule { }
