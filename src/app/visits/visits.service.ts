
import { GLOBALS, Global } from '../visits/global';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { Visit } from './visit.model';
import { PlanVisit } from './plan-visit.model';

const BACKEND_URL = environment.apiUrl + '/visits/';

@Injectable({ providedIn: 'root' })
export class VisitsService {
  private visits: Visit[] = [];
  private visitsUpdated = new Subject<{ visits: Visit[], visitCount: number }>();

  constructor(private http: HttpClient,
    @Inject(GLOBALS) public g: Global,
    private router: Router) { }

  getVisits(visitsPerPage?: number, currentPage?: number, startDate?: Date, endDate?: Date) {
    const queryParams = `?pageSize=${visitsPerPage}&page=${currentPage}&startDate=${startDate}&endDate=${endDate}`;
    this.http.get<{ message: string, visits: any, maxVisits: number }>(
      BACKEND_URL + queryParams
    )
      .pipe(map((visitData) => {
        return {
          visits: visitData.visits.map(visit => {
            return {
              customer: visit.customer,
              contact_no: visit.contact_no,
              remarks: visit.remarks,
              id: visit._id,
              date: visit.date,
              lat: visit.lat,
              lng: visit.lng,
              creator: visit.creator
            };
          }),
          maxVisits: visitData.maxVisits
        };
      }))
      .subscribe((transformedVisitData) => {
        this.visits = transformedVisitData.visits;
        this.visitsUpdated.next({
          visits: [...this.visits],
          visitCount: transformedVisitData.maxVisits
        });
      });
  }
  downLoadVisits(visitsPerPage?: number, currentPage?: number, startDate?: Date, endDate?: Date) {
    const queryParams = `?pageSize=${visitsPerPage}&page=${currentPage}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<{ message: string, visits: any, maxVisits: number }>(
      BACKEND_URL + '/download' + queryParams
    )
      .pipe(map((visitData) => {
        return visitData.visits;
      }));
  }

  getVisitsStatistics(period?: string, userId?: string): Observable<any> {
    const queryParams = `?period=${period}&userId=${userId}`;
    return this.http.get<{ message: string, visits: any, maxVisits: number }>(
      BACKEND_URL + queryParams
    )
      .pipe(map((visitData) => {
        return {
          visits: visitData.visits.map(visit => {
            return {
              customer: visit.customer,
              contact_no: visit.contact_no,
              remarks: visit.remarks,
              id: visit._id,
              date: visit.date,
              lat: visit.lat,
              lng: visit.lng,
              creator: visit.creator
            };
          }),
          visitCount: visitData.visits.length
        };
      }));
  }
  getVisitsBySearch(searchValue: string): Observable<Visit[]> {
    const queryParams = `?searchValue=${searchValue}`;
    return this.http.get<{ message: string, visits: any, maxVisits: number }>(
      BACKEND_URL + queryParams
    )
      .pipe(map((visitData) => {
        return visitData.visits.map(visit => {
          return {
            customer: visit.customer,
            contact_no: visit.contact_no,
            remarks: visit.remarks,
            id: visit._id,
            date: visit.date,
            lat: visit.lat,
            lng: visit.lng,
            creator: visit.creator
          };
        });
      }));
  }

  getVisitUpdateListener() {
    return this.visitsUpdated.asObservable();
  }

  getVisit(id: string) {
    return this.http.get<{
      _id: string;
      customer: string;
      contact_no: string;
      remarks: string;
      date: string;
      lat: string;
      lng: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addVisit(customer: string, contact_no: string, remarks: string, date: Date, lat: string, lng: string, creator: string) {
    const visit: Visit = {
      id: null, customer: customer, contact_no: contact_no, remarks: remarks, date: null,
      lat: lat, lng: lng, creator: creator, creator_name: this.g.user.email
    };
    this.http
      .post<{ message: string, visitId: string }>(BACKEND_URL, visit)
      .subscribe((responseData) => {
        this.router.navigate(['/viewvisit']);
      });
  }
  addPlannedVisit(plannedVisit: PlanVisit) {
    return this.http
      .post<{ message: string, visitId: string }>(BACKEND_URL, plannedVisit);
  }

  updateVisit(id: string, customer: string, contact_no: string, remarks: string, date: Date,
    lat: string, lng: string, creator: string) {
    const visit: Visit = {
      id: id, customer: customer, contact_no: contact_no, remarks: remarks, date: null,
      lat: lat, lng: lng, creator: creator, creator_name: this.g.user.email
    };
    this.http.put(BACKEND_URL + id, visit)
      .subscribe(response => {
        this.router.navigate(['/viewvisit']);
      });
  }

  deleteVisit(visitId: string) {
    return this.http.delete(BACKEND_URL + visitId);
  }
}
