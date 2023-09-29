import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  DetailsComponent,
  Reservation,
} from '@hospitality-bot/admin/reservation';
import {
  AdminUtilityService,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
import { NotificationService } from 'apps/admin/src/app/core/theme/src/lib/services/notification.service';
import { PreArrivalDatatableComponent } from 'libs/admin/request-analytics/src/lib/components/pre-arrival-datatable/pre-arrival-datatable.component';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import {
  ModuleNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AnalyticsService } from 'libs/admin/request-analytics/src/lib/services/analytics.service';
import { PreArrivalRequestList } from '../../data-models/ex-checkin.model';
import { dashboardPopUpTabs } from '../../constants/dashboard';

@Component({
  selector: 'hospitality-bot-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  tables = TableNames;
  welcomeMessage = 'Welcome To Your Dashboard';
  navRoutes: NavRouteOptions = [{ label: 'eFrontdesk Dashboard', link: './' }];
  isSidebarVisible: boolean = false;
  entityId: string;
  loading: boolean = false;
  options: any[] = [];
  tabFilterItems = dashboardPopUpTabs;
  tabFilterIdx = 0;
  private $subscription = new Subscription();
  constructor(
    private reservationService: ReservationService,
    private globalFilterService: GlobalFilterService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private _adminUtilityService: AdminUtilityService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;

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
        (response) => {
          if (response) {
            this.reservationService
              .getReservationDetails(response)
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

  openDetailPage(rowData): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.guestId = rowData.guests.primaryGuest.id;
    detailCompRef.componentInstance.bookingNumber =
      rowData.booking.bookingNumber;

    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((_) => {
        detailCompRef.close();
      })
    );
  }

  onViewPreArrivalRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      PreArrivalDatatableComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = 'Pre-arrival Request';
    detailCompRef.componentInstance.entityType = 'ALL';
    detailCompRef.componentInstance.tabFilterIdx = 0;

    detailCompRef.componentInstance.onModalClose.subscribe((res) =>
      detailCompRef.close()
    );
  }

  getPreArrivalRequest() {
    this.loading = true;
    const query = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          fromDate: moment.utc().startOf('day').valueOf(),
          toDate: moment.utc().endOf('day').valueOf(),
          order: 'DESC',
          entityType: 'ALL',
          journeyType: 'pre-arrival',
          entityId: this.entityId,
        },
      ]),
    };

    this.analyticsService.getInhouseRequest(query).subscribe((res) => {
      this.options = new PreArrivalRequestList().deserialize(
        res
      ).PreArrivalRequest;
      this.loading = false;
    });
  }

  onSelectedTabFilterChange(index: number) {
    this.tabFilterIdx = index;

    if (this.tabFilterItems[index].value === dashboardPopUpTabs[1].value) {
      this.getPreArrivalRequest();
    } else {dashboardPopUpTabs;
      this.options = [];
    }
  }
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
