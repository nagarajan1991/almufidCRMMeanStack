import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { VisitsModule } from './visits/visits.module';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { AgmCoreModule } from '@agm/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GLOBALS, Global } from './visits/global';
import { MatTableModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    ErrorComponent,
    DashBoardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    VisitsModule,
    MatAutocompleteModule,
    MatTableModule,
    AgmCoreModule.forRoot ({
      apiKey: 'AIzaSyCz3DgTnhQrcmiGmywQowQvh3oDAqmbFJU'
    })
  ],
  providers: [Title,
    { provide: GLOBALS, useClass: Global, multi: false },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})

export class AppModule { }
