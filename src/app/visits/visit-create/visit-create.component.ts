import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { VisitsService } from '../visits.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Visit } from '../visit.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-visit-create',
  templateUrl: './visit-create.component.html',
  styleUrls: ['./visit-create.component.css']
})


export class VisitCreateComponent implements OnInit, OnDestroy {



  customer = new FormControl();
  visits$: Observable<Visit[]>;
  visit: Visit;
  isLoading = false;
  private mode = 'create';
  private visitId: string;
  private authStatusSub: Subscription;

  lat: any;
  lng: any;

  constructor(
    public visitsService: VisitsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public mapsAPILoader: MapsAPILoader


  ) {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
      });
    }
  }


  ngOnInit() {

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('visitId')) {
        this.mode = 'edit';
        this.visitId = paramMap.get('visitId');
        this.isLoading = true;
        this.visitsService.getVisit(this.visitId).subscribe(visitData => {
          this.isLoading = false;
          this.visit = {
            id: visitData._id,
            customer: visitData.customer,
            contact_no: visitData.contact_no,
            remarks: visitData.remarks,
            date: null,
            lat: visitData.lat,
            lng: visitData.lng,
            creator: visitData.creator
          };
        });
      } else {
        this.mode = 'create';
        this.visitId = null;
      }
    });

    this.customer.valueChanges.subscribe(searchValue => {
      if (searchValue) {
        this.searchVisit(searchValue);
      }
    });
  }

  searchVisit(searchValue) {
    this.visits$ = this.visitsService.getVisitsBySearch(searchValue);
  }

  selectVisit(visit: Visit) {
    visit.remarks = null;
    this.visit = visit;
    this.visitId = visit.id;
  }

  onSaveVisit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
      this.visitsService.addVisit(this.customer.value, form.value.contact_no, form.value.remarks, null,
        this.lat, this.lng, form.value.creator);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}



