import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder, ReactiveFormsModule  } from '@angular/forms';
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
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css'],
})

export class ResetPasswordComponent implements OnInit {
  myForm: FormGroup;
  isLoading = false;
  matcher = new MyErrorStateMatcher();
  users$: Observable<any>;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.myForm = this.formBuilder.group({
      useraccount: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });

  }

  ngOnInit(): void {
    this.users$ = this.authService.getUsers();
  }


  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let useraccount = group.controls.useraccount.value;
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onReset() {
    this.isLoading = true;
    //localStorage.clear();
    //this.authService.resetpwd(form.value.user, form.value.confpwd);
    const confpwd = (<HTMLInputElement>document.getElementById('confpwd')).value;
    const user = (<HTMLInputElement>document.getElementById('email')).value;
    console.log(confpwd);
    console.log(user);
    //console.log(form.value.confpwd);
  }

}



