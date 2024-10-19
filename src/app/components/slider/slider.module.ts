import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SliderComponent],
  exports: [SliderComponent],
  imports: [ CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class SliderModule { }
