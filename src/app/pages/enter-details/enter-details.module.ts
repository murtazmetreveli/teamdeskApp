import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterDetailsComponent } from './enter-details.component';
import { IonicModule } from '@ionic/angular';
import { SubHeaderModule } from 'src/app/components/sub-header/sub-header.module';
import { EnterDetailsRoutes } from './enter-details.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule,
    CommonModule, IonicModule, SubHeaderModule, EnterDetailsRoutes
  ],
  declarations: [EnterDetailsComponent]
})
export class EnterDetailsModule {


}
