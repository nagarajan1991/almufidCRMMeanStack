import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

export interface UserRole {
  value: string;
  viewValue: string;
}

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  userrolevalue: string;

  userroles: UserRole[] = [
    {value: 'SalesMan', viewValue: 'SalesMan'},
    {value: 'SalesManager', viewValue: 'SalesManager'}
  ];


  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.fullname,
      form.value.email,
      form.value.password,
      form.value.userrolevalue,
      form.value.mobile);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
