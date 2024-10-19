import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SentItemComponent } from './sent-item.component';
import { IonicModule } from '@ionic/angular';
import { SentItemRoutes } from './sent-item.routing';
import { SubHeaderModule } from 'src/app/components/sub-header/sub-header.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SentItemRoutes,
    SubHeaderModule,
    FormsModule
  ],
  providers: [DatePipe],
  declarations: [SentItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SentItemModule { }
