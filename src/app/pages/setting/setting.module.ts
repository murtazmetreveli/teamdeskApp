import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutes } from './setting.routing';
import { HeaderModule } from 'src/app/components/header/header.module';
import { IonicModule } from '@ionic/angular';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutes,
    HeaderModule,
    IonicModule,
    FormsModule
  ],
  exports: [],
  declarations: [SettingComponent]
})
export class SettingModule { }
