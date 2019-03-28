import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChangePasswordComponent } from './changepwd/changepwd.component';
import { ResetPasswordComponent } from './resetpwd/resetpwd.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard]},
  { path: 'chngpwd', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  { path: 'resetpwd', component: ResetPasswordComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports : [
    RouterModule
  ],
  providers: [AuthGuard]
})
export class AuthRoutingModule {

}
