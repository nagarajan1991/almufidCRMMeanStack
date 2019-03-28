import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { GLOBALS, Global } from '../visits/global';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    @Inject(GLOBALS) public g: Global,
     private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/auth/login']);
    }
    else{
      this.g.user = this.g.user ? this.g.user : JSON.parse(localStorage.getItem('currentUser'));
    }
    return isAuth;
  }
}
