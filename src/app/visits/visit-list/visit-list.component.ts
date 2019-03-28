import { Component, Input, OnInit, OnDestroy, NgModule } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { utils, write, WorkBook, WorkSheet, JSON2SheetOpts } from 'xlsx';
import { Visit } from '../visit.model';
import { VisitsService } from '../visits.service';
import { AuthService } from 'src/app/auth/auth.service';




@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.css']
})


export class VisitListComponent implements OnInit, OnDestroy {
  public url: string;
  // visits = [
  //   {title: 'My First Visit', content: 'Filler1'},
  //   {title: 'My Second Visit', content: 'Filler2'},
  //   {title: 'My Third Visit', content: 'Filler3'}
  // ];

  fromDate: Date;
  toDate: Date;
  visits: Visit[] = [];
  isLoading = false;
  totalVisits = 0;
  visitsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [10, 20, 50];
  userIsAuthenticated = false;
  userId: string;
  private visitsSubb: Subscription;
  private authStatusSub: Subscription;

  constructor(public visitsService: VisitsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.visitsService.getVisits(this.visitsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.visitsSubb = this.visitsService
    .getVisitUpdateListener()
    .subscribe((visitData: {visits: Visit[], visitCount: number}) => {
      this.isLoading = false;
      this.totalVisits = visitData.visitCount;
      this.visits = visitData.visits;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.visitsPerPage = pageData.pageSize;
    this.visitsService.getVisits(this.visitsPerPage, this.currentPage);
  }

  /*onDelete(visitId: string) {
    this.visitsService.deleteVisit(visitId).subscribe(() => {
      this.visitsService.getVisits(this.visitsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }*/

  fetchVisits() {
    this.visitsService.getVisits(this.visitsPerPage, this.currentPage, this.fromDate, this.toDate);
    this.visitsSubb = this.visitsService
      .getVisitUpdateListener()
      .subscribe((visitData: { visits: Visit[], visitCount: number }) => {
        this.isLoading = false;
        this.totalVisits = visitData.visitCount;
        this.visits = visitData.visits;
      });
  }
  downloadVisits() {
    this.visitsService.downLoadVisits(null, null, this.fromDate, this.toDate).subscribe(visits => {
      const exportedVisits = visits.map(item => {
        const exportItem = {
          'customer': item.customer,
          'contact_no': item.contact_no,
          'remarks': item.remarks,
          'creation_date': item.date,
          'gmap_handle': `http://maps.google.com/maps?t=k&q=loc:${item.lat}${item.lng}`,
          'creator_name': item.creator_name
        };
        return exportItem;
      });
      const worksheet: WorkSheet = utils.json_to_sheet(exportedVisits);
      const workbook: WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const wbout: ArrayBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
      this.createBlobAndDownload(wbout, 'VisitsDataExport.xlsx');
    });
  }
  get userId_local(): any {
    return localStorage.getItem('userId');
  }

  private createBlobAndDownload(wbBuffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([wbBuffer], { type: 'application/octet-stream' });
    const dataUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = dataUrl;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(this.url);
    document.body.removeChild(a);
  }


  ngOnDestroy() {
    this.visitsSubb.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
