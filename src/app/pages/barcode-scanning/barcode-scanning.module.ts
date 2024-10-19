import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';


import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { BarcodeScanningPage } from './barcode-scanning.page';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubHeaderModule } from 'src/app/components/sub-header/sub-header.module';
@NgModule({
  declarations: [BarcodeScanningPage, BarcodeScanningModalComponent],
  imports: [BrowserModule, ReactiveFormsModule, IonicModule, SubHeaderModule], // Add ReactiveFormsModule here
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BarcodeScanningModule { }
