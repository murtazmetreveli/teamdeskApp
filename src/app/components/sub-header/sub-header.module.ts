import { EventEmitter, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubHeaderComponent } from './sub-header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@NgModule({
  imports: [
    CommonModule, FormsModule, IonicModule
  ],
  declarations: [SubHeaderComponent],
  exports: [SubHeaderComponent]
  // declarations: [SubHeaderComponent]
})

export class SubHeaderModule {

  constructor(
    private router: Router,

  ) { }

}
