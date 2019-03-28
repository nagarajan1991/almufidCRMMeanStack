import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { VisitsService } from '../visits.service';
import { PlanVisit } from '../plan-visit.model';
import { Inject } from '@angular/core';
import { GLOBALS, Global } from '../global';
import { PlanVisitService } from '../planvisit.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-plan-visit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plan-visit.component.html',
  styleUrls: ['./plan-visit.component.css']
})

export class PlanVisitComponent implements OnInit {
  isLoading: boolean = true;

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  selectedText: string;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string,
    text?: string
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;
  totalVisits: number;
  planVisits: any;
  visitsSubb: any;
  users$: Observable<any>;
  selectedUser: string;
  selectedDate: Date = new Date();
  selectedEvent: CalendarEvent<any>;

  constructor(private modal: NgbModal,
    private authService: AuthService,
    @Inject(GLOBALS) public g: Global,
    private planVisitService: PlanVisitService) {
    this.planVisitService.getPlanVisitsByUser(this.g.user.userId);
    this.selectedUser = this.g.user.userId;
    this.visitsSubb = this.planVisitService
      .getPlanVisitUpdateListener()
      .subscribe((visitData: { planVisits: PlanVisit[], visitCount: number }) => {
        this.isLoading = false;
        this.totalVisits = visitData.visitCount;
        this.planVisits = visitData.planVisits;
        this.events = this.planVisits.map(item => {
          return {
            id: item.id,
            title: item.title,
            start: startOfDay(new Date(item.start)),
            end: endOfDay(new Date(item.end)),
            color: { primary: item.pcolor, secondary: item.scolor },
            draggable: item.draggable,
            resizable: item.resizable,
            allDay: true
          };
        });
        this.events = this.events.map(item => {
          item.actions = this.actions
          return item;
        });
        this.refresh.next();
      });
  }

  refreshList(user: User) {
    this.selectedUser = user.userId;
    this.planVisitService.getPlanVisitsByUser(user.userId);
    this.visitsSubb = this.planVisitService
      .getPlanVisitUpdateListener()
      .subscribe((visitData: { planVisits: PlanVisit[], visitCount: number }) => {
        this.isLoading = false;
        this.totalVisits = visitData.visitCount;
        this.planVisits = visitData.planVisits;
        this.events = this.planVisits.map(item => {
          return {
            title: item.title,
            start: startOfDay(item.start),
            end: endOfDay(item.end),
            color: { primary: item.pcolor, secondary: item.scolor },
            draggable: item.draggable,
            resizable: item.resizable,
            allDay: true
          };
        });
        this.events = this.events.map(item => {
          item.actions = this.actions
          return item;
        });
        this.refresh.next();
      });
  }

  ngOnInit(): void {
    this.users$ = this.authService.getUsers();
    this.isLoading = true;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
    this.selectedDate = date;
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if (action === 'Edited') {
      this.selectedText = event.title;
      this.selectedEvent = event;
      this.modalData = { action: action, text: 'Edit' };
      this.modal.open(this.modalContent, { size: 'lg' });
    } else {
      this.deleteEvent(event);
      this.refresh.next();
    }
  }

  performAction(action: string) {
    if (action === 'add') {
      const event = {
        title: this.selectedText,
        start: startOfDay(this.selectedDate),
        end: endOfDay(this.selectedDate),
        userId: this.g.user.userId,
        creator: this.g.user.userId,
        creator_name: this.g.user.email,
        pcolor: 'red',
        scolor: 'blue',
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
      }
      this.events.push(event);
      this.upSertVisitPlan(event);
    }
    else {
      this.upSertVisitPlan(this.selectedEvent);
    }
    this.refresh.next();
  }
  addEvent(): void {
    this.modalData = { action: 'add', text: 'Add New' };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  deleteEvent(event) {
    this.planVisitService.deletePlanVisit(event.id);
    this.deleteFromLocal(event.id);
    this.refresh.next();
  }
  deleteFromLocal(id: string) {
    const index: number = this.events.map(item => item.id).indexOf(id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }
  upSertVisitPlan(event: any) {
    const eventTemp = {
      id: event.id,
      title: this.selectedText,
      start: event.start,
      end: event.end,
      userId: this.g.user.userId,
      creator: this.g.user.userId,
      creator_name: this.g.user.email,
      pcolor: event.pcolor,
      scolor: event.scolor,
      draggable: event.draggable,
      resizable: event.resizable,
    }
    if (event.id) {
      this.planVisitService.updatePlanVisit(eventTemp.id, eventTemp);
    } else {
      this.planVisitService.addPlanVisit(event);
    }
  }
}


