import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { AuthData } from './auth.data.model';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { GLOBALS, Global } from '../visits/global';
import { Inject } from '@angular/core';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private email: string;
  private userrole: string;
  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient,
    @Inject(GLOBALS) public g: Global,
    private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  createUser(fullname: string, email: string, password: string, userrolevalue: string, mobile: string) {
    const authData: AuthData = { fullname: fullname, email: email, password: password, userrolevalue: userrolevalue, mobile: mobile };
    this.http
      .post(BACKEND_URL + '/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  chngpwd(email: string, password: string) {

  }


  resetpwd(email: string, password: string) {

  }

  login(fullname: string, email: string, password: string, userrolevalue: string, mobile: string) {
    const authData: AuthData = { fullname: fullname, email: email, password: password, userrolevalue: userrolevalue, mobile: mobile };
    this.http.post<{ token: string, expiresIn: number, userId: string, userrolevalue: string }>(
      BACKEND_URL + '/login',
      authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          this.email = authData.email;
          this.userrole = response.userrolevalue;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.g.user = Object.assign({}, response);
          this.g.user.email = authData.email;
          localStorage.setItem('currentUser', JSON.stringify(this.g.user));
          this.router.navigate(['/dashboard']);

        }
      }, error => {
        this.authStatusListener.next(false);
      });

  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', this.email);
    localStorage.setItem('userrole', this.userrole);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('userrole');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const userrole = localStorage.getItem('userrole');
    if (!token || !expirationDate || !userId || !email || !userrole) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      email: email,
      userrole: userrole
    };
  }
  getUsers(searchValue?: string) {
    const queryParams = searchValue ? `?searchValue=${searchValue}` : '';
    return this.http.get<{ message: string, users: any, maxUsers: number }>(
      BACKEND_URL + 'users' + queryParams
    )
      .pipe(map((userData) => {
        return {
          users: userData.users.map(user => {
            return {
              fullname: user.fullname,
              email: user.email,
              userrolevalue: user.userrolevalue,
              mobile: user.mobile,
              userId: user._id
            };
          }),
          userCount: userData.maxUsers
        };
      }));
  }
}


