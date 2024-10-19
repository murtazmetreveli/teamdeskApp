import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnterDetailsComponent } from './enter-details.component';

const routes: Routes = [
  {
    path: '',
    component: EnterDetailsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnterDetailsRoutes {}
