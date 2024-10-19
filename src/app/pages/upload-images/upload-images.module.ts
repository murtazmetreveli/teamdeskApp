import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadImagesComponent } from './upload-images.component';
import { UploadImagesRoutes } from './upload-images.routing';
import { IonicModule } from '@ionic/angular';
import { SubHeaderModule } from 'src/app/components/sub-header/sub-header.module';

@NgModule({
  imports: [
    CommonModule,
    UploadImagesRoutes,
    IonicModule,
    SubHeaderModule
  ],
  declarations: [UploadImagesComponent]
})
export class UploadImagesModule { }
