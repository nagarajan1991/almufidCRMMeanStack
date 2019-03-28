import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { PlanVisit } from './plan-visit.model';

const BACKEND_URL = environment.apiUrl + '/planvisits/';

@Injectable({
  providedIn: 'root'
})
export class PlanVisitService {

  private planVisits: PlanVisit[] = [];
  private planVisitsUpdated = new Subject<{ planVisits: PlanVisit[], visitCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPlanVisits(planVisitsPerPage?: number, currentPage?: number, startDate?: Date, endDate?: Date) {
    const queryParams = `?pageSize=${planVisitsPerPage}&page=${currentPage}&startDate=${startDate}&endDate=${endDate}`;
    this.http.get<{ message: string, planVisits: any, maxPlanVisits: number }>(
      BACKEND_URL + queryParams
    )
      .pipe(map((visitData) => {
        return {
          planVisits: visitData.planVisits.map(visit => {
            return {
              id: visit._id,
              userId: visit.userId,
              creator_name: visit.creator_name,
              title: visit.title,
              start: visit.start,
              end: visit.end,
              pcolor: visit.pcolor,
              scolor: visit.scolor,
              draggable: visit.draggable,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              creator: visit.creator
            };
          }),
          maxPlanVisits: visitData.maxPlanVisits
        };
      }))
      .subscribe((transformedPlanVisitData) => {
        this.planVisits = transformedPlanVisitData.planVisits;
        this.planVisitsUpdated.next({
          planVisits: [...this.planVisits],
          visitCount: transformedPlanVisitData.maxPlanVisits
        });
      });
  }
  downLoadPlanVisits(planVisitsPerPage?: number, currentPage?: number, startDate?: Date, endDate?: Date) {
    const queryParams = `?pageSize=${planVisitsPerPage}&page=${currentPage}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<{ message: string, planVisits: any, maxPlanVisits: number }>(
      BACKEND_URL + '/download' + queryParams
    )
      .pipe(map((visitData) => {
        return visitData.planVisits;
      }));
  }

  getPlanVisitsStatistics(period?: string, userId?: string): Observable<any> {
    const queryParams = `?period=${period}&userId=${userId}`;
    return this.http.get<{ message: string, planVisits: any, maxPlanVisits: number }>(
      BACKEND_URL + queryParams
    )
      .pipe(map((visitData) => {
        return {
          planVisits: visitData.planVisits.map(visit => {
            return {
              id: visit._id,
              userId: visit.userId,
              creator_name: visit.creator_name,
              title: visit.title,
              start: visit.start,
              end: visit.end,
              pcolor: visit.pcolor,
              scolor: visit.scolor,
              draggable: visit.draggable,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              creator: visit.creator
            };
          }),
          visitCount: visitData.planVisits.length
        };
      }));
  }
  getPlanVisitsBySearch(searchValue: string): Observable<PlanVisit[]> {
    const queryParams = `?searchValue=${searchValue}`;
    return this.http.get<{ message: string, planVisits: any, maxPlanVisits: number }>(
      BACKEND_URL + queryParams
    )
      .pipe(map((visitData) => {
        return visitData.planVisits.map(visit => {
          return {
            id: visit._id,
            userId: visit.userId,
            creator_name: visit.creator_name,
            title: visit.title,
            start: visit.start,
            end: visit.end,
            pcolor: visit.pcolor,
            scolor: visit.scolor,
            draggable: visit.draggable,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            creator: visit.creator
          };
        });
      }));
  }
  getPlanVisitsByUser(userId: string) {
    const queryParams = `?userId=${userId}`;
    this.http.get<{ message: string, planVisits: any, maxPlanVisits: number }>(
      BACKEND_URL + queryParams
    )
      .pipe(map((visitData) => {
        return {
          planVisits: visitData.planVisits.map(visit => {
            return {
              id: visit._id,
              userId: visit.userId,
              creator_name: visit.creator_name,
              title: visit.title,
              start: visit.start,
              end: visit.end,
              pcolor: visit.pcolor,
              scolor: visit.scolor,
              draggable: visit.draggable,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              creator: visit.creator
            };
          }),
          maxPlanVisits: visitData.maxPlanVisits
        };
      }))
      .subscribe((transformedPlanVisitData) => {
        this.planVisits = transformedPlanVisitData.planVisits;
        this.planVisitsUpdated.next({
          planVisits: [...this.planVisits],
          visitCount: transformedPlanVisitData.maxPlanVisits
        });
      });
  }

  getPlanVisitUpdateListener() {
    return this.planVisitsUpdated.asObservable();
  }

  getPlanVisit(id: string) {
    return this.http.get<{
      _id: string;
      userId: string,
      creator_name:string,
      title: string,
      start: Date,
      end: Date,
      pcolor: string,
      scolor: string,
      draggable: boolean,
      resizable: {
        beforeStart: boolean,
        afterEnd: boolean,
      },
      creator: string;
    }>(BACKEND_URL + id);
  }

  addPlanVisit(planVisit: PlanVisit) {
    this.http
      .post<{ message: string, visitId: string }>(BACKEND_URL, planVisit)
      .subscribe((responseData) => {
      });
  }

  updatePlanVisit(id: string, planVisit: PlanVisit) {
    this.http.put(BACKEND_URL + id, planVisit)
      .subscribe(response => {
      });
  }

  deletePlanVisit(id: string) {
    return this.http.delete(BACKEND_URL + id).subscribe(response => {
    });
  }
}
