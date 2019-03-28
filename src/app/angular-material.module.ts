import { NgModule } from '@angular/core';
import { MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatDialogModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatSelectModule,
  MatMenuModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import { MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule
} from '@angular/material';


@NgModule ({
  imports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule
  ]
})
export class AngularMaterialModule {

}
