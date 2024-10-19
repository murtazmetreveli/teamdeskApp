import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ImageModalComponent } from './image-modal/image-modal.component';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SliderModule } from './components/slider/slider.module';
import { SubHeaderModule } from './components/sub-header/sub-header.module';
import { BarcodeScanningModalComponent } from './pages/barcode-scanning/barcode-scanning-modal.component';
import { BarcodeScanningPage } from './pages/barcode-scanning/barcode-scanning.page';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
// sqlite

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DropOffComponent } from './pages/drop-off/drop-off.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, BarcodeScanningPage, BarcodeScanningModalComponent, DropOffComponent, ImageModalComponent],
  exports: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, ReactiveFormsModule, SubHeaderModule, SliderModule, FormsModule, HttpClientModule],
  providers: [SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, BarcodeScanner],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
