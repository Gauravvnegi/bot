import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  DetailsComponent,
  Reservation,
  ReservationTable,
} from '@hospitality-bot/admin/reservation';
import {
  AdminUtilityService,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
import { NotificationService } from 'apps/admin/src/app/core/theme/src/lib/services/notification.service';
import { PreArrivalDatatableComponent } from 'libs/admin/request-analytics/src/lib/components/pre-arrival-datatable/pre-arrival-datatable.component';

import {
  ModuleNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AnalyticsService } from 'libs/admin/request-analytics/src/lib/services/analytics.service';
import { PreArrivalRequestList } from '../../data-models/ex-checkin.model';
import { dashboardPopUpTabs } from '../../constants/dashboard';
import { ReservationService } from '../../services';

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
  selectedTab: string = dashboardPopUpTabs[0].value;
  @ViewChild('request') preArrivalRequestTemplateRef: TemplateRef<any>;
  @ViewChild('guest') preCheckinGuestTemplateRef: TemplateRef<any>;

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

  // onViewPreArrivalRequest() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.width = '100%';
  //   const detailCompRef = this.modalService.openDialog(
  //     PreArrivalDatatableComponent,
  //     dialogConfig
  //   );

  //   detailCompRef.componentInstance.tableName = 'Pre-arrival Request';
  //   detailCompRef.componentInstance.entityType = 'ALL';
  //   detailCompRef.componentInstance.tabFilterIdx = 0;

  //   detailCompRef.componentInstance.onModalClose.subscribe((res) =>
  //     detailCompRef.close()
  //   );
  // }

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
      this.options = [];
      //GET PRE ARRIVAL REQUEST DATA
      this.getPreArrivalRequest();
    } else {
      this.options = [];
      //GET PRE CHECK-IN GUEST DATA
      this.getPreCheckinGuest();
    }
  }

  getPreCheckinGuest() {
    this.loading = true;
    const queryObj = {
      entityId: this.entityId,
      fromDate: moment.utc().startOf('day').valueOf(),
      toDate: moment.utc().endOf('day').valueOf(),
      order: 'DESC',
      entityType: 'ARRIVAL',
      entityState: 'EXPRESSCHECKIN',
    };
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

  getStatusStyle(type: string): string {
    switch (type) {
      case 'INITIATED':
        return 'status-text-initiated';
      case 'PENDING':
        return 'status-text-pending';
      case 'FAILED':
        return 'status-text-reject';
      case 'COMPLETED':
        return 'status-text-success';
    }
  }

  getTemplate() {
    return this.tabFilterItems[this.tabFilterIdx].value ===
      dashboardPopUpTabs[1].value
      ? this.preArrivalRequestTemplateRef
      : this.preCheckinGuestTemplateRef;
  }
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
