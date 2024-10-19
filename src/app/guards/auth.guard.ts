import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, createUrlTreeFromSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(

    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let isLoggedIn = localStorage.getItem('auth');
    console.log('authGuard function called ..... !')
    return isLoggedIn ? true : createUrlTreeFromSnapshot(route, ['/login'])
  }

}