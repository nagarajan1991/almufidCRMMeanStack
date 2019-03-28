import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';

import { VisitCreateComponent } from './visit-create/visit-create.component';
import { VisitListComponent } from './visit-list/visit-list.component';
import { VisitListAdminComponent } from './visit-list-admin/visit-list-admin.component';
import { PlanVisitComponent } from './plan-visit/plan-visit.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';


import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {MatAutocompleteModule} from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    VisitCreateComponent,
    VisitListComponent,
    VisitListAdminComponent,
    PlanVisitComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    AgmCoreModule,
    NgbModalModule,
    MatAutocompleteModule,
    FlatpickrModule.forRoot(),
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
    ]
})

export class VisitsModule {

}

