import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';


@Component({
  templateUrl: './login.component.html',
  styleUrls : ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  constructor (public authService: AuthService) {}


  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    localStorage.clear();
    this.authService.login(form.value.fullname, form.value.email, form.value.password, form.value.userrolevalue, form.value.mobile);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
