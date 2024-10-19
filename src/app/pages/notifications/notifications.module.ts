import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutes } from './notifications.routing';
import { SubHeaderModule } from 'src/app/components/sub-header/sub-header.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    NotificationsRoutes,
    SubHeaderModule,
    IonicModule
  ],
  declarations: [NotificationsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]


})
export class NotificationsModule { }
