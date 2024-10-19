import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';
import { DropOffComponent } from '../pages/drop-off/drop-off.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab3',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
      },
      {
        path: 'tab1',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('../pages/setting/setting.module').then(m => m.SettingModule)
      },
      {
        path: 'send-item',
        loadChildren: () => import('../pages/sent-item/sent-item.module').then(m => m.SentItemModule),
      },
      {
        path: 'notification',
        loadChildren: () => import('../pages/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'scan-collection',
        loadChildren: () => import('../pages/barcode-scanning/barcode-scanning-routing.module').then(m => m.BarcodeScanningRoutingModule)
      },
      { path: 'drop-off', component: DropOffComponent, data: { title: 'Drop-Off' } },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
