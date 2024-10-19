import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SentItemComponent } from './sent-item.component';

const routes: Routes = [
  {
    path: '',
    component: SentItemComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SentItemRoutes {};

