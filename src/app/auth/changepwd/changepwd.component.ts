import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormControl,
  FormGroupDirective,
  NgForm, Validators,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule  } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}


@Component({
  templateUrl: './changepwd.component.html',
  styleUrls: ['./changepwd.component.css'],
})

export class ChangePasswordComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;
  users$: Observable<any>;


  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder, public authService: AuthService) {
    this.myForm = this.formBuilder.group({
      currpwd: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });

  }

  ngOnInit() {
    this.users$ = this.authService.getUsers();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let currpwd = group.controls.currpwd.value;
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  get user(): any {
    return localStorage.getItem('email');
}

  chngpwd() {
    console.log('Button Clicked');
    console.log(this.user);
    const confirmPassword = (<HTMLInputElement>document.getElementById('confirmPassword')).value;
    console.log(confirmPassword);
    this.authService.chngpwd(this.user, confirmPassword);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
