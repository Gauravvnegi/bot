import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  DetailsTabOptions,
  Reservation,
  ReservationTable,
} from '@hospitality-bot/admin/reservation';
import {
  AdminUtilityService,
  BookingDetailService,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { NotificationService } from 'apps/admin/src/app/core/theme/src/lib/services/notification.service';
import {
  ModuleNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { Subscription } from 'rxjs';
import { AnalyticsService } from 'libs/admin/request-analytics/src/lib/services/analytics.service';
import { dashboardPopUpTabs } from '../../constants/dashboard';
import { ReservationService } from '../../services';
import { InhouseTable } from 'libs/admin/request-analytics/src/lib/models/inhouse-datatable.model';
import { SideBarService } from 'apps/admin/src/app/core/theme/src/lib/services/sidebar.service';

@Component({
  selector: 'hospitality-bot-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  // providers: [SideBarService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  tables = TableNames;
  welcomeMessage = 'Welcome To Your Dashboard';
  navRoutes: NavRouteOptions = [{ label: 'eFrontdesk Dashboard', link: './' }];
  isSidebarVisible: boolean = false;
  entityId: string;
  loading: boolean = false;
  showCalendarView = false;
  options: any[] = [];
  tabFilterItems = dashboardPopUpTabs;
  tabFilterIdx = 0;
  selectedTab: string = dashboardPopUpTabs[0].value;
  @ViewChild('request') preArrivalRequestTemplateRef: TemplateRef<any>;
  @ViewChild('guest') preCheckinGuestTemplateRef: TemplateRef<any>;

  private $subscription = new Subscription();
  constructor(
    private reservationService: ReservationService,
    private globalFilterService: GlobalFilterService,
    private notificationService: NotificationService,
    private _adminUtilityService: AdminUtilityService,
    private analyticsService: AnalyticsService,
    private sideBarService: SideBarService,
    private bookingDetailService: BookingDetailService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.globalFilterService.toggleFullView.subscribe((res) => {
      this.showCalendarView = res;
    });
    this.listenForStateData();
  }

  get featurePath() {
    return [
      `${ModuleNames.FRONT_DESK_DASHBOARD}.tables.${TableNames.RESERVATION}`,
    ];
  }

  listenForStateData(): void {
    this.$subscription.add(
      this.notificationService.$reservationNotification.subscribe(
        (reservationId) => {
          if (reservationId) {
            this.reservationService
              .getReservationDetailsById(reservationId)
              .subscribe((response) => {
                const data = new Reservation().deserialize(
                  response,
                  this.globalFilterService.timezone
                );
                this.openDetailPage(data);
              });
            this.notificationService.$reservationNotification.next(null);
          }
        }
      )
    );
  }

  openDetailPage(rowData, tabKey?: DetailsTabOptions): void {
    let guestId, bookingNumber;
    if (this.selectedTab === (dashboardPopUpTabs[1].value as string)) {
      //PRE ARRIVAL REQUEST
      guestId = rowData?.guestDetails?.primaryGuest?.id;
      bookingNumber = rowData?.confirmationNumber;
    } else {
      //PRE CHECKIN GUEST
      guestId = rowData?.guests?.primaryGuest?.id;
      bookingNumber = rowData.booking.bookingNumber;
    }
    this.$subscription.add(
      this.bookingDetailService.openBookingDetailSidebar({
        guestId: guestId,
        bookingNumber: bookingNumber,
        ...(tabKey && { tabKey: tabKey }),
      })
    );
  }

  getPreArrivalRequest(queryObj?: any) {
    this.loading = true;
    const query = {
      queryObj: this._adminUtilityService.makeQueryParams([queryObj]),
    };

    this.analyticsService.getInhouseRequest(query).subscribe((res) => {
      this.options = new InhouseTable().deserialize(res).records;

      this.loading = false;
    });
  }

  onSelectedTabFilterChange(data) {
    this.tabFilterIdx = data.index;
    this.selectedTab = this.tabFilterItems[data.index].value;
    this.getRespectiveTabData(data);
  }

  onDateFilterChange(date) {
    this.getRespectiveTabData(date);
  }

  getRespectiveTabData(data) {
    if (
      this.tabFilterItems[this.tabFilterIdx].value ===
      dashboardPopUpTabs[1].value
    ) {
      this.options = [];
      //GET PRE ARRIVAL REQUEST DATA
      this.getPreArrivalRequest({
        fromDate: data.from,
        toDate: data.to,
        order: 'DESC',
        entityType: 'ALL',
        journeyType: 'pre-arrival',
        entityId: this.entityId,
        onArrivalDate: true,
      });
    } else {
      this.options = [];
      //GET PRE CHECK-IN GUEST DATA
      this.getPreCheckinGuest({
        entityId: this.entityId,
        fromDate: data.from,
        toDate: data.to,
        order: 'DESC',
        entityType: 'ARRIVAL',
        entityState: 'EXPRESSCHECKIN',
      });
    }
  }

  getPreCheckinGuest(queryObj?: any) {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([queryObj]),
    };

    this.reservationService.getReservationDetails(config).subscribe(
      (res) => {
        this.options = new ReservationTable().deserialize(
          res,
          this.globalFilterService.timezone
        ).records;

        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getStatusStyle(type: string, state: string): string {
    switch (type?.toUpperCase()) {
      case 'INITIATED':
        return `status-background-initiated`;
      case 'PENDING':
        return `status-background-pending`;
      case 'FAILED':
        return `status-background-reject`;
      case 'COMPLETED':
        return `status-background-success`;
      case 'ACCEPT':
        return `status-background-success`;
      case 'REJECT':
        return `status-background-reject`;
    }
  }

  openExCheckinSidebar() {
    this.scrollToTop();
    this.sideBarService.setSideBarZIndex(130, true);
    this.setNavHeaderZIndex(true);
    this.isSidebarVisible = true;
  }

  setNavHeaderZIndex(condition: boolean) {
    //To set z-index of nav-header-wrapper to 140 when sidebar is open to avoid background overlay on top of sidebar
    const element = document.querySelector('.nav-header-wrapper');
    condition
      ? element.setAttribute('style', 'z-index: 140 !important')
      : element.removeAttribute('style');
  }

  closeSidebar() {
    this.sideBarService.setSideBarZIndex(0, false);
    this.setNavHeaderZIndex(false);
    this.isSidebarVisible = false;
  }

  scrollToTop() {
    const mainLayout = document.getElementById('main-layout');
    mainLayout?.scrollTo(0, 0);
  }

  getTemplate() {
    return this.tabFilterItems[this.tabFilterIdx].value ===
      dashboardPopUpTabs[1].value
      ? this.preArrivalRequestTemplateRef
      : this.preCheckinGuestTemplateRef;
  }
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.bookingDetailService.resetBookingState();
  }
}
