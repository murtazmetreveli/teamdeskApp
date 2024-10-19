import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthLoginGuard } from './guards/auth-login.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGuard]
    /*children:[
      {
        path: 'upload-images',
        loadChildren: () => import('./pages/upload-images/upload-images.module').then(m => m.UploadImagesModule),
      }
    ] */
  },
  {
    path: 'upload-images',
    loadChildren: () => import('./pages/upload-images/upload-images.module').then(m => m.UploadImagesModule), canActivate: [AuthGuard]
  },
  {
    path: 'enter-details',
    loadChildren: () => import('./pages/enter-details/enter-details.module').then(m => m.EnterDetailsModule), canActivate: [AuthGuard]
  },
  {
    path: 'login', component: LoginComponent, canActivate: [AuthLoginGuard],
    data: { title: 'Login' }
  },
  // { path: '**', redirectTo: '/tabs/tab3', pathMatch: 'full' },
  {
    path: '',
    redirectTo: 'tabs/tab3',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
