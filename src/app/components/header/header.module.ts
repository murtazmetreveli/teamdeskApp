import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule { }
